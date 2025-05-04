
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Results from "./pages/Results";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Hostel from "./pages/Hostel";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";

// Create a client
const queryClient = new QueryClient();

// Layout component to conditionally render the sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';

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
          <Routes>
            <Route path="/" element={
              <Layout>
                <Landing />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/courses" element={
              <Layout>
                <Courses />
              </Layout>
            } />
            <Route path="/results" element={
              <Layout>
                <Results />
              </Layout>
            } />
            <Route path="/payments" element={
              <Layout>
                <Payments />
              </Layout>
            } />
            <Route path="/notifications" element={
              <Layout>
                <Notifications />
              </Layout>
            } />
            <Route path="/hostel" element={
              <Layout>
                <Hostel />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />
            <Route path="/support" element={
              <Layout>
                <Support />
              </Layout>
            } />
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
