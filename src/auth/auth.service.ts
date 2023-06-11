import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { User, UserDocument } from 'src/user/user.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dti';
import { genSalt, hash, compare } from 'bcryptjs'; // bu passwordni hashlash uchun ishlatiladi
import { UserModule } from 'src/user/user.module';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModule: Model<UserDocument>) {}
  async register(dto: AuthDto) {
    const existUser = await this.isExistUser(dto.email);
    if (existUser)
      throw new BadRequestException('User with that email is already exist in the system');

    const solt = await genSalt(10);
    const passwordHash = await hash(dto.password, solt);
    const newUser = new this.userModule({ ...dto, password: passwordHash });
    return newUser.save();
  }

  async login(dto: AuthDto) {
    const existUser = await this.isExistUser(dto.email);
    if (!existUser) throw new BadRequestException('User not found');
    const currentPassword = await compare(dto.password, existUser.password);
    if (!currentPassword) throw new BadRequestException('Incorrect pasword');
    return existUser;
  }

  async isExistUser(email: string): Promise<UserDocument> {
    const existUser = await this.userModule.findOne({ email: email });
    return existUser;
  }
}
