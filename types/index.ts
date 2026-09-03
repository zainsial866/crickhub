export * from './user';
export * from './ground';
export * from './booking';
export * from './team';
export * from './admin';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
