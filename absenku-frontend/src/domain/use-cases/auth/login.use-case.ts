import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginRequestDto } from "@/data/dto/auth.dto";
import { User } from "@/domain/entities/user.entity";

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: LoginRequestDto): Promise<User> {
    return this.authRepository.login(params);
  }
}
