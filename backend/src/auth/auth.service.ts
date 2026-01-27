import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SmsService } from '../providers/sms.service';

@Injectable()
export class AuthService {
    // In-memory store for OTPs (In production, use Redis)
    private otps = new Map<string, { otp: string; expires: number }>();

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private smsService: SmsService,
    ) { }

    async generateOtp(phoneNumber: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
        this.otps.set(phoneNumber, { otp, expires });

        // Send OTP via SMS Service
        await this.smsService.sendOtp(phoneNumber, otp);

        return otp;
    }

    async verifyOtp(phoneNumber: string, otp: string): Promise<{ accessToken: string; user: any }> {
        const stored = this.otps.get(phoneNumber);

        if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        this.otps.delete(phoneNumber);

        let user = await this.usersService.findByPhone(phoneNumber);
        if (!user) {
            // Create user if they don't exist (Registration via OTP)
            user = await this.usersService.create({
                phoneNumber,
                fullName: 'New Sahib User', // Temporary name
                email: `${phoneNumber}@sahib.placeholder`, // Temporary email
                balance: 10000, // Starting balance for testing (₦10,000)
            });
        }

        const payload = { sub: user.id, phoneNumber: user.phoneNumber, role: user.role };
        return {
            accessToken: await this.jwtService.signAsync(payload),
            user,
        };
    }
}
