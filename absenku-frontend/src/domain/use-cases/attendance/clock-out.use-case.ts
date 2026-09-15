import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { ClockOutRequestDto } from "@/data/dto/attendance.dto";

export class ClockOutUseCase {
  constructor(private attendanceRepo: AttendanceRepository) {}

  async execute(request: ClockOutRequestDto) {
    return this.attendanceRepo.clockOut(request);
  }
}
