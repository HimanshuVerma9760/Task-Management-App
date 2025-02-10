import { Body, Controller, Post } from '@nestjs/common';
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
}
