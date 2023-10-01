import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UserSignUpDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  //  가입하기
  async register(userDto: UserSignUpDto): Promise<boolean> {
    const user = await this.userService.findByEmail(userDto['USER_EMAIL']);
    const userNickname = await this.userService.findByNinkname(userDto["USER_NICKNAME"]);
    if(user) throw new BadRequestException('U0001');
    if(userNickname) throw new BadRequestException('U0002');

    const encryptedPw = bcrypt.hashSync(userDto['USER_PW'], 10);
    try {
      await this.userService.signUp({
        ...userDto,
        USER_PW: encryptedPw,
      });
      return true;
    } catch (e) {
      throw new HttpException('서버 에러', 500);
    }
  }

  // 해당 유저 검색 - 베이스 로그인
  async validDateUser(userEmail: string, userPw: string): Promise<any> {
    //TODO: 검증 로직의 단순화 떄문에 jwt를 추가 혹은 가져올 거를 생각해보자

    const user = await this.userService.findByEmail(userEmail);
    if (!user || user.PROVIDER_ID) {
      return null;
    }
    const { USER_PW: hashdPassword, ...userInfo } = user;

    if (bcrypt.compareSync(userPw, hashdPassword)) {
      console.log('해쉬 패스워드와 매치 성공');
      return userInfo;
    } else {
      console.log('해쉬 패스워드와 매치 실패');
    }

    return null;
  }

  async hashString(targetString: string): Promise<string> {
    return bcrypt.hashSync(targetString, 10);
  }

}
