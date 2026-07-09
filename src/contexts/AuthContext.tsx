// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
// Import setLogoutCallback from your updated api config
import api, { endpoints, setLogoutCallback } from '@/config/api'; 
import { getStudentProfile } from '@/services/studentServicesApi';


interface User {
  id: string;
  regNo?: string;
  jambRegNo?: string;
  name?: string; // Student's full name (e.g., "Grace Eneche")
  email?: string;
  
  profileImage?: string | null; // Final resolved image URL, or null
  avatarLetter?: string; // First letter of student name for fallback
  signatureImage?: string | null; // Student signature image URL
  
  departmentName?: string;
  programName?: string;
  programCode?: string; // e.g., "CSC", "ENG"
  degreeType?: string; // e.g., "ND", "HND", "UNDERGRADUATE"
  programDuration?: number; // e.g., 4 (years)
  studyMode?: string; // e.g., "FULL_TIME", "PART_TIME"
  currentLevelName?: string; // e.g., "100 Level", "200 Level"
  currentLevelValue?: number; // e.g., 100, 200
  currentLevelId?: string; // ID of the current level
  currentSeasonName?: string; // e.g., "2024/2025 Academic Session"
  currentSeasonId?: string; // ID of the current season
  currentSemesterName?: string; // e.g., "First Semester"
  currentSemesterId?: string; // ID of the current semester
  currentSemesterType?: string; // e.g., "FIRST"

  isActive?: boolean;
  isGraduated?: boolean;
  yearOfAdmission?: number;
  entryMode?: string;
  bioData?: { 
      nationality?: string;
    };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, studentNumber: string) => Promise<void>;
  signOut: (showToast?: boolean) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signOut = useCallback(async (showToast: boolean = true) => {
    // Check if the user was actually logged in before this function was called.
    const wasLoggedIn = !!localStorage.getItem('authToken');

    try {
      // Only attempt to call the logout endpoint if it wasn't an automatic session expiry
      if (wasLoggedIn) {
        await api.post(endpoints.auth.logout);
      }
    } catch (error) {
      console.error('Logout API call failed, but proceeding with client-side logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);

      // Show a more informative toast message
      if (showToast) {
        toast({
          title: wasLoggedIn ? "Session Expired" : "Logged Out",
          description: wasLoggedIn
            ? "Your session has expired. Please log in again."
            : "You have been successfully logged out.",
          variant: wasLoggedIn ? "destructive" : "default",
        });
      }
    }
  }, [toast]);

  // THIS IS A KEY ADDITION:
  // This effect connects the API interceptor to your signOut function.
  // It runs once and provides the signOut function to the API layer,
  // allowing it to trigger a graceful logout on any 401 error.
  useEffect(() => {
    setLogoutCallback(signOut);
  }, [signOut]);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudentProfile();
      
      if (response.status === 'success' && response.data && response.data.student) {
        const profileData = response.data.student;

        const transformedProfile: User = {
          id: profileData.id,
          regNo: profileData.regNo,
          jambRegNo: profileData.jambRegNo,
          name: profileData.name,
          email: profileData.email,
          profileImage: profileData.profileImg,
          avatarLetter: profileData.avatarLetter,
          signatureImage: profileData.studentDetails?.signatureImg || null,
          departmentName: profileData.department?.name,
          programName: profileData.program?.name,
          programCode: profileData.program?.programCode,
          degreeType: profileData.program?.degreeType,
          programDuration: profileData.program?.duration,
          studyMode: profileData.program?.modeOfStudy,
          currentLevelName: profileData.currentLevel?.name,
          currentLevelValue: profileData.currentLevel?.value,
          currentLevelId: profileData.currentLevel?.id?.toString(),
          currentSeasonName: profileData.currentSeason?.name,
          currentSeasonId: profileData.currentSeason?.id?.toString(),
          currentSemesterName: profileData.currentSemester?.name,
          currentSemesterId: profileData.currentSemester?.id?.toString(),
          currentSemesterType: profileData.currentSemester?.type,
          isActive: profileData.isActive,
          isGraduated: profileData.isGraduated,
          yearOfAdmission: profileData.yearOfAdmission,
          entryMode: profileData.entryMode,
          bioData: {
            nationality: profileData.studentDetails?.bioData?.nationality || undefined,
          },
        };
        setUser(transformedProfile);
        localStorage.setItem('currentUser', JSON.stringify(transformedProfile));
      } else {
        console.warn('API returned success but no valid student profile data. Clearing user session.', response);
        await signOut(false);
        throw new Error('Profile fetch returned no student data.');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Clear any stale auth so ProtectedRoute redirects to /login.
      // The 401 case is already handled by the axios interceptor -> signOut,
      // but we also want to bail out on 403 / 500 / network errors etc.
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      toast({
        title: 'Session error',
        description:
          error?.response?.data?.message ||
          'We could not load your profile. Please sign in again.',
        variant: 'destructive',
      });
      // Re-throw so callers (e.g. signIn) know the login flow could not complete.
      throw error;
    } finally {
      setLoading(false); 
    }
  }, [signOut, toast]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        setUser(JSON.parse(savedUser));
        fetchUserProfile(); 
      } catch (e) {
        console.error("Failed to parse saved user from localStorage or initial setup:", e);
        signOut(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile, signOut]);

  const signIn = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post(endpoints.auth.studentLogin, {
        identifier,
        password,
      });

      if (response.status === 200 && response.data.status === 'success' && response.data.data) {
        const { token, refreshToken } = response.data.data; // Assuming your login also returns a refreshToken

        localStorage.setItem('authToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken); // Store the refresh token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        await fetchUserProfile();

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error('Invalid login response format or credentials.');
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
      setLoading(false); 
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
    setLoading(true);
    try {
      const response = await api.post(endpoints.auth.register, {
        email,
        password,
        firstName,
        lastName,
        studentNumber
      });

      if (response.status === 200 && response.data.status === 'success' && response.data.data) {
        const { token, refreshToken } = response.data.data; // Assuming signup also returns tokens

        localStorage.setItem('authToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken); // Store the refresh token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await fetchUserProfile();

        toast({
          title: "Account created successfully",
          description: "Welcome to the platform!",
          variant: "default",
        });
      } else {
        throw new Error('Invalid signup response format.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "An error occurred during sign up";
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
      throw error;
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