import { TypeOrmModule } from "@nestjs/typeorm";
import { ModeEnum } from "../utils/enums/mode.enum";
import { User } from "src/users/entities/user.entity";
import { Booking } from "src/bookings/entities/booking.entity";

const isProduction =
    process.env.MODE === ModeEnum.Production ||
    process.env.NODE_ENV === ModeEnum.Production;

const sslRequire = isProduction
    ? {
        ssl: {
            rejectUnauthorized: false,
        },
    }
    : {
        ssl: false,
    };

const DataSource = TypeOrmModule.forRoot(

    {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT!,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ...sslRequire,
        entities: [User, Booking],
        synchronize: false
    }
);

export const Databases = [DataSource];