import { createContext } from 'react';
import type { User } from '@/types/user';

export interface AuthContextType {
  hasHydratedAuth: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithOidc: (targetPath?: string) => void;
  completeLogin: (payload: {
    authToken: string;
    expiresIn?: number;
    refreshToken?: string;
    tokenType?: string;
    userId?: string;
    email?: string;
    isAdmin?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
