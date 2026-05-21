import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import type { RegisterDto } from '../schemas/auth.schema';

export class UserRepository {
  private readonly repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  /** Find a user by email (including soft-deleted is NOT included by default). */
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  /** Find a user by UUID. */
  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  /** Insert a new user record and return it. */
  async create(dto: RegisterDto & { passwordHash: string; role?: 'customer' | 'admin' }): Promise<User> {
    const user = this.repo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash: dto.passwordHash,
      role: dto.role ?? 'customer',
    });
    return this.repo.save(user);
  }

  /** Persist changes to an existing user. */
  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }
}
