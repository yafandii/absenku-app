export interface AttendanceEntity {
  id: string;
  userId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  date: string;
  timeIn: string;
  timeOut?: string | null;
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

export interface SummaryAttendanceEntity {
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
