import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { adminSchema } from 'src/schema/admin.model';
import * as jwt from 'jsonwebtoken';
import { response } from 'express';

@Injectable()
export default class AdminAuthService {
  constructor(
    @InjectModel('admin') private adminModel: Model<typeof adminSchema>,
  ) {}

  async verifyAdminToken(token: string) {
    try {
      const key = process.env.ADMIN_KEY || 'Himanshu2512admin';
      const result = jwt.verify(token, key);

      if (result) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Not Authorised!');
    }
  }
}
