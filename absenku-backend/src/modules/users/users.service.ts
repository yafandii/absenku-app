import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import {
  ChangePasswordUserDto,
  ResetPasswordUserDto,
} from './dto/password-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar dalam sistem');
    }

    const id = await this.generateUserId();

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        id,
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        divisionId: dto.divisionId,
      },
      include: {
        division: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const { password, ...result } = user;
    return {
      message: 'Pengguna berhasil didaftarkan',
      data: result,
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        divisionId: true,
        division: {
          select: {
            id: true,
            name: true,
          },
        },
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: dto.id },
    });
    if (!existingUser) {
      throw new ConflictException('User tidak ditemukan');
    }
    const user = await this.prisma.user.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
        email: dto.email,
        role: dto.role,
        divisionId: dto.divisionId,
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
    const { password, ...result } = user;
    return {
      message: 'User berhasil diupdate',
      data: result,
    };
  }

  async delete(dto: DeleteUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: dto.id },
    });
    if (!existingUser) {
      throw new ConflictException('User tidak ditemukan');
    }
    await this.prisma.user.delete({
      where: { id: dto.id },
    });
    return {
      message: 'User berhasil dihapus',
    };
  }

  async findMe(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        role: true,
        divisionId: true,
        division: {
          select: {
            id: true,
            name: true,
          },
        },
        isActive: true,
        createdAt: true,
      },
    });
  }

  async changePassword(id: string, dto: ChangePasswordUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ConflictException('User tidak ditemukan');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ConflictException('Password lama tidak valid');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return {
      message: 'Password berhasil diubah',
    };
  }

  async resetPassword(dto: ResetPasswordUserDto) {
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: dto.id },
      data: { password: hashedPassword },
    });
    return {
      message: 'Password berhasil diubah',
    };
  }

  private async generateUserId(): Promise<string> {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}${month}`;

    const lastUser = await this.prisma.user.findFirst({
      where: {
        id: {
          startsWith: prefix,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    let sequence = 1;
    if (lastUser) {
      const lastSequence = parseInt(lastUser.id.substring(4), 10);
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    return `${prefix}${String(sequence).padStart(3, '0')}`;
  }
}
