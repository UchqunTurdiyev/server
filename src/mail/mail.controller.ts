import { MailService } from './mail.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  async sendOtp(@Body() dto: { email: string }) {
    return this.mailService.sendOtpVerification(dto.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: { email: string; otpVerification: string }) {
    return this.mailService.verifyOtp(dto.email, dto.otpVerification);
  }
}
