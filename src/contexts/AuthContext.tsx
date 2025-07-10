
// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import api, { endpoints } from '@/config/api';
// IMPORTANT: Make sure StudentProfileData interface correctly represents what getStudentProfile returns.
// If getStudentProfile returns { student: actualStudentObject }, then StudentProfileData should be { student: ActualStudentDetailsInterface }
// For now, let's assume StudentProfileData is the 'actualStudentObject' directly,
// and we'll adjust the API service call to destructure it.
import { getStudentProfile, StudentProfileData as BackendStudentData } from '@/services/studentServicesApi';


interface User {
  id: string;
  regNo?: string;
  jambRegNo?: string;
  name?: string; // Student's full name (e.g., "Grace Eneche")
  email?: string;
  
  profileImage?: string | null; // Final resolved image URL, or null
  avatarLetter?: string; // First letter of student name for fallback
  
  departmentName?: string;
  programName?: string;
  studyMode?: string; // e.g., "FULL_TIME", "PART_TIME"
  currentLevelName?: string; // e.g., "100 Level", "200 Level"
  currentLevelValue?: number; // e.g., 100, 200
  currentLevelId?: string; // Level ID for API calls
  currentSeasonName?: string; // e.g., "2024/2025 Academic Session"
  currentSeasonId?: string; // Season ID for API calls
  currentSemesterName?: string; // e.g., "First Semester"
  currentSemesterId?: string; // Semester ID for API calls
  currentSemesterType?: string; // e.g., "FIRST"

  isActive?: boolean;
  isGraduated?: boolean;
  yearOfAdmission?: number;
  entryMode?: string;
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
    try {
      await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      if (showToast) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      }
    }
  }, [toast]);


  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching user profile...');
      // This response.data is { student: {...} }
      const response = await getStudentProfile(); 
      console.log('Profile response data:', response.data);
      
      if (response.status === 'success' && response.data && response.data.student) { // <-- Access response.data.student
        const profileData = response.data.student; // <-- This is the actual student object now!

        const transformedProfile: User = {
          id: profileData.id,
          regNo: profileData.regNo,
          jambRegNo: profileData.jambRegNo,
          name: profileData.name,
          email: profileData.email,
          profileImage: profileData.profileImg,
          avatarLetter: profileData.avatarLetter,
          
          // Now these properties are correctly accessed directly from profileData
          departmentName: profileData.department?.name,
          programName: profileData.program?.name,
          studyMode: profileData.program?.modeOfStudy,
          currentLevelName: profileData.currentLevel?.name,
          currentLevelValue: profileData.currentLevel?.value,
          currentLevelId: profileData.currentLevel?.id?.toString(), // Convert to string
          currentSeasonName: profileData.currentSeason?.name,
          currentSeasonId: profileData.currentSeason?.id?.toString(), // Convert to string
          currentSemesterName: profileData.currentSemester?.name,
          currentSemesterId: profileData.currentSemester?.id?.toString(), // Convert to string
          currentSemesterType: profileData.currentSemester?.type,

          isActive: profileData.isActive,
          isGraduated: profileData.isGraduated,
          yearOfAdmission: profileData.yearOfAdmission,
          entryMode: profileData.entryMode,
        };

        setUser(transformedProfile);
        localStorage.setItem('currentUser', JSON.stringify(transformedProfile));
      } else {
        console.warn('API returned success but no valid student profile data. Clearing user session.', response);
        signOut(false);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        signOut(false);
      } else {
        console.error('Non-auth related error during profile fetch. Signing out.');
        signOut(false);
      }
    } finally {
      setLoading(false); 
    }
  }, [signOut]);


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
      setUser(null);
      setLoading(false);
    }
  }, [fetchUserProfile, signOut]);


  const signIn = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', { identifier });
      const response = await api.post(endpoints.auth.studentLogin, {
        identifier,
        password,
      });

      console.log('Login response:', response.data);

      if (response.status === 200 && response.data.status === 'success' && response.data.data) {
        const { token } = response.data.data;

        localStorage.setItem('authToken', token);
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
        const { token } = response.data.data;

        localStorage.setItem('authToken', token);
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
