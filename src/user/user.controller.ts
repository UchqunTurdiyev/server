import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('profile')
  async getProdile() {
    return 'my-profile';
  }
}
