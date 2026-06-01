import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) { }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingsRepository.save(createBookingDto);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingsRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    await this.bookingsRepository.update(id, updateBookingDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.bookingsRepository.delete(id);
  }

}