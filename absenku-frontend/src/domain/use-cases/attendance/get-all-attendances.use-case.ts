import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export class GetAllAttendancesUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(params?: {
    page?: number;
    limit?: number;
  }): Promise<AttendanceEntity[]> {
    try {
      const response = await this.attendanceRepository.getAllAttendances(params);
      return response;
    } catch {
      return [];
    }
  }
}
