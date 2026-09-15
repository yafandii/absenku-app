import { UserRepository } from "@/domain/repositories/user.repository";
import { User } from "@/domain/entities/user.entity";
import { UpdateUserDto } from "@/data/dto/user.dto";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: UpdateUserDto): Promise<User> {
    return this.userRepository.update(payload);
  }
}
