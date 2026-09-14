import { apiClient } from "@/infrastructure/http/api-client";
import { API_ENDPOINTS } from "@/infrastructure/http/endpoints";
import {
  ClockInRequestDto,
  AttendanceResponseDto,
} from "@/data/dto/attendance.dto";
import { AxiosInstance } from "axios";

export interface AttendanceDataSource {
  clockIn(request: ClockInRequestDto): Promise<AttendanceResponseDto>;
  getMyHistory(): Promise<AttendanceResponseDto[]>;
  getToday(): Promise<AttendanceResponseDto | null>;
}

export class AttendanceRemoteDataSource implements AttendanceDataSource {
  private serverApi: AxiosInstance;

  constructor(serverApi: AxiosInstance = apiClient) {
    this.serverApi = serverApi;
  }
  async clockIn(request: ClockInRequestDto): Promise<AttendanceResponseDto> {
    const response = await this.serverApi.post<AttendanceResponseDto>(
      API_ENDPOINTS.ATTENDANCE.CLOCKIN,
      request,
    );
    return response.data;
  }

  async getMyHistory(): Promise<AttendanceResponseDto[]> {
    const response = await this.serverApi.get<AttendanceResponseDto[]>(
      API_ENDPOINTS.ATTENDANCE.MYHISTORY,
    );
    return response.data;
  }

  async getToday(): Promise<AttendanceResponseDto | null> {
    const response = await this.serverApi.get<AttendanceResponseDto | null>(
      API_ENDPOINTS.ATTENDANCE.TODAY,
    );
    return response.data;
  }
}
