import { Controller, Get, Query, Logger, UseGuards } from '@nestjs/common';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';
import { PermissionGuard } from 'src/infrastructure/guards/permission.guard';
import { RequirePermission } from 'src/infrastructure/decorators/require-permission.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SystemLogsService } from './system-logs.service';
import { GetLogsDto } from './dto/get-logs.dto';
import { LogSummaryDto } from './dto/log-summary.dto';

@Controller('/api/v1/system-logs')
@ApiTags('System Logs')
export class SystemLogsController {
  private readonly logger = new Logger(SystemLogsController.name);

  constructor(private readonly systemLogsService: SystemLogsService) {
    this.logger.log('SystemLogsController initialized');
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('system.logs.view')
  @Get('summary')
  @ApiOperation({ summary: 'Get system log summary statistics' })
  async getLogSummary(@Query() query: LogSummaryDto) {
      return {
          success: true,
          data: await this.systemLogsService.getLogSummary({
              month: Number(query.month),
              year: Number(query.year)
          })
      };
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('system.logs.view')
  @Get()
  @ApiOperation({ summary: 'Get system logs with filtering' })
  async getLogs(@Query() query: GetLogsDto) {
    return {
        success: true,
        data: await this.systemLogsService.getLogs(query)
    };
  }
}
