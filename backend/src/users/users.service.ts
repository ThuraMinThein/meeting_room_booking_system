import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserRoleEnum } from 'src/utils/enums/user.enum';
import { Paginate } from 'src/helpers/pagination/paginate';
import hashGenerate from 'src/helpers/hash/hash-generate';
import { randomString } from 'src/helpers/strings/string-generator.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService
  ) { }

  async getLoginUser(user: User): Promise<User> {
    return user;
  }

  async adminSeeding(): Promise<{ userName: string, password: string }> {
    const adminUserName = this.configService.get<string>('ADMIN_USER_NAME')!;
    const adminPassword = randomString(8);

    const existingAdmin = await this.findOneAdmin();
    if (existingAdmin) {
      throw new ConflictException('Admin already exists');
    }

    const hashedPassword = await hashGenerate(adminPassword);

    const adminUser = this.usersRepository.create({
      name: 'Admin',
      userName: adminUserName,
      password: hashedPassword,
      role: UserRoleEnum.Admin
    });

    await this.usersRepository.save(adminUser);
    return {
      userName: adminUserName,
      password: adminPassword
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { userName, password, name, role } = createUserDto;

    const existingUser = await this.findByUserName(userName);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await hashGenerate(password);

    const newUser = this.usersRepository.create({
      name,
      userName,
      password: hashedPassword,
      role
    });

    return this.usersRepository.save(newUser);
  }

  async findByUserName(userName: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        userName
      }
    })
  }

  async findOne(
    id: string,
    manager: EntityManager = this.usersRepository.manager
  ): Promise<User> {
    return manager.findOneOrFail(User, {
      where: {
        id
      }
    })
  }

  async findOneAdmin(): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        role: UserRoleEnum.Admin
      }
    })
  }

  async findAllUsers(
    page: number,
    limit: number,
    search?: string,
    roles?: UserRoleEnum[]
  ) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .andWhere('user.role = :role', { role: UserRoleEnum.User })
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere('user.name ILIKE :search', { search: `%${search}%` })
    }

    if (roles && roles.length > 0) {
      queryBuilder.andWhere('user.role IN (:...roles)', { roles });
    }

    return Paginate(queryBuilder, { page, limit });
  }

  async findAllUsersWithoutPagination(search?: string) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .andWhere('user.role = :role', { role: UserRoleEnum.User })
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere('user.name ILIKE :search', { search: `%${search}%` })
    }

    return queryBuilder.getMany();
  }

  async updateRole(id: string, updateUserRoleDto: UpdateUserRoleDto): Promise<{ message: string }> {
    const { role } = updateUserRoleDto;
    const user = await this.findOne(id);
    if (user.role === role) {
      throw new BadRequestException('User is already assigned to this role')
    }
    await this.usersRepository.update({ id }, { role });

    return { message: 'User role updated successfully' };
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

}