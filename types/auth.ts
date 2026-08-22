export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterRequest = AuthCredentials;

export type LoginRequest = AuthCredentials;

export type RegisterResponse = {
  message: string;
};

export type LoginResponse = {
  token: string;
};