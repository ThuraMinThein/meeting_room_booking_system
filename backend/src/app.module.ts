import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Databases } from './database/database';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 15,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
    ...Databases,
    UsersModule,
  ],
})
export class AppModule { }
