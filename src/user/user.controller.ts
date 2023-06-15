import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { User } from './decorators/user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  @Auth()
  async getProdile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }
}
