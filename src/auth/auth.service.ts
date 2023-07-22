import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from 'src/user/user.model';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs'; // bu passwordni hashlash uchun ishlatiladi
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModule: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: LoginDto) {
    const existUser = await this.isExistUser(dto.email);
    if (existUser) throw new BadRequestException('already_exist');

    const solt = await genSalt(10);
    const passwordHash = await hash(dto.password, solt);
    const newUser = await this.userModule.create({
      ...dto,
      password: dto.password.length ? passwordHash : '',
    });
    const token = await this.issueTokenPair(String(newUser._id));
    return { user: this.getUserField(newUser), ...token };
  }

  async login(dto: LoginDto) {
    const existUser = await this.isExistUser(dto.email);
    if (!existUser) throw new BadRequestException('user_not_found');
    if (dto.password.length) {
      const currentPassword = await compare(dto.password, existUser.password);
      if (!currentPassword) throw new BadRequestException('incorrect_password');
    }
    const token = await this.issueTokenPair(String(existUser._id));

    return { user: this.getUserField(existUser), ...token };
  }

  async getNewTokens({ refreshToken }: TokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired');

    const user = await this.userModule.findById(result._id);

    const token = await this.issueTokenPair(String(user._id));
    return { user: this.getUserField(user), ...token };
  }

  async checkUser(email: string) {
    const user = await this.isExistUser(email);

    if (user) {
      return 'User';
    } else {
      return 'no-user';
    }
  }

  async isExistUser(email: string): Promise<UserDocument> {
    const existUser = await this.userModule.findOne({ email: email });
    return existUser;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, { expiresIn: '15d' });

    const accessToken = await this.jwtService.signAsync(data, { expiresIn: '1h' });

    return { refreshToken, accessToken };
  }

  getUserField(user: UserDocument) {
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
    };
  }
}
