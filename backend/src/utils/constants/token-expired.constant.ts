import { ConfigService } from '@nestjs/config';

export interface TokenConstants {
    TOKEN_EXPIRY_DAYS: number;
    TOKEN_EXPIRY_STRING: string;
}

export const getTokenExpiryConstants = (configService: ConfigService): TokenConstants => {
    const days = configService.get<number>('TOKEN_EXPIRY_DAYS', 180);
    return {
        TOKEN_EXPIRY_DAYS: days,
        TOKEN_EXPIRY_STRING: `${days}d`
    };
};