export class BffValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'BffValidationError';
    this.statusCode = statusCode;
  }
}
