import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../user-role.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  // Getter agregado para permitir acceso al repositorio desde AuthService
  get usersRepo(): Repository<UserEntity> {
    return this.userRepository;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_COST') || '12');
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const userCount = await this.userRepository.count();
    const role = userCount === 0 ? UserRole.ADMIN : (createUserDto.role || UserRole.USER);

    const newUser = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.trim().toLowerCase(), 
      passwordHash: hashedPassword,
      role,
    });

    return await this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { id: true, email: true, passwordHash: true, role: true } 
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}