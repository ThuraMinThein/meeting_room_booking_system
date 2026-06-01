import { Exclude } from "class-transformer";
import { UserRoleEnum } from "src/utils/enums/user.enum";
export class UserSerializer {
    id!: string;
    name!: string;
    userName!: string;
    role!: UserRoleEnum;
    expiredIn!: Date;
    accessToken!: string;
    @Exclude()
    password!: string;

    constructor(partial: Partial<UserSerializer>) {
        Object.assign(this, partial);
    }
}