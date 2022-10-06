export class StatusError extends Error {
  readonly statusCode: number;

  constructor(message, code = 500) {
    super(message);
    this.statusCode = code;
    this.name = 'StatusError';
  }
}
