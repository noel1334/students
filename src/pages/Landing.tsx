
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar';

const Landing = () => {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAuth();

  useEffect(() => {
    // Fetch fresh user profile when component mounts
    if (user) {
      fetchUserProfile();
    }
  }, []);
  
  // Extract first name from user data if available
  const firstName = user?.first_name || user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';
  const fullName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user?.name || 'Student Name';

  // Get current session and semester
  const currentSession = user?.currentSession || '2024/2025 SESSION';
  const currentSemester = user?.currentSemester || 'FIRST SEMESTER';

  console.log('Landing page user data:', user);

  return (
    <div className="min-h-screen bg-[#1a4aa6] text-white">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-white rounded-lg shadow-lg text-gray-800">
          {/* Semester Info */}
          <div className="p-4 border-b flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium uppercase">
              {currentSemester}, {currentSession}
            </span>
          </div>

          {/* Profile Section */}
          <div className="p-8 flex flex-col items-center">
            <UserAvatar 
              user={user || {}} 
              size="xl" 
              className="mb-4"
            />
            
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            
            <p className="text-gray-600 flex items-center gap-2">
              <span>Full Time</span>
              <span>•</span>
              <span>{user?.department || 'Science Education'}</span>
              <span>•</span>
              <span>{user?.level || '600'} Level</span>
            </p>

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
