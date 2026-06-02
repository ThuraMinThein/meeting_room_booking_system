import { Controller, Get, Post, Body, Param, Delete, UseFilters, UseGuards, Request, Query, DefaultValuePipe, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';
import { TypeormExceptionFilter } from 'src/helpers/exception-filters/typeorm-exception.filter';
import { Roles } from 'src/auth/decorators/role.decorators';
import { UserRoleEnum } from 'src/utils/enums/user.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { ParseNumberPipe } from 'src/helpers/pipes/parse-number.pipe';
import { GROUP_ALL_USERS } from 'src/utils/serializer/group.serializer';
import { ParseDatePipe } from 'src/helpers/pipes/parse-date.pipe';
import { AuthenticatedRequest } from 'src/utils/constants/auth.constant';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ groups: [GROUP_ALL_USERS] })
@Controller({ path: 'bookings', version: '1' })
@UseFilters(TypeormExceptionFilter)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.bookingsService.create(req.user, createBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), new ParseNumberPipe('page')) page = 1,
    @Query('limit', new DefaultValuePipe(10), new ParseNumberPipe('limit')) limit = 10,
  ) {
    return this.bookingsService.findAll(page, limit);
  }

  @Roles(UserRoleEnum.Owner, UserRoleEnum.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('user/:userId')
  findUserBookings(
    @Param('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), new ParseNumberPipe('page')) page = 1,
    @Query('limit', new DefaultValuePipe(10), new ParseNumberPipe('limit')) limit = 10,
  ) {
    return this.bookingsService.findUserBookings(page, limit, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('date/:date')
  findBookingsByDate(
    @Param('date', new ParseDatePipe('date')) date: Date,
  ) {
    return this.bookingsService.findBookingsByDate(date);
  }

  @Roles(UserRoleEnum.Owner, UserRoleEnum.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('summary')
  findBookingSummary(
    @Query('date', new DefaultValuePipe(new Date()), new ParseDatePipe('date')) date: Date,
  ) {
    return this.bookingsService.findBookingSummary(date);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest
  ) {
    return this.bookingsService.remove(req.user, id);
  }
}
