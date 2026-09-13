import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.HRD)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Roles(Role.HRD)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.HRD)
  @Put('update')
  update(@Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }

  @Roles(Role.HRD)
  @Delete('delete')
  delete(@Body() dto: DeleteUserDto) {
    return this.usersService.delete(dto);
  }
}
