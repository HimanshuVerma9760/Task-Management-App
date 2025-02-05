import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userDTO } from 'src/dto/user.dto';
import { userSchema } from 'src/schema/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel('users') private userModel: Model<typeof userSchema>,
  ) {}

  async checkUserName(userName: String) {
    try {
      console.log(userName);
      const exsistingUser = await this.userModel.findOne({
        userName: userName,
      });
      if (!exsistingUser) {
        return { message: 'Username accepted!!', response: true };
      } else {
        throw new HttpException('Username already exsist!!', 404);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Username already exsist!!', 500);
    }
  }
  async checkUserEmail(userEmail: String) {
    try {
      const exsistingUser = await this.userModel.findOne({
        email: userEmail,
      });
      if (!exsistingUser) {
        return { message: 'User email accepted!!', response: true };
      } else {
        throw new HttpException('User email already exsist!!', 404);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error!!', 500);
    }
  }
  async addUser(user: userDTO) {
    const exsistingUser = await this.checkUserName(user.userName);
    if (!exsistingUser.response) {
      throw new BadRequestException();
    } else {
      const exsistingEmail = await this.checkUserEmail(user.email);
      if (!exsistingEmail.response) {
        throw new BadRequestException();
      }
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(user.password, 10);
      } catch (error) {
        throw new HttpException('Error while hashing!', 500);
      }
      const myUser: userDTO = {
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        password: hashedPassword,
      };
      const newUser = new this.userModel(myUser);
      let result: {};
      try {
        result = await newUser.save();
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'Internal server errror, while adding user!!',
          500,
        );
      }
      return { result, message: 'Successfully Added!' };
    }
  }
}
