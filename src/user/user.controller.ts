import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('user')
export class UserController {
  @Get('profile')
  @Auth('ADMIN')
  async getProdile() {
    return 'my-profile';
  }
}
