import { UserRepository } from "@/domain/repositories/user.repository";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
