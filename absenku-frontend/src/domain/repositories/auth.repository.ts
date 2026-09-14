import { User } from "@/domain/entities/user.entity";
import { LoginRequestDto } from "@/data/dto/auth.dto";

export interface AuthRepository {
  login(credentials: LoginRequestDto): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  getUser(): Promise<User>;
}
