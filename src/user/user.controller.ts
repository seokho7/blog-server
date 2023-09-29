import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSignUpDto, UserLoginDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/test')
  test(@Res() res) {
    res.send('테스트 성공');
  }
  // 회원가입
  @Post('/signUp')
  async signUp(@Body() signUpUserDto: UserSignUpDto): Promise<boolean> {
    const result = (await this.userService.signUp(signUpUserDto))
      ? true
      : false;
    return result;
  }

  // 회원탈퇴
  @Post('/signOut')
  async signOut(@Body() userInfo: object): Promise<boolean> {
    const reqUserEmail = userInfo['USER_EMAIL'];
    const result = (await this.userService.signOut(reqUserEmail))
      ? true
      : false;
    return result;
  }

  //로그인
  @Post('/login')
  async login(@Body() userInfo: UserLoginDto): Promise<UserLoginDto> {
    return userInfo;
  }

  @Get('/joinTest')
  async joinTest(@Body() userInfo: string) {
    await this.userService.joinMailPush(userInfo['USER_EMAIL']);
  }
}
