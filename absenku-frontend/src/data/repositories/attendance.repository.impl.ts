import { AttendanceRepository } from "@/domain/repositories/attendance.repository";
import {
  AttendanceEntity,
  SummaryAttendanceEntity,
} from "@/domain/entities/attendance.entity";
import {
  ClockInRequestDto,
  ClockOutRequestDto,
  AttendanceResponseDto,
} from "@/data/dto/attendance.dto";
import {
  AttendanceDataSource,
  AttendanceRemoteDataSource,
} from "@/data/data-sources/attendance.data-source";

function mapToAttendanceEntity(
  response: AttendanceResponseDto,
): AttendanceEntity {
  const dateObj = new Date(response.timestamp);
  const fallbackDate = !isNaN(dateObj.getTime())
    ? dateObj.toISOString().split("T")[0]
    : "";

  return {
    id: response.id,
    userId: response.userId,
    userName: response.userName,
    userNik: response.userNik,
    userEmail: response.userEmail,
    divisionId: response.divisionId,
    divisionName: response.divisionName,
    photoUrl: response.photoUrl,
    latitude: response.latitude,
    longitude: response.longitude,
    timestamp: response.timestamp,
    date: response.date || fallbackDate,
    timeIn:
      response.timeIn ||
      (!isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-"),
    timeOut:
      response.timeOut !== undefined
        ? response.timeOut
        : response.clockOutAt
          ? new Date(response.clockOutAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
    type: response.type,
    status: response.status,
    statusLabel: response.statusLabel || "",
    clockOutAt: response.clockOutAt,
    clockOutLatitude: response.clockOutLatitude,
    clockOutLongitude: response.clockOutLongitude,
    clockOutPhotoUrl: response.clockOutPhotoUrl,
    workDurationHours: response.workDurationHours,
    isTargetMet: response.isTargetMet,
    workDurationLabel: response.workDurationLabel,
    workTimeStatus: response.workTimeStatus,
  };
}


export class AttendanceRepositoryImpl implements AttendanceRepository {
  constructor(
    private remoteDataSource: AttendanceDataSource = new AttendanceRemoteDataSource(),
  ) {}

  async clockOut(payload: ClockOutRequestDto): Promise<AttendanceEntity> {
    const response = await this.remoteDataSource.clockOut(payload);
    return mapToAttendanceEntity(response);
  }

  async clockIn(payload: ClockInRequestDto): Promise<AttendanceEntity> {
    const response = await this.remoteDataSource.clockIn(payload);
    return mapToAttendanceEntity(response);
  }

  async getMyHistory(): Promise<AttendanceEntity[]> {
    const response = await this.remoteDataSource.getMyHistory();
    return response.data.map(mapToAttendanceEntity);
  }

  async getToday(): Promise<AttendanceEntity | null> {
    const response = await this.remoteDataSource.getToday();
    if (!response || !response.id) return null;
    return mapToAttendanceEntity(response);
  }

  async getSummaryAttendance(): Promise<SummaryAttendanceEntity | null> {
    const response = await this.remoteDataSource.getgetSummaryAttendance();

    if (!response) return null;
    return {
      period: response.period,
      workHours: {
        total: response.workHours.total,
        target: response.workHours.target,
        unit: response.workHours.unit,
        subtext: response.workHours.subtext,
        isTargetReached: response.workHours.isTargetReached,
      },
      lateness: {
        count: response.lateness.count,
        unit: response.lateness.unit,
        maxAllowed: response.lateness.maxAllowed,
        subtext: response.lateness.subtext,
        status: response.lateness.status,
      },
      attendance: {
        presentDays: response.attendance.presentDays,
        totalWorkingDays: response.attendance.totalWorkingDays,
        remainingDays: response.attendance.remainingDays,
        unit: response.attendance.unit,
        subtext: response.attendance.subtext,
      },
      discipline: {
        percentage: response.discipline.percentage,
        label: response.discipline.label,
        status: response.discipline.status,
      },
    };
  }

  async getAllAttendances(params?: {
    page?: number;
    limit?: number;
  }): Promise<AttendanceEntity[]> {
    const response = await this.remoteDataSource.getAllAttendances(params);
    const list = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : [];
    return list.map(mapToAttendanceEntity);
  }
}

