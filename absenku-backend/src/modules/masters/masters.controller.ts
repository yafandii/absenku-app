import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MastersService } from './masters.service';

@UseGuards(AuthGuard('jwt'))
@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get('divisions')
  async getDivisions() {
    return this.mastersService.getDivisions();
  }
}
