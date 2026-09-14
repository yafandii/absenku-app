import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { ClockInDto } from './dto/clock-in.dto';
import { MyHistoryQueryDto } from './dto/my-history-query.dto';
import { Attendance, Prisma } from '@prisma/client';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { ATTENDANCE_CONFIG } from './constants/attendance.constant';

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

    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
      timeZone,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj);

    const timeFormatted = `${hourPart.padStart(2, '0')}:${minutePart.padStart(2, '0')}`;

    return {
      id: String(att.id),
      userId: att.userId,
      photoUrl: att.photoUrl,
      latitude: att.latitude ?? 0,
      longitude: att.longitude ?? 0,
      timestamp: dateObj.toISOString(),
      type: ATTENDANCE_CONFIG.DEFAULT_TYPE,
      status,
      statusLabel,
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
      throw new BadRequestException('Anda sudah absen hari ini');
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

    const attendance = await this.prisma.attendance.create({
      data: {
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
    return {
      message: 'Absensi berhasil',
      data: attendance,
    };
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
}
