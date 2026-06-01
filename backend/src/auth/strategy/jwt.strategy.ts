import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserSerializer } from "src/users/serializer/user.serializer";
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);
        return new UserSerializer(user);
    }
}