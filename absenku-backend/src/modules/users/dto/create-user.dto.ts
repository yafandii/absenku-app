import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  name: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsEnum(Role, { message: 'Role harus bernilai EMPLOYEE atau HRD' })
  role: Role;

  @IsOptional()
  @IsString({ message: 'ID divisi harus berupa string' })
  divisionId?: string;
}
