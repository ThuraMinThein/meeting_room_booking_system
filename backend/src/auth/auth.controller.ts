import { Body, ClassSerializerInterceptor, Controller, Get, Post, Request, SerializeOptions, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormExceptionFilter } from 'src/helpers/exception-filters/typeorm-exception.filter';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GROUP_ALL_USERS } from 'src/utils/serializer/group.serializer';
import { AuthenticatedRequest } from 'src/utils/constants/auth.constant';

@Controller({ path: 'auth', version: '1' })
@UseFilters(TypeormExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('seed/admin')
  async adminSeeding() {
    return this.authService.adminSeeding();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    groups: [GROUP_ALL_USERS],
  })
  @Get('me')
  getLoginUser(@Request() req: AuthenticatedRequest) {
    return this.authService.getLoginUser(req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

}
