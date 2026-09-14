import { AuthRepository } from "@/domain/repositories/auth.repository";
import { User } from "@/domain/entities/user.entity";
import { LoginRequestDto } from "@/data/dto/auth.dto";
import {
  AuthDataSource,
  AuthRemoteDataSource,
} from "@/data/data-sources/auth.data-source";
import { authStorage } from "@/infrastructure/http/auth-storage";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private remoteDataSource: AuthDataSource = new AuthRemoteDataSource(),
    private storage: typeof authStorage = authStorage,
  ) {}

  async login(credentials: LoginRequestDto): Promise<User> {
    const response = await this.remoteDataSource.login(credentials);
    const user: User = {
      id: response.id || credentials.id,
      name: response.name || credentials.id,
      role: response.role || "employee",
      email: response.email,
    };
    return user;
  }

  async logout(): Promise<void> {
    try {
      await this.remoteDataSource.logout();
    } finally {
      this.storage.clearAuth();
    }
  }

  getCurrentUser(): User | null {
    return this.storage.getUser<User>();
  }

  async getUser(): Promise<User> {
    return this.remoteDataSource.getUser();
  }
}
