import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MUpbjj } from '../../../../entities/m-upbjj.entity';

@Injectable()
export class UpbjjService {
    constructor(
        @InjectRepository(MUpbjj)
        private upbjjRepository: Repository<MUpbjj>
    ) {}

    /**
     * Get all active UPBJJ
     */
    async getAllUpbjj() {
        return await this.upbjjRepository.find({
            where: { statusAktif: 1 },
            order: { namaUpbjj: 'ASC' },
        });
    }

    /**
     * Get UPBJJ by ID
     */
    async getUpbjjById(id: number) {
        return await this.upbjjRepository.findOne({
            where: { id },
        });
    }

    /**
     * Get backup statistics grouped by UPBJJ
     * Returns data for Indonesia backup dashboard map
     */
    async getBackupStatisticsByUpbjj(startDate?: string, endDate?: string) {
        // Construct the join condition with date filters directly
        let joinCondition = 'backup.user_id = user.id';
        const params: any = { statusAktif: 1 };

        if (startDate) {
            joinCondition += ' AND backup.started_at >= :startDate';
            params.startDate = startDate;
        }
        if (endDate) {
            joinCondition += ' AND backup.started_at <= :endDate';
            params.endDate = endDate;
        }

        // Query from UPBJJ table and join to users and backup jobs
        const queryBuilder = this.upbjjRepository
            .createQueryBuilder('upbjj')
            .leftJoin('upbjj.users', 'user')
            // .leftJoin(TBackupJob, 'backup', joinCondition, params)
            .select('upbjj.id', 'upbjjId')
            .addSelect('upbjj.kode_upbjj', 'kodeUpbjj')
            .addSelect('upbjj.nama_upbjj', 'namaUpbjj')
            .addSelect('upbjj.latitude', 'latitude')
            .addSelect('upbjj.longitude', 'longitude')
            .addSelect('COUNT(backup.id)', 'totalJobs')
            .addSelect(
                `SUM(CASE WHEN backup.status = 'COMPLETED' THEN 1 ELSE 0 END)`,
                'completedJobs',
            )
            .addSelect(
                `SUM(CASE WHEN backup.status = 'FAILED' THEN 1 ELSE 0 END)`,
                'failedJobs',
            )
            .addSelect(
                `SUM(CASE WHEN backup.status = 'IN_PROGRESS' THEN 1 ELSE 0 END)`,
                'inProgressJobs',
            )
            .where('upbjj.status_aktif = :statusAktif', { statusAktif: 1 })
            .groupBy('upbjj.id')
            .addGroupBy('upbjj.kode_upbjj')
            .addGroupBy('upbjj.nama_upbjj')
            .addGroupBy('upbjj.latitude')
            .addGroupBy('upbjj.longitude');

        // Removed WHERE clauses for dates as they are now in the JOIN condition

        const results = await queryBuilder.getRawMany();

        // Calculate percentage for each UPBJJ
        return results.map(result => {
            const total = parseInt(result.totalJobs) || 0;
            const completed = parseInt(result.completedJobs) || 0;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                upbjjId: result.upbjjId,
                kodeUpbjj: result.kodeUpbjj,
                upbjjName: result.namaUpbjj,
                latitude: parseFloat(result.latitude) || 0,
                longitude: parseFloat(result.longitude) || 0,
                totalJobs: total,
                completedJobs: completed,
                failedJobs: parseInt(result.failedJobs) || 0,
                inProgressJobs: parseInt(result.inProgressJobs) || 0,
                successPercentage: percentage,
            };
        });
    }

}
