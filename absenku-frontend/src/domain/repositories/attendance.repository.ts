import {
  AttendanceEntity,
  SummaryAttendanceEntity,
} from "@/domain/entities/attendance.entity";
import {
  ClockInRequestDto,
  ClockOutRequestDto,
} from "@/data/dto/attendance.dto";

export interface AttendanceRepository {
  clockIn(payload: ClockInRequestDto): Promise<AttendanceEntity>;
  clockOut(payload: ClockOutRequestDto): Promise<AttendanceEntity>;
  getMyHistory(): Promise<AttendanceEntity[]>;
  getToday(): Promise<AttendanceEntity | null>;
  getSummaryAttendance(): Promise<SummaryAttendanceEntity | null>;
  getAllAttendances(params?: {
    page?: number;
    limit?: number;
  }): Promise<AttendanceEntity[]>;
}

