import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { UpbjjService } from './upbjj.service';
import { ApiTags } from '@nestjs/swagger';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';
import { PermissionGuard } from 'src/infrastructure/guards/permission.guard';
import { RequirePermission } from 'src/infrastructure/decorators/require-permission.decorator';

@ApiTags('upbjj')
@UseGuards(RestAPIGuard, PermissionGuard)
@Controller('/api/v1/upbjj')
export class UpbjjController {
    constructor(private readonly upbjjService: UpbjjService) {}

    /**
     * GET /api/v1/upbjj
     * Get all active UPBJJ
     */
    @RequirePermission('upbjj.view')
    @Get()
    async getAllUpbjj() {
        const data = await this.upbjjService.getAllUpbjj();
        return {
            success: true,
            message: 'UPBJJ list retrieved successfully',
            data,
        };
    }

    /**
     * GET /api/v1/upbjj/backup-statistics/all
     * Get backup statistics grouped by UPBJJ for Indonesia map dashboard
     * Query params: startDate, endDate (optional)
     * IMPORTANT: This must be before :id route to avoid route matching issues
     */
    @RequirePermission('upbjj.view')
    @Get('backup-statistics/all')
    async getBackupStatistics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const data = await this.upbjjService.getBackupStatisticsByUpbjj(
            startDate,
            endDate,
        );
        return {
            success: true,
            message: 'Backup statistics retrieved successfully',
            data,
        };
    }

    /**
     * GET /api/v1/upbjj/:id
     * Get UPBJJ by ID
     */
    @RequirePermission('upbjj.view')
    @Get(':id')
    async getUpbjjById(@Param('id', ParseIntPipe) id: number) {
        const data = await this.upbjjService.getUpbjjById(id);
        return {
            success: true,
            message: 'UPBJJ retrieved successfully',
            data,
        };
    }

}
