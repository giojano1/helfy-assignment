import { Response } from 'express';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token';
import { UserRepository } from '../repositories/user.repository';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema';
import type { AuthResponseDto, UserDto } from '../types/auth.types';

const userRepo = new UserRepository();

/** Cookie options for the refresh token. */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env['NODE_ENV'] === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

function toUserDto(user: { id: string; email: string; firstName: string; lastName: string; avatarUrl: string | null; role: 'customer' | 'admin' }): UserDto {
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
 * Register a new customer account.
 * Returns access token and sets refresh cookie.
 */
export async function registerUser(dto: RegisterDto, res: Response): Promise<AuthResponseDto> {
  const existing = await userRepo.findByEmail(dto.email);
  if (existing) {
    throw new AppError('Email already in use', 409, 'EMAIL_CONFLICT');
  }

  const passwordHash = await hashPassword(dto.password);
  const user = await userRepo.create({ ...dto, passwordHash });

  const tokenPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return { accessToken, user: toUserDto(user) };
}

/**
 * Authenticate with email + password.
 * Returns access token and sets refresh cookie.
 */
export async function loginUser(dto: LoginDto, res: Response): Promise<AuthResponseDto> {
  const user = await userRepo.findByEmail(dto.email);
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await comparePassword(dto.password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const tokenPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return { accessToken, user: toUserDto(user) };
}

/**
 * Issue a new access token using the refresh cookie.
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
  }

  const user = await userRepo.findById(payload.sub);
  if (!user) {
    throw new AppError('User not found', 401, 'UNAUTHORIZED');
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return { accessToken };
}

/**
 * Clear the refresh token cookie (logout).
 */
export function logoutUser(res: Response): void {
  res.clearCookie('refreshToken', { path: '/' });
}

/**
 * Return the profile of the currently authenticated user.
 */
export async function getMe(userId: string): Promise<UserDto> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  return toUserDto(user);
}
