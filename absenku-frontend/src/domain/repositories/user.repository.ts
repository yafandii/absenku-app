import { User } from "@/domain/entities/user.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from "@/data/dto/user.dto";

export interface UserRepository {
  getAll(): Promise<User[]>;
  create(payload: CreateUserDto): Promise<User>;
  update(payload: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  changePassword(payload: ChangePasswordDto): Promise<{ message: string }>;
  resetPassword(payload: ResetPasswordDto): Promise<{ message: string }>;
}

