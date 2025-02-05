import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class userDTO {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^0-9]*$/, { message: 'Name must not contain numbers' })
  fullName: String;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: String;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class userSignInDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
