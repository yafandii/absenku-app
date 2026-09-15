import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export class GetMyHistoryUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(): Promise<AttendanceEntity[]> {
    try {
      const response = await this.attendanceRepository.getMyHistory();

      return response;
    } catch (error) {
      console.log("Error fetching attendances", error);
      return [];
    }
  }
}
