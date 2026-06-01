import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

