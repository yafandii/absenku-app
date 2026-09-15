import { UserRepository } from "@/domain/repositories/user.repository";
import { User } from "@/domain/entities/user.entity";

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.getAll();
  }
}
