import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ClockOutDto {
  @IsNotEmpty({ message: 'ID absen harus diisi' })
  @IsString({ message: 'ID absen harus berupa string' })
  attendanceId: string;

  @IsNotEmpty({ message: 'Latitude harus diisi' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude harus berupa angka' })
  lat: number;

  @IsNotEmpty({ message: 'Longitude harus diisi' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude harus berupa angka' })
  lng: number;
}
