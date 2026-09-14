export interface ClockInRequestDto {
  photo?: string;
  latitude?: number;
  longitude?: number;
}

export interface AttendanceResponseDto {
  id: string;
  date: string;
  time: string;
  type: string;
  status: "on_time" | "late";
  statusLabel?: string;
  avatarUrl?: string;
}
