import { UserRepository } from "@/domain/repositories/user.repository";
import { ChangePasswordDto } from "@/data/dto/user.dto";

export class ChangePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: ChangePasswordDto): Promise<{ message: string }> {
    return this.userRepository.changePassword(payload);
  }
}
