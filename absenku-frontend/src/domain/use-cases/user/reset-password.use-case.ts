import { UserRepository } from "@/domain/repositories/user.repository";
import { ResetPasswordDto } from "@/data/dto/user.dto";

export class ResetPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: ResetPasswordDto): Promise<{ message: string }> {
    return this.userRepository.resetPassword(payload);
  }
}
