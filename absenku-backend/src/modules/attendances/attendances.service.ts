import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { ClockInDto } from './dto/clock-in.dto';
import { MyHistoryQueryDto } from './dto/my-history-query.dto';
import { Prisma } from '@prisma/client';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

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
      data: attendance || null,
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
