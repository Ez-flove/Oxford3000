import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@GetUser() user: { id: string }) {
    return this.usersService.getProfile(user.id);
  }

  @Get('dashboard')
  getDashboard(@GetUser() user: { id: string }) {
    return this.usersService.getDashboard(user.id);
  }
}
