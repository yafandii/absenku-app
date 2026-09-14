import { AuthRepository } from "@/domain/repositories/auth.repository";

export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
