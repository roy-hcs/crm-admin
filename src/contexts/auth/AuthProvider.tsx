import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type User } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if there's a stored token or session
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validate token here if needed
      setIsAuthenticated(true);
      // You might want to fetch user data here
      setUser({
        id: '1',
        name: 'User',
        email: 'user@example.com',
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Implement actual authentication logic here
      // This is a placeholder implementation
      if (email && password) {
        localStorage.setItem('auth_token', 'sample_token');
        setIsAuthenticated(true);
        setUser({
          id: '1',
          name: 'User',
          email: email,
        });
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
