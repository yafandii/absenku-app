import { AxiosInstance } from "axios";
import { apiClient } from "@/infrastructure/http/api-client";
import { API_ENDPOINTS } from "@/infrastructure/http/endpoints";
import { User } from "@/domain/entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "@/data/dto/user.dto";

export interface UserDataSource {
  getAll(): Promise<User[]>;
  create(payload: CreateUserDto): Promise<User>;
  update(payload: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}

export class UserRemoteDataSource implements UserDataSource {
  private serverApi: AxiosInstance;

  constructor(serverApi: AxiosInstance = apiClient) {
    this.serverApi = serverApi;
  }

  async getAll(): Promise<User[]> {
    const response = await this.serverApi.get<User[]>(
      API_ENDPOINTS.AUTH.USER_ALL,
    );
    return response.data;
  }

  async create(payload: CreateUserDto): Promise<User> {
    const response = await this.serverApi.post<User>(
      API_ENDPOINTS.EMPLOYEE.CREATE,
      payload,
    );
    return response.data;
  }

  async update(payload: UpdateUserDto): Promise<User> {
    const response = await this.serverApi.put<User>(
      `${API_ENDPOINTS.EMPLOYEE.UPDATE}`,
      payload,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.serverApi.delete(`${API_ENDPOINTS.EMPLOYEE.DELETE}`, {
      data: { id },
    });
  }
}
