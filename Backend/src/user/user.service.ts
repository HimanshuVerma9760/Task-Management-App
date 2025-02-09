import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as nodemailer from 'nodemailer';
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

  async emailLinkVerify(to: string, em: string) {
    let user: any;
    try {
      user = await this.userModel.findOne({ email: em });
    } catch (error) {
      throw new UnauthorizedException('Not Authorised!');
    }
    if (user.isVerified === true) {
      return { message: 'User Email Verified!', response: true };
    }
    try {
      const isVerified = await bcrypt.compare(em, to);
      if (isVerified) {
        const result = await this.userModel.findOneAndUpdate(
          { email: em },
          {
            $set: {
              isVerified: true,
            },
          },
        );
        if (result) {
          return { message: 'User Email Verified!', response: true };
        } else {
          console.log('error! while verifying');
          throw new HttpException('Failed to verify user!', 404);
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to verify!', 500);
    }
  }

  emailVerification(userEmail: string, generatedHash: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    async function main() {
      const info = await transporter.sendMail({
        from: '"Himanshu verma" <humnavaverma@gmail.com>',
        to: `${userEmail}`,
        subject: 'Hello, Welcome to TaskManager App',
        text: 'Kindly click on below link to verify your email..!!',
        html: `<a href="http://localhost:3000/verify-user-email/${generatedHash}/${userEmail}">Verify</a>`,
      });

      console.log('Message sent: %s', info.messageId);
    }

    main().catch(console.error);
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
      let result: any;
      try {
        result = await newUser.save();
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'Internal server errror, while adding user!!',
          500,
        );
      }
      const generatedHash = await bcrypt.hash(user.email, 10);
      this.emailVerification(user.email, generatedHash);
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
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        if (!user.isVerified) {
          return {
            message: 'Kindly verify your email to login!',
            response: 'not verified',
          };
        }
        const tokenData = {
          id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
        };
        const token = jwt.sign(tokenData, `${process.env.SECRET_KEY}`, {
          expiresIn: '1h',
        });
        return { response: true, token };
      }
      throw new UnauthorizedException('Invalid Credentials!');
    }
    throw new UnauthorizedException('Invalid Credentials!');
  }
}
