import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { Databases } from './database/database';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 15,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...Databases,
    UsersModule,
    BookingsModule,
    AuthModule,
  ],
})
export class AppModule { }
