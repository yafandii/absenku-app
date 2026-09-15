import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { ClockInRequestDto } from "@/data/dto/attendance.dto";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export class ClockInUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(params: ClockInRequestDto): Promise<AttendanceEntity> {
    return this.attendanceRepository.clockIn(params);
  }
}
