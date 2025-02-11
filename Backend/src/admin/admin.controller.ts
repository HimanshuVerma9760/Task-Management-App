import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import AdminService from './admin.service';
import adminDTO, { adminSignInDTO } from 'src/dto/admin.dto';
import { userSignInDTO } from 'src/dto/user.dto';

@Controller('/admin')
export default class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/add-admin')
  addAdmin(@Body() admin: adminDTO) {
    return this.adminService.addAdmin(admin);
  }

  @Post('/admin-login')
  adminLogin(@Body() admin: adminSignInDTO) {
    return this.adminService.adminLogin(admin.userName, admin.password);
  }
  @Get('/remove-user/:id/:token')
  removeUser(@Param("id") id: string, @Param("token") token:string) {
    return this.adminService.removeUser(id, token);
  }
  @Get('/block-user/:id/:token')
  blockUser(@Param("id") id: string, @Param("token") token:string) {
    return this.adminService.blockUser(id, token);
  }
  @Get('/get-users/:to/:searchedData')
  async getTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number,
    @Param('to') to: string,
    @Param('searchedData') searchedData: string,
  ) {
    return this.adminService.getAllUsers(page, limit, to, searchedData);
  }
}
