import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, studentNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === "Email not confirmed") {
          // Special message for email confirmation issues
          toast({
            title: "Email verification not required",
            description: "Please go to Supabase dashboard and disable email confirmation in the authentication settings.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message || "An error occurred during login",
            variant: "destructive",
          });
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Login error:", error);
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
      // Sign up the user in Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { 
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      if (signUpError) throw signUpError;
      
      // After successful signup, update the student record with additional info
      const { error: updateError } = await supabase
        .from('students')
        .update({ 
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber
        })
        .eq('email', email);
        
      if (updateError) {
        console.error("Error updating student record:", updateError);
        // Don't throw here, as the user was created successfully
        toast({
          title: "Account created",
          description: "Your account was created, but some profile data couldn't be saved. You can update it later.",
          variant: "default",
        });
      } else {
        toast({
          title: "Account created successfully",
          description: "You can now login with your credentials",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
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
