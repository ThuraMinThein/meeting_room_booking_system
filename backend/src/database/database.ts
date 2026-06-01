import { TypeOrmModule } from "@nestjs/typeorm";
import { ModeEnum } from "../utils/enums/mode.enum";

const sslRequire = process.env.MODE === ModeEnum.Production ? {
    ssl: true,
} : {
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
        entities: [],
        synchronize: false
    }
);

export const Databases = [DataSource];