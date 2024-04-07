import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
