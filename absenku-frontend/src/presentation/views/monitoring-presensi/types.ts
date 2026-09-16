export type AttendanceStatusFilter =
  | "ALL"
  | "ON_TIME"
  | "LATE"
  | "NOT_CHECKED_OUT";

export interface MonitorAttendanceItem {
  id: string;
  userId: string;
  userName: string;
  userNik?: string;
  userEmail?: string;
  divisionId?: string;
  divisionName?: string;
  date: string;
  timeIn: string;
  timeOut?: string | null;
  status: "on_time" | "late";
  statusLabel?: string;
  photoUrl?: string | null;
  clockOutPhotoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  clockOutLatitude?: number | null;
  clockOutLongitude?: number | null;
  workDurationHours?: number | null;
  workDurationLabel?: string | null;
  isTargetMet?: boolean | null;
}

export interface MonitorStats {
  total: number;
  onTime: number;
  late: number;
  notCheckedOut: number;
}
