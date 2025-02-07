import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import UserService from '../user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(token: string): Promise<any> {
    const key = process.env.SECRET_KEY || 'Himanshu2512';
    try {
      const verify: any = jwt.verify(token, key);
      if (verify) {
        const isVerified = await this.userService.verifyValidUserWithToken(
          verify.userName,
        );
        return { response: isVerified };
      }
      throw new UnauthorizedException('Not Authorized!');
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Not Authorized!');
    }
  }
}
