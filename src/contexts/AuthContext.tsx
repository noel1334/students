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
  profileImage?: string;
  department?: string;
  program?: string;
  level?: string;
  currentSession?: string;
  currentSemester?: string;
  studyMode?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, studentNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const response = await api.get('/student/me');
      console.log('Profile response:', response.data);
      
      if (response.data.status === 'success' && response.data.data) {
        const profileData = response.data.data;
        setUser(prevUser => ({
          ...prevUser,
          ...profileData,
          currentSession: profileData.currentSession || '2024/2025',
          currentSemester: profileData.currentSemester || 'FIRST SEMESTER'
        }));
        
        // Update localStorage with complete user data
        localStorage.setItem('currentUser', JSON.stringify({
          ...user,
          ...profileData
        }));
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Don't show error toast for profile fetch failure
    }
  };

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');

      if (token && savedUser) {
        try {
          // Set the authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Parse saved user data
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Fetch updated profile data
          await fetchUserProfile();
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

        // Fetch complete profile data
        await fetchUserProfile();

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
    fetchUserProfile,
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
