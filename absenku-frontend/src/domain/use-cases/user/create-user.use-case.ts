import { UserRepository } from "@/domain/repositories/user.repository";
import { User } from "@/domain/entities/user.entity";
import { CreateUserDto } from "@/data/dto/user.dto";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: CreateUserDto): Promise<User> {
    return this.userRepository.create(payload);
  }
}
