import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClockInDto {
  @IsNotEmpty({ message: 'Latitude harus diisi' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude harus berupa angka' })
  lat: number;

  @IsNotEmpty({ message: 'Longitude harus diisi' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude harus berupa angka' })
  lng: number;
}
