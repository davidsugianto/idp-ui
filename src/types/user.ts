export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  groups: string[];
}

export interface AuthTokens {
  auth_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type?: string;
}

export interface AuthState {
  hasHydratedAuth: boolean;
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
}
