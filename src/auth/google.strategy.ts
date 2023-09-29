import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails, provider } = profile;
    const email = emails[0].value;

    const member = await this.userService.findByEmail(email);

    if (member && member.PROVIDER_ID === 'normal') {
      return false;
    }

    if (!member) {
      const userNickname = await this.userService.getRandomNickname(provider);

      const user: UserEntity = await this.userService.findByEmailOrSave(
        email,
        name.familyName + name.givenName,
        userNickname,
        provider,
      );
      return user;
    } else {
      return member;
    }
  }
}
