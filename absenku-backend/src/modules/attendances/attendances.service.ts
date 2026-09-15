import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { ClockInDto } from './dto/clock-in.dto';
import { MyHistoryQueryDto } from './dto/my-history-query.dto';
import { Attendance, Prisma } from '@prisma/client';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import {
  ATTENDANCE_CONFIG,
  generateAttendanceId,
  getWorkingDaysInMonth,
} from './constants/attendance.constant';
import { ClockOutDto } from './dto/clock-out.dto';

export interface FormattedAttendance {
  id: string;
  userId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  type: string;
  status: 'on_time' | 'late';
  statusLabel: string;
  clockOutAt?: string | null;
  clockOutPhotoUrl?: string | null;
  clockOutLatitude?: number | null;
  clockOutLongitude?: number | null;
  workDurationHours?: number | null;
  workDurationLabel?: string | null;
  isTargetMet?: boolean | null;
  workTimeStatus?: string | null;
}

export interface MonthlySummaryResponse {
  period: string;
  workHours: {
    total: number;
    target: number;
    unit: string;
    subtext: string;
    isTargetReached: boolean;
  };
  lateness: {
    count: number;
    unit: string;
    maxAllowed: number;
    subtext: string;
    status: 'safe' | 'warning' | 'danger';
  };
  attendance: {
    presentDays: number;
    totalWorkingDays: number;
    remainingDays: number;
    unit: string;
    subtext: string;
  };
  discipline: {
    percentage: number;
    label: string;
    status: 'good' | 'needs_improvement';
  };
}

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  private formatAttendance(att: Attendance): FormattedAttendance {
    const dateObj = new Date(att.timestamp);
    const timeZone = ATTENDANCE_CONFIG.TIMEZONE;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(dateObj);
    const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0';
    const minutePart = parts.find((p) => p.type === 'minute')?.value ?? '0';
    const hours = parseInt(hourPart, 10);
    const minutes = parseInt(minutePart, 10);

    const isLate =
      hours > ATTENDANCE_CONFIG.WORK_START_HOUR ||
      (hours === ATTENDANCE_CONFIG.WORK_START_HOUR &&
        minutes > ATTENDANCE_CONFIG.WORK_START_MINUTE);

    const status: 'on_time' | 'late' = isLate ? 'late' : 'on_time';
    const statusLabel = isLate ? 'Terlambat' : 'Tepat Waktu';

    let workDurationHours: number | null = null;
    let workDurationLabel: string | null = null;
    let isTargetMet = false;
    let workTimeStatus: 'under_target' | 'target_met' | 'overtime' | null =
      null;

    if (att.clockOutAt) {
      const inTime = new Date(att.timestamp).getTime();
      const outTime = new Date(att.clockOutAt).getTime();
      const diffMs = Math.max(0, outTime - inTime);

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      workDurationHours = Number((totalMinutes / 60).toFixed(1));
      workDurationLabel = `${hours} Jam ${minutes} Menit`;
      isTargetMet = workDurationHours >= ATTENDANCE_CONFIG.TARGET_DAILY_HOURS;
      if (workDurationHours < ATTENDANCE_CONFIG.TARGET_DAILY_HOURS) {
        workTimeStatus = 'under_target';
      } else if (workDurationHours > ATTENDANCE_CONFIG.TARGET_DAILY_HOURS) {
        workTimeStatus = 'overtime';
      } else {
        workTimeStatus = 'target_met';
      }
    }

    return {
      id: att.id,
      userId: att.userId,
      photoUrl: att.photoUrl,
      latitude: att.latitude ?? 0,
      longitude: att.longitude ?? 0,
      timestamp: dateObj.toISOString(),
      type: ATTENDANCE_CONFIG.DEFAULT_TYPE,
      status,
      statusLabel,
      clockOutAt: att.clockOutAt?.toISOString(),
      clockOutPhotoUrl: att.clockOutPhotoUrl,
      clockOutLatitude: att.clockOutLatitude,
      clockOutLongitude: att.clockOutLongitude,
      workDurationHours,
      workDurationLabel,
      isTargetMet,
      workTimeStatus,
    };
  }

  async clockIn(userId: string, file: Express.Multer.File, dto: ClockInDto) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        timestamp: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (existingAttendance) {
      throw new BadRequestException(
        'Anda sudah melakukan absen masuk hari ini',
      );
    }

    const uploadDir = `./uploads/attendances/${userId}`;
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `att-${uniqueSuffix}${extname(file.originalname)}`;
    const fullPath = join(uploadDir, fileName);

    writeFileSync(fullPath, file.buffer);

    const photoUrl = `/uploads/attendances/${userId}/${fileName}`;

    const id = generateAttendanceId();

    const attendance = await this.prisma.attendance.create({
      data: {
        id,
        userId,
        photoUrl,
        latitude: dto.lat,
        longitude: dto.lng,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            division: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return this.formatAttendance(attendance);
  }

  async clockOut(userId: string, file: Express.Multer.File, dto: ClockOutDto) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        timestamp: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (!existingAttendance) {
      throw new BadRequestException(
        'Anda belum melakukan absen masuk hari ini',
      );
    }

    if (existingAttendance.clockOutAt) {
      throw new BadRequestException(
        'Anda sudah melakukan absen pulang hari ini',
      );
    }

    const uploadDir = `./uploads/attendances/${userId}`;
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `att-out-${uniqueSuffix}${extname(file.originalname)}`;
    const fullPath = join(uploadDir, fileName);

    writeFileSync(fullPath, file.buffer);

    const clockOutPhotoUrl = `/uploads/attendances/${userId}/${fileName}`;

    const attendance = await this.prisma.attendance.update({
      where: {
        id: existingAttendance.id,
      },
      data: {
        clockOutAt: new Date(),
        clockOutPhotoUrl,
        clockOutLatitude: dto.lat,
        clockOutLongitude: dto.lng,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            division: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return this.formatAttendance(attendance);
  }

  async findMyAttendanceToday(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        timestamp: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return {
      alreadyAttendance: !!attendance,
      data: attendance ? this.formatAttendance(attendance) : null,
    };
  }

  async findMyHistory(userId: string, query: MyHistoryQueryDto) {
    const { date, month, page, limit } = query;

    const where: Prisma.AttendanceWhereInput = { userId };

    if (date) {
      const [year, monthNum, day] = date.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, day, 0, 0, 0, 0);
      const endDate = new Date(year, monthNum - 1, day + 1, 0, 0, 0, 0);
      where.timestamp = {
        gte: startDate,
        lt: endDate,
      };
    } else if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const firstDayOfMonth = new Date(year, monthNum - 1, 1);
      const firstDayOfNextMonth = new Date(year, monthNum, 1);
      where.timestamp = {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const attendances = await this.prisma.attendance.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limitNum,
      skip,
    });

    const totalItems = await this.prisma.attendance.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / limitNum);

    const formattedData = attendances.map((att) => this.formatAttendance(att));

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1 && totalPages > 0,
      },
      data: formattedData,
    };
  }

  async findAllHistory(filter: FilterAttendanceDto) {
    const { page, limit, divisionId, search, date } = filter;

    const whereClause: Prisma.AttendanceWhereInput = {};

    const userWhere: Prisma.UserWhereInput = {};
    if (divisionId) {
      userWhere.divisionId = divisionId;
    }

    if (search) {
      userWhere.OR = [
        { name: { contains: search } },
        { id: { contains: search } },
      ];
    }

    if (divisionId || search) {
      whereClause.user = userWhere;
    }

    if (date) {
      const [year, monthNum, day] = date.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, day, 0, 0, 0, 0);
      const endDate = new Date(year, monthNum - 1, day + 1, 0, 0, 0, 0);
      whereClause.timestamp = {
        gte: startDate,
        lt: endDate,
      };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const attendances = await this.prisma.attendance.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            division: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limitNum,
      skip,
    });

    const totalItems = await this.prisma.attendance.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalItems / limitNum);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1 && totalPages > 0,
      },
      data: attendances,
    };
  }

  async getMonthlySummary(userId: string): Promise<MonthlySummaryResponse> {
    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth(); // 0-11

    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
        timestamp: {
          gte: firstDayOfMonth,
          lt: lastDayOfMonth,
        },
      },
    });

    const formattedList = attendances.map((att) => this.formatAttendance(att));
    const lateCount = formattedList.filter(
      (att) => att.status === 'late',
    ).length;

    const workingDays = getWorkingDaysInMonth(year, monthIndex);
    const lateThreshold = ATTENDANCE_CONFIG.LATE_MAX_PER_MONTH;

    const dailyWorkHours =
      ATTENDANCE_CONFIG.WORK_END_HOUR - ATTENDANCE_CONFIG.WORK_START_HOUR - 1;

    const isPastWorkEndHour = now.getHours() >= ATTENDANCE_CONFIG.WORK_END_HOUR;
    const isCurrentMonth =
      monthIndex === now.getMonth() && year === now.getFullYear();

    const completedDays = attendances.filter((att) => {
      const attDate = new Date(att.timestamp);

      const isToday =
        isCurrentMonth &&
        attDate.getDate() === now.getDate() &&
        attDate.getMonth() === now.getMonth() &&
        attDate.getFullYear() === now.getFullYear();

      if (isToday) {
        return isPastWorkEndHour;
      }

      return true;
    }).length;

    const totalWorkHours = dailyWorkHours * completedDays;

    const targetMonthlyHours = ATTENDANCE_CONFIG.WORK_TARGET_IN_HOURS_MONTHLY;
    const isTargetReached = totalWorkHours >= targetMonthlyHours;
    const disciplinePrecentage =
      workingDays === 0
        ? 0
        : Math.max(0, ((workingDays - lateCount) / workingDays) * 100).toFixed(
            2,
          );
    const isDiscipline = Number(lateCount) <= lateThreshold;

    const payload: MonthlySummaryResponse = {
      period: `${firstDayOfMonth.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })}`,
      workHours: {
        total: totalWorkHours,
        target: targetMonthlyHours,
        unit: 'jam',
        subtext: 'Jam kerja hari ini',
        isTargetReached,
      },
      lateness: {
        count: lateCount,
        unit: 'kali',
        maxAllowed: lateThreshold,
        subtext: 'Batas keterlambatan per bulan',
        status: isDiscipline ? 'safe' : 'danger',
      },
      attendance: {
        presentDays: attendances.length,
        totalWorkingDays: workingDays,
        remainingDays: workingDays - attendances.length,
        unit: 'hari',
        subtext: 'Total Masuk',
      },
      discipline: {
        percentage: Number(disciplinePrecentage),
        label: isDiscipline ? 'Sangat Baik' : 'Buruk',
        status: isDiscipline ? 'good' : 'needs_improvement',
      },
    };

    return payload;
  }
}
