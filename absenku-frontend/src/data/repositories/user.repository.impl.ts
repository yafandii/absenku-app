import { UserRepository } from "@/domain/repositories/user.repository";
import { User } from "@/domain/entities/user.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from "@/data/dto/user.dto";
import {
  UserDataSource,
  UserRemoteDataSource,
} from "@/data/data-sources/user.data-source";

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private remoteDataSource: UserDataSource = new UserRemoteDataSource(),
  ) {}

  async getAll(): Promise<User[]> {
    return this.remoteDataSource.getAll();
  }

  async create(payload: CreateUserDto): Promise<User> {
    return this.remoteDataSource.create(payload);
  }

  async update(payload: UpdateUserDto): Promise<User> {
    return this.remoteDataSource.update(payload);
  }

  async delete(id: string): Promise<void> {
    return this.remoteDataSource.delete(id);
  }

  async changePassword(
    payload: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.remoteDataSource.changePassword(payload);
  }

  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    return this.remoteDataSource.resetPassword(payload);
  }
}

