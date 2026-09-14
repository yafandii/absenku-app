import { Attendance } from "@/domain/entities/attendance.entity";
import { ClockInRequestDto } from "@/data/dto/attendance.dto";

export interface AttendanceRepository {
  clockIn(payload: ClockInRequestDto): Promise<Attendance>;
  getMyHistory(): Promise<Attendance[]>;
  getToday(): Promise<Attendance | null>;
}
