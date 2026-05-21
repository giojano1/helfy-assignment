/**
 * Account feature — local TypeScript types.
 * Full type definitions added in Phase 4.
 */

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: "customer" | "admin";
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
