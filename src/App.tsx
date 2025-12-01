
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Results from "./pages/Results";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Hostel from "./pages/Hostel";
import HostelBookingDetails from "./pages/HostelBookingDetails";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentStatusPage from './pages/PaymentStatusPage';
import ExamAssignments from './pages/ExamAssignments';
import ExamPaymentHistory from './pages/ExamPaymentHistory';

// Create a client
const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
              <Route path="*" element={
                <ProtectedRoute>
                  <Layout>
                    <NotFound />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
