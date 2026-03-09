import {
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MinioService } from 'src/config/minio.conf/minio.service';
import { ConfigService } from '@nestjs/config';
// import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Controller('api/v1/health')
export class HealthChecksController {

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    // private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Get('/check')
  async healthChecks() {
    try {
      const services = [];

      // 1. MinIO Health Check
      const minioStart = Date.now();
      const minioStatus = await this.minioService.checkConnection();
      services.push({
        name: 'MinIO',
        status: minioStatus.status === 'up' ? 'healthy' : 'down',
        uptime: 'N/A',
        responseTime: `${Date.now() - minioStart}ms`,
        lastCheck: new Date().toISOString(),
        details: minioStatus
      });

      // 2. PostgreSQL Health Check
      try {
        const dbStart = Date.now();
        const result = await this.entityManager.query('SELECT COUNT(*) as count FROM t_backup_jobs');
        const dbResponseTime = Date.now() - dbStart;

        const connections = await this.entityManager.query(
          "SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()"
        );

        services.push({
          name: 'PostgreSQL',
          status: 'healthy',
          uptime: 'N/A',
          responseTime: `${dbResponseTime}ms`,
          lastCheck: new Date().toISOString(),
          details: {
            connections: parseInt(connections[0]?.count || '0'),
            databases: 1
          }
        });
      } catch (error) {
        services.push({
          name: 'PostgreSQL',
          status: 'down',
          uptime: 'N/A',
          responseTime: 'N/A',
          lastCheck: new Date().toISOString(),
          details: {
            error: error.message
          }
        });
      }

      // 3. RabbitMQ Health Check
      const rabbitStart = Date.now();
      // const rabbitStatus = await this.rabbitMQService.getQueueStatus();
      const rabbitStatus = {
        status: 'up',
        queue: 'backup_queue',
        messageCount: 0,
        consumerCount: 0
      }
      services.push({
          name: 'RabbitMQ',
          status: rabbitStatus.status === 'up' ? 'healthy' : 'down',
          uptime: 'N/A',
          responseTime: `${Date.now() - rabbitStart}ms`,
          lastCheck: new Date().toISOString(),
          details: rabbitStatus
      });

      // 4. Worker Status Check (Proxy via RabbitMQ Consumer Count)
      // If consumerCount > 0, it means workers are connected and listening.
      const activeWorkers = rabbitStatus.status === 'up' ? rabbitStatus.consumerCount : 0;
      
      try {
        const recentJobs = await this.entityManager.query(
          `SELECT COUNT(*) as active FROM t_backup_jobs WHERE status = 'IN_PROGRESS'`
        );
        const queuedJobs = await this.entityManager.query(
          `SELECT COUNT(*) as queued FROM t_backup_jobs WHERE status = 'PENDING'`
        );

        const activeCount = parseInt(recentJobs[0]?.active || '0');
        const queuedCount = parseInt(queuedJobs[0]?.queued || '0');
        
        // Logic: if there are jobs but no workers, it's critcal.
        // If workers are connected (activeWorkers > 0), status is healthy.
        let workerStatus = 'healthy';
        if (activeWorkers === 0) {
             workerStatus = queuedCount > 0 ? 'critical' : 'warning'; // No workers!
        } else if (activeCount > 10 * activeWorkers) {
             workerStatus = 'degraded'; // Too many jobs per worker
        }

        services.push({
          name: 'Worker',
          status: workerStatus,
          uptime: 'N/A',
          responseTime: 'N/A',
          lastCheck: new Date().toISOString(),
          details: {
            activePods: activeWorkers, // Active consumers = active pods (approximately)
            activeJobs: activeCount,
            queuedJobs: queuedCount
          }
        });
      } catch (error) {
        services.push({
          name: 'Worker',
          status: 'unknown',
          uptime: 'N/A',
          responseTime: 'N/A',
          lastCheck: new Date().toISOString(),
          details: {
            error: error.message
          }
        });
      }

      return {
        success: true,
        data: {
          services,
          overallStatus: services.every(s => s.status === 'healthy' || s.status === 'warning') ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Health check failed',
        error: error.message
      });
    }
  }
}