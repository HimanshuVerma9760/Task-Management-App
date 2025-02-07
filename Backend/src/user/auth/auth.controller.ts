import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('/auth')
export default class AuthController {
    constructor(private readonly authService:AuthService){}

    @Get('/:to')
    verifyToken(@Param("to") to:string){
        // console.log("token: ", to);
        return this.authService.validateUser(to);
    }
}