
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import api, { endpoints } from '@/config/api';

interface User {
  id: string;
  regNo?: string;
  jambRegNo?: string;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, studentNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');

      if (token && savedUser) {
        try {
          // Set the authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // For now, trust the saved user data - you could verify with a profile endpoint later
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('currentUser');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    try {
      console.log('Attempting login with:', { identifier });
      
      const response = await api.post('/auth/student/login', {
        identifier,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.status === 'success' && response.data.data) {
        const { token, student } = response.data.data;

        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(student));

        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(student);

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "An error occurred during login";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    studentNumber: string
  ) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        studentNumber
      });

      if (response.data.status === 'success' && response.data.data) {
        const { token, user: userData } = response.data.data;

        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);

        toast({
          title: "Account created successfully",
          description: "Welcome to the platform!",
          variant: "default",
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "An error occurred during sign up";
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
