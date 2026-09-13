import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Matches } from 'class-validator';

export class MyHistoryQueryDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Format tanggal harus YYYY-MM-DD (contoh: 1900-01-31)' },
  )
  date?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'Format bulan harus YYYY-MM (contoh: 2026-09)',
  })
  month?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page harus berupa angka' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit harus berupa angka' })
  limit?: number;
}
