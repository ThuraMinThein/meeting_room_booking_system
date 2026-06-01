import { Expose } from "class-transformer";
import { Booking } from "src/bookings/entities/booking.entity";
import { UserRoleEnum } from "src/utils/enums/user.enum";
import { GROUP_SUPER_ADMIN } from "src/utils/serializer/group.serializer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({
        name: 'user_name',
        unique: true
    })
    userName!: string;

    @Column()
    @Expose({ groups: [GROUP_SUPER_ADMIN] })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
    })
    role!: UserRoleEnum;

    @OneToMany(() => Booking, (bookings) => bookings.user, { cascade: true })
    bookings?: Booking[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date

}
