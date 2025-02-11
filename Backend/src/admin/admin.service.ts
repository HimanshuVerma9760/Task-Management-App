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
import { userSchema } from 'src/schema/user.model';
import { skip } from 'node:test';

@Injectable()
export default class AdminService {
  constructor(
    @InjectModel('admin') private adminModel: Model<typeof adminSchema>,
    @InjectModel('users') private userModel: Model<typeof userSchema>,
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
  async removeUser(id: string, token: string) {
    const key = process.env.ADMIN_KEY || 'Himanshu2512admin';
    try {
      const verifyToken = jwt.verify(token, key);
    } catch (error) {
      throw new UnauthorizedException('Not Authorised!');
    }
    const result = await this.userModel.findByIdAndDelete(id);
    if (result?.isModified) {
      return { response: true };
    } else {
      throw new HttpException('Some error Occurred!', 404);
    }
  }
  async blockUser(id: string, token: string) {
    const key = process.env.ADMIN_KEY || 'Himanshu2512admin';
    try {
      const verifyToken = jwt.verify(token, key);
    } catch (error) {
      throw new UnauthorizedException('Not Authorised!');
    }
    const result = await this.userModel.findByIdAndUpdate(id, {
      $set: {
        isBlocked: true,
      },
    });
    if (result?.isModified) {
      return { response: true };
    } else {
      throw new HttpException('Some error Occurred!', 404);
    }
  }
  async getAllUsers(
    page: number,
    limit: number,
    to: string,
    searchedData: string,
  ) {
    const skip = (page - 1) * limit;
    const key = process.env.ADMIN_KEY || 'Himanshu2512admin';
    let allUsers: any;
    let totalUsers: number;
    let verifiedToken: any;
    try {
      verifiedToken = jwt.verify(to, key);
    } catch (error) {
      throw new UnauthorizedException('Not Authorized!');
    }
    if (!verifiedToken) {
      throw new UnauthorizedException('Not Authorized!');
    }
    allUsers = await this.userModel.find().skip(skip).limit(limit).exec();
    totalUsers = await this.userModel.find().countDocuments().exec();
    if (allUsers) {
      let myUsers: any;
      if (allUsers.length > 0) {
        if (searchedData === 'all') {
          myUsers = allUsers;
          return { myUsers, totalUsers };
        }
        myUsers = allUsers.filter((eachUser) => {
          return eachUser.fullName.startsWith(searchedData);
        });
        totalUsers = myUsers.length;
        return { myUsers, totalUsers };
      } else {
        console.log('No Users found');
        throw new HttpException('No users Found!!', 404);
      }
    } else {
      throw new HttpException('Internal Server Error!!', 500);
    }
  }
}
