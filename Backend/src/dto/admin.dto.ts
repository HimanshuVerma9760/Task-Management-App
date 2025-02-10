import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export default class adminDTO {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[^0-9]*$/, { message: 'Name must not contain numbers' })
  adminName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  adminEmail: string;

  @IsString()
  @IsNotEmpty()
  adminPassword: string;
}
export class adminSignInDTO {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
