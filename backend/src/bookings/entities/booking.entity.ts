import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('bookings')
export class Booking {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ default: null })
    title!: string;

    @Column({ name: 'user_id' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

    @Column({
        name: 'start_time',
        type: 'timestamptz',
    })
    startTime!: Date;

    @Column({
        name: 'end_time',
        type: 'timestamptz',
    })
    endTime!: Date;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt!: Date;

}
