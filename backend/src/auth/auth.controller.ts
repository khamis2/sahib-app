import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('request-otp')
    async requestOtp(@Body() body: { phoneNumber: string }) {
        await this.authService.generateOtp(body.phoneNumber);
        return { message: 'OTP sent successfully' };
    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-otp')
    async verifyOtp(@Body() body: { phoneNumber: string; otp: string }) {
        return this.authService.verifyOtp(body.phoneNumber, body.otp);
    }
}
