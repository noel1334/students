
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#1a4aa6] text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold">My Home</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            className="text-primary bg-[#f18c3d] hover:bg-[#e67e2e] text-white"
            onClick={() => navigate('/support')}
          >
            Support
          </Button>
          {user ? (
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/20"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/20"
              onClick={() => navigate('/auth')}
            >
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-10 px-6">
        {user ? (
          // User is logged in
          <div className="bg-white rounded-lg shadow-lg text-gray-800">
            {/* Semester Info */}
            <div className="p-4 border-b flex items-center gap-2">
              <span className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </span>
              <span className="text-sm font-medium uppercase">FIRST SEMESTER, 2024/2025 SESSION</span>
            </div>

            {/* Profile Section */}
            <div className="p-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                <img 
                  src="/lovable-uploads/be0fedbf-c714-447d-8168-3ad9fb83d57e.png" 
                  alt="Student Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">Victor NOEL</h2>
              <p className="text-gray-600 mb-2">18/50770D/6</p>
              <p className="text-gray-600 flex items-center gap-2">
                <span>Full Time</span>
                <span>•</span>
                <span>Science Education</span>
                <span>•</span>
                <span>600 Level Level</span>
              </p>

              <Button 
                className="w-full mt-6 bg-[#1a4aa6] hover:bg-[#0f3c8c] text-white"
                onClick={() => navigate('/dashboard')}
              >
                Proceed to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          // User is not logged in
          <div className="bg-white rounded-lg shadow-lg text-gray-800 p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Student Portal</h1>
            <p className="text-gray-600 text-center mb-8">
              Please sign in or register to access your student dashboard and manage your academic journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-[#1a4aa6] hover:bg-[#0f3c8c] text-white px-8 py-6 text-lg"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              
              <Button 
                variant="outline"
                className="border-[#1a4aa6] text-[#1a4aa6] hover:bg-[#1a4aa6] hover:text-white px-8 py-6 text-lg"
                onClick={() => navigate('/auth#register')}
              >
                Register
              </Button>
            </div>
          </div>
        )}

        {user && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Welcome back, Victor</h2>
            
            <div className="mt-4">
              <p className="text-white/80">0/2 registration steps completed</p>
              <p className="text-white/70 text-sm mt-1">
                *Please note hostel accommodation is not compulsory and it depends on
                eligibility and availability.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-medium">Follow the steps to get you started for the new session</h3>
              
              <div className="mt-4 space-y-3">
                <div 
                  className="bg-white/10 p-4 rounded-md flex justify-between items-center cursor-pointer"
                  onClick={() => navigate('/payments')}
                >
                  <span className="font-medium">Fees</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
                
                <div 
                  className="bg-white/10 p-4 rounded-md flex justify-between items-center cursor-pointer"
                  onClick={() => navigate('/courses')}
                >
                  <span className="font-medium">Courses</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Payment Verification Section */}
            <div className="mt-10">
              <h3 className="text-xl font-medium">Issues with Payment Verification?</h3>
              <p className="mt-2">
                Payments are typically verified automatically in the background. If
                your payment hasn't been verified, please click the button below to
                requery the verification.
              </p>
              <Button variant="outline" className="w-full mt-4 bg-white text-[#1a4aa6] hover:bg-white/90">
                Requery Payment Verification
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
