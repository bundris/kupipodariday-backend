import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private salt = 10;

  async hashDtoPassword<T extends { password?: string }>(dto: T) {
    if (!dto.password) {
      return dto;
    }
    const hashedPassword = await bcrypt.hash(dto.password, this.salt);

    return {
      ...dto,
      password: hashedPassword,
    };
  }
}
