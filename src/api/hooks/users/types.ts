export interface User {
  id: string;
  username: string;
  email: string;
}

export type UseLogin = () => ReturnType<typeof import('./users').useLogin>;

export interface UsersApi {
  useLogin: UseLogin;
  useLoginConfig: typeof import('./users').useLoginConfig;
}
