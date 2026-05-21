import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/hash';
import { UserRepository } from '../repositories/user.repository';
import type { UpdateProfileDto, ChangePasswordDto } from '../schemas/user.schema';
import type { UserDto } from '../types/auth.types';

const userRepo = new UserRepository();

function toDto(user: { id: string; email: string; firstName: string; lastName: string; avatarUrl: string | null; role: 'customer' | 'admin' }): UserDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };
}

/**
 * Return the authenticated user's profile.
 */
export async function getProfile(userId: string): Promise<UserDto> {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  return toDto(user);
}

/**
 * Update user profile fields (name, email, avatar).
 */
export async function updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDto> {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

  if (dto.email && dto.email !== user.email) {
    const conflict = await userRepo.findByEmail(dto.email);
    if (conflict) throw new AppError('Email already in use', 409, 'EMAIL_CONFLICT');
    user.email = dto.email;
  }

  if (dto.firstName !== undefined) user.firstName = dto.firstName;
  if (dto.lastName !== undefined) user.lastName = dto.lastName;
  if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl ?? null;

  await userRepo.save(user);
  return toDto(user);
}

/**
 * Change the user's password after verifying the current one.
 */
export async function changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

  const valid = await comparePassword(dto.currentPassword, user.passwordHash);
  if (!valid) throw new AppError('Current password is incorrect', 401, 'INVALID_CREDENTIALS');

  user.passwordHash = await hashPassword(dto.newPassword);
  await userRepo.save(user);
}
