import { BaseMasterResponseDto } from "../dto/masters.dto";
import { API_ENDPOINTS } from "@/infrastructure/http/endpoints";
import { apiClient } from "@/infrastructure/http/api-client";
import { AxiosInstance } from "axios";

export interface MastersDataSource {
  getDivisions(): Promise<BaseMasterResponseDto[]>;
}

export class MastersRemoteDataSource implements MastersDataSource {
  private serverApi: AxiosInstance;

  constructor(serverApi: AxiosInstance = apiClient) {
    this.serverApi = serverApi;
  }
  async getDivisions(): Promise<BaseMasterResponseDto[]> {
    try {
      const response = await this.serverApi.get<BaseMasterResponseDto[]>(
        API_ENDPOINTS.MASTER.DIVISIONS,
      );
      return response.data;
    } catch {
      return [];
    }
  }
}
