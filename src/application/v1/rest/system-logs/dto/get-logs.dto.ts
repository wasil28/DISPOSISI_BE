
export class GetLogsDto {
  level?: string;
  source?: string;
  timeRange?: string; // '1h', '6h', '24h', '7d'
  page?: number;
  limit?: number;
}
