import { User } from "@/domain/entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "@/data/dto/user.dto";

export interface UserRepository {
  getAll(): Promise<User[]>;
  create(payload: CreateUserDto): Promise<User>;
  update(payload: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}
