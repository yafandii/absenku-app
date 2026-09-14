import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export class GetMyHistoryUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(): Promise<AttendanceEntity[]> {
    return this.attendanceRepository.getMyHistory();
  }
}
