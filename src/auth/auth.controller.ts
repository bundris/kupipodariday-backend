import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  //@UseGuards(LocalGuard)
  @Post('signin')
  signIn(@Body() signinDto: SigninUserDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  async registerUser(@Body() signupUserDto: CreateUserDto) {
    const user = await this.usersService.create(signupUserDto);
    return this.authService.signin(user);
  }
}
