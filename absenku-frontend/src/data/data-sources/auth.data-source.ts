import { apiClient } from "@/infrastructure/http/api-client";
import { API_ENDPOINTS } from "@/infrastructure/http/endpoints";
import { LoginRequestDto, LoginResponseDto } from "@/data/dto/auth.dto";
import { User } from "@/domain/entities/user.entity";
import { AxiosInstance } from "axios";

export interface AuthDataSource {
  login(request: LoginRequestDto): Promise<LoginResponseDto>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  getAllUser(): Promise<User[]>;
}

export class AuthRemoteDataSource implements AuthDataSource {
  private serverApi: AxiosInstance;
  constructor(serverApi: AxiosInstance = apiClient) {
    this.serverApi = serverApi;
  }

  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.serverApi.post<LoginResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      request,
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getUser(): Promise<User> {
    try {
      const response = await this.serverApi.get<User>(
        API_ENDPOINTS.AUTH.USER_ME,
      );
      return response.data;
    } catch (error) {
      console.error(
        "[AuthRemoteDataSource.getUser] Gagal mengambil data user:",
        error,
      );
      throw error;
    }
  }

  async getAllUser(): Promise<User[]> {
    const response = await this.serverApi.get<User[]>(
      API_ENDPOINTS.AUTH.USER_ALL,
    );
    return response.data;
  }
}
