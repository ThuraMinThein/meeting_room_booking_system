import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from 'src/users/entities/user.entity';
import { Pagination } from 'src/helpers/pagination/pagination';
import { Paginate } from 'src/helpers/pagination/paginate';
import { UserRoleEnum } from 'src/utils/enums/user.enum';
import { endOfMonth, startOfMonth } from 'date-fns';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    private readonly dataSource: DataSource
  ) { }

  async create(user: User, createBookingDto: CreateBookingDto): Promise<Booking> {

    const { startTime, endTime } = createBookingDto;

    if (startTime < new Date()) {
      throw new BadRequestException(
        'startTime must be in the future',
      );
    }

    if (startTime >= endTime) {
      throw new BadRequestException(
        'startTime must be before endTime',
      );
    }

    return this.dataSource.transaction(
      'SERIALIZABLE',
      async (manager) => {
        const overlap = await manager
          .getRepository(Booking)
          .createQueryBuilder('booking')
          .where(
            'booking.startTime < :endTime AND booking.endTime > :startTime',
            { startTime, endTime },
          )
          .getOne();

        if (overlap) {
          throw new BadRequestException(
            'Booking overlaps with an existing booking.',
          );
        }

        const booking = manager.create(Booking, {
          ...createBookingDto,
          user,
        });

        return manager.save(booking);
      },
    );
  }

  async findAll(page: number, limit: number, userId?: string): Promise<Pagination<Booking>> {
    const queryBuilder = this.bookingsRepository.createQueryBuilder('booking')
      .orderBy('booking.startTime', 'ASC')
      .leftJoinAndSelect('booking.user', 'user');

    if (userId) {
      queryBuilder.where('booking.userId = :userId', { userId });
    }

    return Paginate(queryBuilder, { page, limit });
  }

  async findUserBookings(page: number, limit: number, userId: string): Promise<Pagination<Booking>> {
    return this.findAll(page, limit, userId);
  }

  async findBookingsByDate(date: Date): Promise<Booking[]> {
    // get today bookings
    return this.bookingsRepository.createQueryBuilder('booking')
      .where('Date(booking.startTime) = :start', { start: date })
      .leftJoinAndSelect('booking.user', 'user')
      .getMany();
  }

  async findBookingSummary(date: Date) {
    const sm = startOfMonth(date);
    const em = endOfMonth(date);

    const totalBookings = await this.bookingsRepository.count({
      where: {
        startTime: Between(sm, em),
      },
    });

    const users = await this.bookingsRepository.createQueryBuilder('booking')
      .select('booking.userId', 'userId')
      .addSelect('user.name', 'name')
      .addSelect('COUNT(booking.id)::int', 'bookingCount')
      .innerJoin(User, 'user', 'user.id = booking.userId')
      .where('booking.startTime BETWEEN :start AND :end', { start: sm, end: em })
      .groupBy('booking.userId')
      .addGroupBy('user.name')
      .getRawMany();

    return {
      totalBookings,
      users,
    };
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingsRepository.findOneByOrFail({ id });
  }

  async remove(user: User, id: string): Promise<{ message: string }> {
    const booking = await this.findOne(id);

    if (user.role === UserRoleEnum.User && booking.userId !== user.id) {
      throw new ForbiddenException('You are not the owner of this booking.');
    }

    await this.bookingsRepository.delete(id);
    return {
      message: 'Booking deleted successfully',
    }
  }

}