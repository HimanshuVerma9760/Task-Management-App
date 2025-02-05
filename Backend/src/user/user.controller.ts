import { Body, Controller, Post } from '@nestjs/common';
import UserService from './user.service';
import { userDTO, userSignInDTO } from 'src/dto/user.dto';

@Controller()
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-user')
  async addUser(@Body() user: userDTO) {
    return this.userService.addUser(user);
  }
  @Post('/verify-user-name')
  async checkUserName(@Body() userName:{userName:String}) {
    console.log("controller",userName)
    return this.userService.checkUserName(userName.userName);
  }
}
