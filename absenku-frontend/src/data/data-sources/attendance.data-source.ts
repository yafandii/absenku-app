import { apiClient } from "@/infrastructure/http/api-client";
import { API_ENDPOINTS } from "@/infrastructure/http/endpoints";
import {
  ClockInRequestDto,
  AttendanceResponseDto,
  PaginatedAttendanceResponseDto,
  MonthlySummaryResponseDto,
  ClockOutRequestDto,
} from "@/data/dto/attendance.dto";
import { AxiosInstance } from "axios";

export interface AttendanceDataSource {
  clockIn(request: ClockInRequestDto): Promise<AttendanceResponseDto>;
  clockOut(request: ClockOutRequestDto): Promise<AttendanceResponseDto>;
  getMyHistory(): Promise<PaginatedAttendanceResponseDto>;
  getToday(): Promise<AttendanceResponseDto | null>;
  getgetSummaryAttendance(): Promise<MonthlySummaryResponseDto | null>;
}

export class AttendanceRemoteDataSource implements AttendanceDataSource {
  private serverApi: AxiosInstance;

  constructor(serverApi: AxiosInstance = apiClient) {
    this.serverApi = serverApi;
  }
  async getgetSummaryAttendance(): Promise<MonthlySummaryResponseDto | null> {
    try {
      const response = await this.serverApi.get<MonthlySummaryResponseDto>(
        API_ENDPOINTS.ATTENDANCE.MONTHLYSUMMARY,
      );

      return response.data;
    } catch {
      return null;
    }
  }
  async clockIn(request: ClockInRequestDto): Promise<AttendanceResponseDto> {
    const blob = await fetch(request.photo).then((res) => res.blob());

    const file = new File([blob], "photo.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("lat", request.lat!.toString());
    formData.append("lng", request.lng!.toString());

    const response = await this.serverApi.post<AttendanceResponseDto>(
      API_ENDPOINTS.ATTENDANCE.CLOCKIN,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async clockOut(request: ClockOutRequestDto): Promise<AttendanceResponseDto> {
    const blob = await fetch(request.photo).then((res) => res.blob());

    const file = new File([blob], "photo.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("attendanceId", request.attendanceId.toString());
    formData.append("photo", file);
    formData.append("lat", request.lat!.toString());
    formData.append("lng", request.lng!.toString());

    const response = await this.serverApi.post<{
      data?: AttendanceResponseDto;
    } & AttendanceResponseDto>(
      API_ENDPOINTS.ATTENDANCE.CLOCKOUT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const raw = response.data;
    if (raw.data && typeof raw.data === "object" && "id" in raw.data && raw.data.id) {
      return raw.data as AttendanceResponseDto;
    }
    return raw as AttendanceResponseDto;
  }

  async getMyHistory(): Promise<PaginatedAttendanceResponseDto> {
    const response = await this.serverApi.get<PaginatedAttendanceResponseDto>(
      API_ENDPOINTS.ATTENDANCE.MYHISTORY,
    );

    return response.data;
  }

  async getToday(): Promise<AttendanceResponseDto | null> {
    try {
      const response = await this.serverApi.get<{
        data?: {
          alreadyAttendance?: boolean;
          data?: AttendanceResponseDto | null;
        } & AttendanceResponseDto;
        id?: string;
      } & AttendanceResponseDto>(API_ENDPOINTS.ATTENDANCE.TODAY);

      if (!response?.data) return null;

      const raw = response.data;
      if (raw.data && typeof raw.data === "object" && "data" in raw.data && raw.data.data?.id) {
        return raw.data.data;
      }

      if (raw.data && typeof raw.data === "object" && "id" in raw.data && raw.data.id) {
        return raw.data as AttendanceResponseDto;
      }

      if (raw.id) {
        return raw as AttendanceResponseDto;
      }

      return null;
    } catch {
      return null;
    }
  }
}
