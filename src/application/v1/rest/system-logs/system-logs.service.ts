import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between, Like } from 'typeorm';
import { SystemLogEntity } from '../../../../entities/system-log.entity'; // Fixed path
import { GetLogsDto } from './dto/get-logs.dto';

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLogEntity)
    private readonly systemLogsRepository: Repository<SystemLogEntity>,
  ) {}

  /**
   * Save a log entry to the database (Fire-and-forget style recommended)
   * The 'createLog' logic can be called by interceptors or other services.
   */
  async createLog(data: Partial<SystemLogEntity>): Promise<SystemLogEntity> {
    const log = this.systemLogsRepository.create({
      ...data,
      timestamp: new Date(), // ensure timestamp is set if not provided
    });
    return await this.systemLogsRepository.save(log);
  }

  async getLogs(query: GetLogsDto) {
    const { level, source, timeRange, page = 1, limit = 50 } = query;
    
    // Build query conditions
    const where: any = {};
    if (level && level !== 'all') {
      where.level = level;
    }
    if (source && source !== 'all') {
        where.source = source;
    }

    // Time range filter
    const now = new Date();
    if (timeRange) {
        let threshold: Date;
        switch (timeRange) {
            case '1h':
                threshold = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case '6h':
                threshold = new Date(now.getTime() - 6 * 60 * 60 * 1000);
                break;
            case '24h':
                threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day
                break;
            case '7d':
                threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days
                break;
            default:
                threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default 1 day
        }
        where.timestamp = MoreThan(threshold);
    }

    // Execute query with pagination
    const [logs, total] = await this.systemLogsRepository.findAndCount({
      where,
      order: {
        timestamp: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getLogSummary(query: { month: number; year: number }) {
      const { month, year } = query;
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // We can use a single query with grouping or multiple counts.
      // For simplicity and to match the previous structure:
      
      const allLogs = await this.systemLogsRepository.find({
          where: {
              timestamp: Between(startDate, endDate)
          }
      });

      const summary = {
          total: allLogs.length,
          levels: {
              ERROR: 0,
              WARNING: 0,
              INFO: 0,
              DEBUG: 0
          },
          sources: {
              Backend: 0,
              Worker: 0,
              System: 0
          },
          activityPerDay: {} // { "YYYY-MM-DD": count }
      };

      for (const log of allLogs) {
          const level = log.level.toUpperCase();
          if (summary.levels[level] !== undefined) {
             summary.levels[level]++;
          } else {
             summary.levels[level] = 1;
          }

          const source = log.source;
          if (summary.sources[source] !== undefined) {
              summary.sources[source]++;
          } else {
              summary.sources[source] = 1; // Initialize dynamic sources
          }

          const day = log.timestamp.toISOString().split('T')[0];
          if (summary.activityPerDay[day]) {
              summary.activityPerDay[day]++;
          } else {
              summary.activityPerDay[day] = 1;
          }
      }
      
      return summary;
  }
}
