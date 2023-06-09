import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/user/user.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModule: Model<UserDocument>) {}
  async register() {
    const newUser = new this.userModule({
      email: 'info@gmail.com',
      passwordHash: '123',
      fullName: 'Uchqun',
    });
    return newUser.save();
  }
}
