import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    /**
     * Sends an OTP via SMS (Simulated for now)
     * @param phoneNumber The recipient's phone number
     * @param otp The 6-digit OTP code
     */
    async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
        this.logger.log(`[SMS SIMULATION] Sending OTP ${otp} to ${phoneNumber}`);

        // In a real implementation, you would use Termii, Twilio, etc.
        // Example:
        // const response = await axios.post('https://api.ng.termii.com/api/sms/send', { ... });

        return true;
    }
}
