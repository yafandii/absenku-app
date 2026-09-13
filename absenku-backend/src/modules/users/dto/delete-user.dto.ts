import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty({ message: 'ID wajib diisi' })
  id: string;
}
