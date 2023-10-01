import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserSignUpDto } from './dto/user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  async joinMailPush(email: string) {
    await this.emailService.sendMemberJoin(email);
  }
  // 유저 생성 = 가입
  // dto 로 안전하게 전달해줘야 하는 함수
  async signUp(userDto: UserSignUpDto): Promise<UserSignUpDto> {
    await this.findByEmail(userDto['USER_EMAIL']);
    await this.findByNinkname(userDto['USER_NICKNAME']);
    await this.userRepository.save(userDto);
    return userDto;
  }

  // 유저 이메일 중복 검사
  async findByEmail(userEmail: string): Promise<UserEntity> {
    const result = await this.userRepository.findOne({
      where: { USER_EMAIL: userEmail },
    });

    return result;
  }

  // 유저 계정 수 검사
  async maximumJoinCheck(userPhone: string) {
    const result = await this.userRepository.find({
      where: { USER_PHONE: userPhone}
    })
    if(result.length > 2){
      throw new BadRequestException('계정은 최대 2개까지 만들 수 있습니다.');
    }
    return result;
  }

  // 유저 닉네임 중복 검사
  async findByNinkname(userNickname: string): Promise<UserEntity> {
    const result = await this.userRepository.findOne({
      where: { USER_NICKNAME: userNickname },
    });

    return result;
  }

  // 유저 삭제
  async signOut(userEmail: string): Promise<boolean> {
    const result = await this.userRepository.findOne({
      where: { USER_EMAIL: userEmail },
    });

    if (!result) {
      throw new UnprocessableEntityException('유저를 찾을 수 없습니다.');
    } else {
      await this.userRepository.delete({ USER_EMAIL: userEmail });
      return true;
    }
  }

  async getRandomNickname(siteName: string) {
    const min = 1000000;
    const max = 9999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const randomNickname = siteName + String(randomNumber);

    const userNickCheck = (await this.findByNinkname(randomNickname))
      ? true
      : false;
    if (userNickCheck) {
      await this.getRandomNickname(siteName);
    } else {
      return randomNickname;
    }
  }

  // Oauth로 들어온 유저 가입 및 조회
  async findByEmailOrSave(
    email: string,
    username: string,
    userNickname: string,
    providerId: string,
  ): Promise<any> {
    const foundUser = await this.findByEmail(email);

    if (foundUser) {
      return foundUser;
    }

    const newUser = {};
    newUser['USER_EMAIL'] = email;
    newUser['USER_NAME'] = username;
    newUser['USER_NICKNAME'] = userNickname;
    newUser['PROVIDER_ID'] = providerId;
    await this.userRepository.save(newUser);
    return newUser;
  }
}
