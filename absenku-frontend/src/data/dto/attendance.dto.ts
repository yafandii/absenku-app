export interface ClockInRequestDto {
  photo?: string;
  latitude?: number;
  longitude?: number;
}

export interface AttendanceResponseDto {
  id: string;
  userId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  type: string;
  status: "on_time" | "late";
  statusLabel?: string;
  avatarUrl?: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedAttendanceResponseDto {
  pagination: PaginationDto;
  data: AttendanceResponseDto[];
}
