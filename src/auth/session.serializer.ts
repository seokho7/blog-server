import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.USER_EMAIL);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
    const user = await this.userService.findByEmail(payload);
    if (!user) {
      done(new Error('유저가 없습니다'), null);
      return;
    }
    // if(user.PROVIDER_ID !== null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ID, USER_PW, USER_PHONE, ...userInfo } = user;
    done(null, userInfo);
  }
}
