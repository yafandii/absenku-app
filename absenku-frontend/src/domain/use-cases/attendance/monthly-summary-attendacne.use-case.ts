import { SummaryAttendanceEntity } from "@/domain/entities/attendance.entity";
import { AttendanceRepository } from "@/domain/repositories/attendance.repository";

export class MonthlySummaryAttendanceUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(): Promise<SummaryAttendanceEntity | null> {
    return this.attendanceRepository.getSummaryAttendance();
  }
}
