import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  USER_EMAIL: string;

  @IsNotEmpty()
  @IsString()
  @Matches(RegExp(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/))
  // @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {message:"ㄹㅇㄴㅁ"})
  USER_PW: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  USER_PHONE: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 10)
  USER_NICKNAME: string;

  @IsNotEmpty()
  @IsString()
  USER_NAME: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  USER_EMAIL: string;

  @IsNotEmpty()
  @Length(8, 30)
  @Matches(RegExp(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/))
  USER_PW: string;
}
