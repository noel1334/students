
// src/components/Landing.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar'; // Ensure this component exists

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Only need 'user' and 'loading' states

  // This useEffect primarily handles redirection if not authenticated
  // It does NOT call fetchUserProfile, avoiding the loop.
  useEffect(() => {
    // If not currently loading auth status AND user is null, redirect to login
    if (!loading && !user) {
      navigate('/login'); // Redirect to your login page
    }
  }, [loading, user, navigate]); // Dependencies: loading status, user object, navigate function

  // Data extraction and fallbacks
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';
  const fullName = user?.name || 'Student Name';
  const studentEmail = user?.email || 'N/A Email';

  // Use optional chaining for nested data and provide fallbacks
  const currentSession = user?.currentSeasonName || 'N/A SESSION';
  const currentSemester = user?.currentSemesterName || 'N/A SEMESTER';
  const departmentName = user?.departmentName || 'N/A Department';
  const programName = user?.programName || 'N/A Program';
  const studyMode = user?.studyMode?.replace(/_/g, ' ') || 'N/A Mode'; // Format enum to readable string
  const level = user?.currentLevelName || 'N/A Level';

  // Show a loading indicator or null while user data is being fetched
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#1a4aa6] text-white flex items-center justify-center">
        <p>Loading user data...</p> {/* Replace with a proper spinner/skeleton loader */}
      </div>
    );
  }

  // Once user data is loaded, render the content
  return (
    <div className="min-h-screen bg-[#1a4aa6] text-white">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-white rounded-lg shadow-lg text-gray-800">
          {/* Semester Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium uppercase">
                {currentSemester}, {currentSession}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{programName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{studyMode}</span>
              </div>
              <div>
                <span className="font-medium">{level}</span>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-8 flex flex-col items-center">
            <UserAvatar 
              user={{ 
                profileImage: user.profileImage, 
                name: user.name // Pass name for initials generation
              }} 
              size="xl" 
              className="mb-4"
            />
            
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-gray-600 mb-2">{studentEmail}</p>
            
            <div className="text-center">
              <p className="text-gray-600 mb-1">{departmentName}</p>
              <p className="text-gray-600 mb-1">{programName}</p>
              <p className="text-gray-500 text-sm">
                {studyMode} • {level}
              </p>
            </div>

            <Button 
              className="w-full mt-6 bg-[#1a4aa6] hover:bg-[#0f3c8c] text-white"
              onClick={() => navigate('/dashboard')}
            >
              Proceed to Dashboard
            </Button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Welcome back, {firstName}</h2>
          
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
      </div>
    </div>
  );
};

export default Landing;
