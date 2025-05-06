
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Results from "./pages/Results";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Hostel from "./pages/Hostel";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";

// Create a client
const queryClient = new QueryClient();

// Layout component to conditionally render the sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/' && location.pathname !== '/auth';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col ${!showSidebar ? 'w-full' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={
                <Layout>
                  <Landing />
                </Layout>
              } />
              <Route path="/auth" element={
                <Layout>
                  <Auth />
                </Layout>
              } />
              <Route path="/dashboard" element={
                <Layout>
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/courses" element={
                <Layout>
                  <PrivateRoute>
                    <Courses />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/results" element={
                <Layout>
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/payments" element={
                <Layout>
                  <PrivateRoute>
                    <Payments />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/notifications" element={
                <Layout>
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/hostel" element={
                <Layout>
                  <PrivateRoute>
                    <Hostel />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/profile" element={
                <Layout>
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/settings" element={
                <Layout>
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="/support" element={
                <Layout>
                  <PrivateRoute>
                    <Support />
                  </PrivateRoute>
                </Layout>
              } />
              <Route path="*" element={
                <Layout>
                  <NotFound />
                </Layout>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
