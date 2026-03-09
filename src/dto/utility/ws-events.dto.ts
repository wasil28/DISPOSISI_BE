import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for 'changeUpbjj' event
 */
export class ChangeUpbjjDto {
  @IsNotEmpty({ message: 'upbjjId is required' })
  @IsNumber({}, { message: 'upbjjId must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'upbjjId must be a positive number' })
  upbjjId: number;
}
