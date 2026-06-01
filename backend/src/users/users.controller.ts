import { Controller, Get, Post, UseFilters, UseGuards, ClassSerializerInterceptor, UseInterceptors, SerializeOptions, Request, Query, DefaultValuePipe, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeormExceptionFilter } from 'src/helpers/exception-filters/typeorm-exception.filter';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GROUP_ALL_USERS } from 'src/utils/serializer/group.serializer';
import { Roles } from 'src/auth/decorators/role.decorators';
import { UserRoleArray, UserRoleEnum } from 'src/utils/enums/user.enum';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { ParseNumberPipe } from 'src/helpers/pipes/parse-number.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseStringArrayPipe } from 'src/helpers/pipes/parse-string-array.pipe';
import { UpdateUserRoleDto } from './dto/update-user.dto';

@Roles(UserRoleEnum.Admin)
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ groups: [GROUP_ALL_USERS] })
@Controller({ path: 'users', version: '1' })
@UseFilters(TypeormExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  findAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAllByAdmin(
    @Query('page', new DefaultValuePipe(1), new ParseNumberPipe('page')) page = 1,
    @Query('limit', new DefaultValuePipe(10), new ParseNumberPipe('limit')) limit = 10,
    @Query('search') search: string,
    @Query('roles', new ParseStringArrayPipe('roles', UserRoleArray)) roles: UserRoleEnum[]
  ) {
    return this.usersService.findAllUsers(page, limit, search, roles);
  }

  @Roles(UserRoleEnum.Owner)
  @Get('full')
  findAllUsers(
    @Query('search') search: string,
  ) {
    return this.usersService.findAllUsersWithoutPagination(search);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.usersService.updateRole(id, updateUserRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}
