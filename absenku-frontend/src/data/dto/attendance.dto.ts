export interface ClockInRequestDto {
  photo: string;
  lat: number;
  lng: number;
}

export interface ClockOutRequestDto {
  attendanceId: string;
  photo: string;
  lat: number;
  lng: number;
}

export interface AttendanceResponseDto {
  id: string;
  userId: string;
  userName?: string;
  userNik?: string;
  userEmail?: string;
  divisionId?: string | null;
  divisionName?: string | null;
  date?: string;
  timeIn?: string;
  timeOut?: string | null;
  photoUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  type: string;
  status: "on_time" | "late";
  statusLabel: string;
  clockOutAt?: string | null;
  clockOutPhotoUrl?: string | null;
  clockOutLatitude?: number | null;
  clockOutLongitude?: number | null;
  workDurationHours?: number | null;
  workDurationLabel?: string | null;
  isTargetMet?: boolean | null;
  workTimeStatus?: string | null;
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

export interface MonthlySummaryResponseDto {
  period: string;
  workHours: {
    total: number;
    target: number;
    unit: string;
    subtext: string;
    isTargetReached: boolean;
  };
  lateness: {
    count: number;
    unit: string;
    maxAllowed: number;
    subtext: string;
    status: "safe" | "warning" | "danger";
  };
  attendance: {
    presentDays: number;
    totalWorkingDays: number;
    remainingDays: number;
    unit: string;
    subtext: string;
  };
  discipline: {
    percentage: number;
    label: string;
    status: "good" | "needs_improvement";
  };
}
