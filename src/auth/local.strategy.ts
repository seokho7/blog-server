import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'USER_EMAIL', passwordField: 'USER_PW' });
  }

  async validate(userEmail: string, userPw: string): Promise<any> {
    const user = await this.authService.validDateUser(userEmail, userPw);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
