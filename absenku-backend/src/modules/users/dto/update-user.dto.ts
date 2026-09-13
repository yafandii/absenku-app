import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'ID wajib diisi' })
  id: string;

  @IsOptional()
  @IsString({ message: 'Nama harus berupa string' })
  @MinLength(3, { message: 'Nama minimal 3 karakter' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message:
      'Nama hanya boleh berisi huruf dan spasi, tidak boleh ada angka atau simbol',
  })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role harus bernilai EMPLOYEE atau HRD' })
  role: Role;

  @IsOptional()
  @IsInt({ message: 'ID divisi harus berupa angka' })
  divisionId: number;
}
