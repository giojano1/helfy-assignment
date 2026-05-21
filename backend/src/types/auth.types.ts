/**
 * JWT payload shape — mirrored in frontend/src/types/auth.types.ts.
 * Keep both files in sync manually.
 */
export interface JwtPayload {
  sub: string; // user UUID
  email: string;
  role: "customer" | "admin";
  iat: number;
  exp: number;
}

/**
 * Data Transfer Object returned to the client after authentication.
 */
export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: "customer" | "admin";
}

/**
 * Response envelope for auth endpoints that return a token.
 */
export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}
