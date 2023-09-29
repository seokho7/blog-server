import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/github',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, username, displayName, photos, provider } = profile;
    const email =
      profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const member = await this.userService.findByEmail(email);

    if (!member) {
      const userNickname = await this.userService.getRandomNickname(provider);

      const user: UserEntity = await this.userService.findByEmailOrSave(
        email,
        username,
        userNickname,
        provider,
      );
      return user;
    } else {
      return member;
    }
  }
}
