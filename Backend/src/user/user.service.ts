import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userDTO, userSignInDTO } from 'src/dto/user.dto';
import { userSchema } from 'src/schema/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel('users') private userModel: Model<typeof userSchema>,
  ) {}

  async checkUserName(userName: string) {
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
  async checkUserEmail(userEmail: string) {
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

  async verifyValidUserWithToken(userName: string) {
    let verifiedUser: any;
    try {
      verifiedUser = await this.userModel.findOne({ userName: userName });
    } catch (error) {
      return { result: false };
    }
    if (verifiedUser) {
      return { result: true };
    } else {
      return { result: false };
    }
  }

  async userLogin(userName: string, password: string) {
    let user: any;
    try {
      user = await this.userModel.findOne({
        userName: userName,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    if (user) {
      console.log(user);
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        const tokenData = {
          id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
        };
        const token = jwt.sign(tokenData, `${process.env.SECRET_KEY}`, {
          expiresIn: '1h',
        });
        console.log(token);
        return { response: true, token };
      }
      throw new UnauthorizedException('Invalid Credentials!');
    }
    throw new UnauthorizedException('Invalid Credentials!');
  }
}
