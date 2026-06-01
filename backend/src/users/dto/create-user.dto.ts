import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRoleEnum } from "src/utils/enums/user.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    userName!: string;

    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role!: UserRoleEnum;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string;
}
