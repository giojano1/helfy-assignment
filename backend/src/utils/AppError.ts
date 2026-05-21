/**
 * Typed application error class.
 * All intentional errors thrown in services/controllers should use this class.
 * The global error handler middleware reads statusCode and code to build the response.
 *
 * @param message - Human-readable error description
 * @param statusCode - HTTP status code (400, 401, 403, 404, 409, 422, 500…)
 * @param code - Machine-readable error code (e.g. "VALIDATION_ERROR", "NOT_FOUND")
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
