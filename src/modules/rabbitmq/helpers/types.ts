export interface Request<T = Record<string, any>> {
  body: T;
  headers?: Record<string, string>;
}
