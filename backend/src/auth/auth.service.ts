/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/users/entities/user.entity';
import { hashHelper } from 'src/helpers/hash-helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    const isMatch = await hashHelper.comparePassword(password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }
}
