export interface AttendanceEntity {
  id: string;
  date: string;
  time: string;
  type: string;
  status: "on_time" | "late";
  statusLabel: string;
  avatarUrl?: string;
}

export type Attendance = AttendanceEntity;

