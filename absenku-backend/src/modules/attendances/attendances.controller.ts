import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ClockInDto } from './dto/clock-in.dto';
import { MyHistoryQueryDto } from './dto/my-history-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { Role } from '@prisma/client';
import { get } from 'http';
import { ClockOutDto } from './dto/clock-out.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('clock-in')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Format file tidak didukung! Hanya diperbolehkan JPG, JPEG, PNG, atau WEBP.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async clockIn(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ClockInDto,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Foto bukti kehadiran (field multipart: photo) wajib diunggah!',
      );
    }

    const data = await this.attendancesService.clockIn(userId, file, dto);
    return data;
  }

  @Post('clock-out')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Format file tidak didukung! Hanya diperbolehkan JPG, JPEG, PNG, atau WEBP.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async clockOut(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ClockOutDto,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Foto bukti selesai kerja (field multipart: photo) wajib diunggah!',
      );
    }

    const data = await this.attendancesService.clockOut(userId, file, dto);
    return data;
  }

  @Get('attendence-today')
  async findMyAttendanceToday(@GetUser('id') userId: string) {
    return this.attendancesService.findMyAttendanceToday(userId);
  }

  @Get('my-history')
  async findMyHistory(
    @GetUser('id') userId: string,
    @Query() query: MyHistoryQueryDto,
  ) {
    return this.attendancesService.findMyHistory(userId, query);
  }

  @Roles(Role.HRD)
  @Get()
  async findAll(@Query() filter: FilterAttendanceDto) {
    const data = await this.attendancesService.findAllHistory(filter);
    return {
      message: 'Data absensi berhasil diambil',
      data,
    };
  }

  @Get('monthly-summary')
  async getMonthlySummary(@GetUser('id') userId: string) {
    return this.attendancesService.getMonthlySummary(userId);
  }
}
