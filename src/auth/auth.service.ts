import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from './dto/signin-user.dto';
import bcrypt from 'bcrypt';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signin(signinDtoUser: SigninUserDto) {
    const user = await this.usersService.findByUsername(signinDtoUser.username);
    if (!user) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    const payload = { username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(signinDtoUser: SigninUserDto) {
    const { username, password } = signinDtoUser;
    const user = await this.usersService.findByUsername(username, true);
    if (!user) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    return await bcrypt
      .compare(String(password), user.password)
      .then((matched) => {
        if (!matched) {
          return null;
        }
        delete user.password;
        return user;
      });
  }
}
