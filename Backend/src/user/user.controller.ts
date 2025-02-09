import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async checkUserName(@Body() userName: { userName: string }) {
    return this.userService.checkUserName(userName.userName);
  }
  @Post('/user-login')
  userLogin(@Body() user: userSignInDTO) {
    return this.userService.userLogin(user.userName, user.password);
  }
  @Get('/verify-user-email/:to/:em')
  verifyEmail(@Param('to') to: string, @Param('em') em: string) {
    return this.userService.emailLinkVerify(to, em);
  }
}
