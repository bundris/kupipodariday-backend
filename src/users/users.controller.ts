import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findByUsername(req.user.username);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateMe(@Req() req, @Body() updateDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.username, updateDto);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getMyWishes(@Req() req) {
    return this.usersService.findWishes(req.user.username);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUserByName(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findUser(@Body() data: { query: string }) {
    return this.usersService.findOne({
      where: [{ username: data.query }, { email: data.query }],
    });
  }
}
