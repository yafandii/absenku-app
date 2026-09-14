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
      userId: response.userId,
      photoUrl: response.photoUrl,
      latitude: response.latitude,
      longitude: response.longitude,
      timestamp: response.timestamp,
      date: new Date(response.timestamp).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: new Date(response.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: response.type,
      status: response.status,
      statusLabel: response.statusLabel || "",
    };
  }

  async getMyHistory(): Promise<AttendanceEntity[]> {
    const response = await this.remoteDataSource.getMyHistory();
    return response.data.map((item) => ({
      id: item.id,
      userId: item.userId,
      photoUrl: item.photoUrl,
      latitude: item.latitude,
      longitude: item.longitude,
      timestamp: item.timestamp,
      date: new Date(item.timestamp).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: new Date(item.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: item.type,
      status: item.status,
      statusLabel: item.statusLabel || "",
    }));
  }

  async getToday(): Promise<AttendanceEntity | null> {
    const response = await this.remoteDataSource.getToday();
    if (!response) return null;
    return {
      id: response.id,
      userId: response.userId,
      photoUrl: response.photoUrl,
      latitude: response.latitude,
      longitude: response.longitude,
      timestamp: response.timestamp,
      //hari, tgl bulan tahun
      date: new Date(response.timestamp).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: new Date(response.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: response.type,
      status: response.status,
      statusLabel: response.statusLabel || "",
    };
  }
}
