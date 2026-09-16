import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class ChangePasswordUserDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
