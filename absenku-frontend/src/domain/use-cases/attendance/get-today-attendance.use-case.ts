import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { Attendance } from "@/domain/entities/attendance.entity";

export class GetTodayAttendanceUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(): Promise<Attendance | null> {
    return this.attendanceRepository.getToday();
  }
}
