import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from 'src/utils/enums/user.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role!: UserRoleEnum;
}