import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  Get,
  UseGuards,
  Redirect,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from 'src/user/dto/user.dto';
import {
  AuthenticatedGuard,
  GiuhubAuthGuard,
  GoogleAuthGuard,
  LocalAuthGuard,
} from './auth.guard';
import { Sms } from './auth.sms';
import { smsResStep } from 'src/types/response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sms: Sms,
  ) {}

  @Post('/register')
  async register(@Body() usersignUpdto: UserSignUpDto): Promise<boolean> {
    return await this.authService.register(usersignUpdto);
  }

  @Post('/sessionLogin')
  @UseGuards(LocalAuthGuard)
  login3(@Request() req, @Response() res) {
    return res.send(true);
  }

  // 이 가드는 로그인 페이지에 필요 없음 사용자 로그인 후 진입 페이지에 배치
  @Get('/sessionAuth')
  @UseGuards(AuthenticatedGuard)
  testGuardWithSession() {
    return true;
  }

  @Get('/to-google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @Redirect('http://localhost:3000/main')
  async googleAuthRedirect(@Req() Req, @Res() res): Promise<void> {}

  @Get('/to-github')
  @UseGuards(GiuhubAuthGuard)
  githubAuth() {}

  @Get('/github')
  @UseGuards(GiuhubAuthGuard)
  @Redirect('http://localhost:3000/main')
  async githubAuthRedirect(@Req() Req, @Res() res): Promise<void> {}

  @Get('/info')
  @UseGuards(AuthenticatedGuard)
  async info(@Req() req, @Res() res) {
    return res.send(req.user);
  }

  @Post('/sendCode')
  async sendCode(@Body() req, @Res() res) {
    const smsState: smsResStep = await this.sms.sendSms(req.USER_PHONE);
    res.send(smsState);
      // res.send(JSON.stringify(smsState))
  }

  @Post('/validateCode')
  async validateCode(@Body() req, @Res() res) {
    const userReqPhone = String(req.USER_PHONE);
    const userReqCode = req.USER_SMS_AUTH_CODE;
    const cacheCode = await this.sms.validateSms(userReqPhone);
    console.log(userReqCode, cacheCode)
    if(cacheCode === userReqCode){
      res.send(true);
    }else{
      res.send(false);
    }
  }
  @Get('/test')
  async test() {
    return this.authService.hashString('');
  }
}
