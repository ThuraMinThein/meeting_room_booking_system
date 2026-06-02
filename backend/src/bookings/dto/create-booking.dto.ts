import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {

    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsNotEmpty()
    @IsDateString()
    startTime!: Date;

    @IsNotEmpty()
    @IsDateString()
    endTime!: Date;
}
