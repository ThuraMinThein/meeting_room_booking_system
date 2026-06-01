import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateBookingDto {

    @IsNotEmpty()
    @IsDateString()
    startTime!: Date;

    @IsNotEmpty()
    @IsDateString()
    endTime!: Date;
}
