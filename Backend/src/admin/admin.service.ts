import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { adminSchema } from 'src/schema/admin.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import adminDTO from 'src/dto/admin.dto';

@Injectable()
export default class AdminService {
  constructor(
    @InjectModel('admin') private adminModel: Model<typeof adminSchema>,
  ) {}

  async addAdmin(admin: adminDTO) {
    try {
      const existingAdminEmail = await this.adminModel.findOne({
        adminEmail: admin.adminEmail,
      });
      const existingAdminUsername = await this.adminModel.findOne({
        adminEmail: admin.adminEmail,
      });
      if (existingAdminEmail || existingAdminUsername) {
        throw new HttpException('User already exists!', 404);
      }
      admin.adminPassword = await bcrypt.hash(admin.adminPassword, 10);
      const newAdmin = new this.adminModel(admin);
      const result = await newAdmin.save();
      if (result) {
        console.log('new admin added!!');
        return { result, response: true };
      } else {
        throw new HttpException('Failed to add admin!!', 404);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async adminLogin(userName: string, password: string) {
    try {
      let admin: any;
      admin = await this.adminModel.findOne({ userName: userName });
      if (admin) {
        const checkPass = await bcrypt.compare(password, admin.adminPassword);
        if (checkPass) {
          const key = process.env.ADMIN_KEY || 'Himanshu2512admin';
          const token = jwt.sign(
            {
              id: admin._id,
              userName: admin.userName,
              adminName: admin.adminName,
              adminEmail: admin.adminEmail,
            },
            key,
          );
          return {
            result: {
              id: admin._id,
              userName: admin.userName,
              adminName: admin.adminName,
              adminEmail: admin.adminEmail,
            },
            resposne: true,
            token,
          };
        } else {
          throw new UnauthorizedException('Not Authorised!');
        }
      } else {
        throw new UnauthorizedException('Not Authorised!');
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Not Authorised!');
    }
  }
}
