import { Injectable, UnauthorizedException } from '@nestjs/common';
import { addDays } from 'date-fns';
import { LoginDto } from './dto/login.dto';
import { UserSerializer } from 'src/users/serializer/user.serializer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { getTokenExpiryConstants, TokenConstants } from 'src/utils/constants/token-expired.constant';
import hashCheck from 'src/helpers/hash/hash-check';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
    private readonly tokenConstants: TokenConstants;

    constructor(
        private config: ConfigService,
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {

        this.tokenConstants = getTokenExpiryConstants(this.config);
    }

    async adminSeeding(): Promise<{ userName: string, password: string }> {
        return this.usersService.adminSeeding();
    }

    async getLoginUser(user: User): Promise<User> {
        return this.usersService.getLoginUser(user);
    }

    async login(loginDto: LoginDto): Promise<UserSerializer> {
        const { userName, password } = loginDto;

        const user = await this.usersService.findByUserName(userName);

        if (!user) {
            throw new UnauthorizedException('Invalid userName or password');
        }

        const isPasswordValid = await hashCheck({ hashed: user.password, password });
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid userName or password');
        }

        const token = await this.accessToken(user.id, user.role);
        return new UserSerializer({
            ...user,
            expiredIn: this.calculateTokenExpiredDate(),
            accessToken: token
        });
    }


    // utils
    async accessToken(userId: string, role: string): Promise<string> {
        const payload = {
            sub: userId,
            role: role
        }
        const secretKey = this.config.get<string>('JWT_SECRET');
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: this.tokenConstants.TOKEN_EXPIRY_STRING as any,
            secret: secretKey
        });
        return token;
    }

    calculateTokenExpiredDate(): Date {
        const today = new Date();
        const tokenExpirationDate = addDays(today, this.tokenConstants.TOKEN_EXPIRY_DAYS);
        return tokenExpirationDate;
    }

}
