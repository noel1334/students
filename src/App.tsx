
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { Loader2 } from 'lucide-react';

// Route-level code splitting: each page ships as its own JS chunk so the
// initial bundle doesn't include every page's dependencies.
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseHistory = lazy(() => import('./pages/CourseHistory'));
const Results = lazy(() => import('./pages/Results'));
const Payments = lazy(() => import('./pages/Payments'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Hostel = lazy(() => import('./pages/Hostel'));
const HostelBookingDetails = lazy(() => import('./pages/HostelBookingDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Support = lazy(() => import('./pages/Support'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage'));
const ExamAssignments = lazy(() => import('./pages/ExamAssignments'));
const ExamPaymentHistory = lazy(() => import('./pages/ExamPaymentHistory'));

// Create a client with sensible defaults for a student portal.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Layout component to conditionally render the sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <TopBar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Suspense fallback={<RouteFallback />}>
                <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Landing />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Layout>
                    <Courses />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/course-history" element={
                <ProtectedRoute>
                  <Layout>
                    <CourseHistory />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Layout>
                    <Results />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payment-status" element={
                <ProtectedRoute>
                  <Layout>
                     <PaymentStatusPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/hostel" element={
                <ProtectedRoute>
                  <Layout>
                    <Hostel />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/hostel/booking/:bookingId" element={
                <ProtectedRoute>
                  <HostelBookingDetails />
                </ProtectedRoute>
              } />
              <Route path="/exams" element={
                <ProtectedRoute>
                  <Layout>
                    <ExamAssignments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/exam-payments" element={
                <ProtectedRoute>
                  <Layout>
                    <ExamPaymentHistory />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <Layout>
                    <Support />
                  </Layout>
                </ProtectedRoute>
              } />
              {/* Public 404 — unauthenticated users get a real 404 instead of
                  being bounced to /login for unknown URLs. */}
              <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
