import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.id },
    });
    if (!user) {
      throw new UnauthorizedException('Id atau Password salah');
    }
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Akun Anda dinonaktifkan. Silakan hubungi HRD',
      );
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email atau Password salah');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login berhasil',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        isActive: user.isActive,
      },
    };
  }
}
