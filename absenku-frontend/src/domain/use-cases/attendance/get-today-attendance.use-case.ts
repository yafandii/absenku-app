import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export class GetTodayAttendanceUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(): Promise<AttendanceEntity | null> {
    return this.attendanceRepository.getToday();
  }
}
