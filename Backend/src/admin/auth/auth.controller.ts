import { Controller, Get, Param } from '@nestjs/common';
import AuthService from './auth.service';

@Controller('/admin/auth')
export default class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':token')
  verifyAdminToken(@Param('token') token: string) {
    return this.authService.verifyAdminToken(token);
  }
}
