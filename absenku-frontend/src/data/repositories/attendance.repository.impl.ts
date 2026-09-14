import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";
import { ClockInRequestDto } from "@/data/dto/attendance.dto";
import {
  AttendanceDataSource,
  AttendanceRemoteDataSource,
} from "@/data/data-sources/attendance.data-source";

export class AttendanceRepositoryImpl implements AttendanceRepository {
  constructor(
    private remoteDataSource: AttendanceDataSource = new AttendanceRemoteDataSource(),
  ) {}

  async clockIn(payload: ClockInRequestDto): Promise<AttendanceEntity> {
    const response = await this.remoteDataSource.clockIn(payload);
    return {
      id: response.id,
      date: response.date,
      time: response.time,
      type: response.type,
      status: response.status,
      statusLabel:
        response.statusLabel ||
        (response.status === "on_time" ? "Tepat Waktu" : "Terlambat"),
      avatarUrl: response.avatarUrl,
    };
  }

  async getMyHistory(): Promise<AttendanceEntity[]> {
    const response = await this.remoteDataSource.getMyHistory();
    return response.map((item) => ({
      id: item.id,
      date: item.date,
      time: item.time,
      type: item.type,
      status: item.status,
      statusLabel:
        item.statusLabel ||
        (item.status === "on_time" ? "Tepat Waktu" : "Terlambat"),
      avatarUrl: item.avatarUrl,
    }));
  }

  async getToday(): Promise<AttendanceEntity | null> {
    const response = await this.remoteDataSource.getToday();
    if (!response) return null;
    return {
      id: response.id,
      date: response.date,
      time: response.time,
      type: response.type,
      status: response.status,
      statusLabel:
        response.statusLabel ||
        (response.status === "on_time" ? "Tepat Waktu" : "Terlambat"),
      avatarUrl: response.avatarUrl,
    };
  }
}
