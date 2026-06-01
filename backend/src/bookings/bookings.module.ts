import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking])
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule { }
