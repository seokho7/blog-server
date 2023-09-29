import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';
import { Sms } from './auth.sms';
import { HealthCheckModule } from 'src/health-check/health-check.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    HealthCheckModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    GoogleStrategy,
    GithubStrategy,
    Sms,
  ],
})
export class AuthModule {}
