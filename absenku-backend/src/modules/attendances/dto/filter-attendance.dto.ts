import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterAttendanceDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'divisionId harus berupa angka' })
  divisionId?: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page harus berupa angka' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit harus berupa angka' })
  limit?: number;
}
