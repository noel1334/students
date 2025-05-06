
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, CreditCard, GraduationCap, User } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentInfo = {
    name: user?.user_metadata?.first_name || "Student",
    level: "600 Level",
    semester: "First Semester",
    year: "2024/25"
  };

  // Featured services cards
  const featuredServices = [
    {
      title: 'Course Registration',
      description: 'Register for your courses for the current semester',
      icon: <BookOpen size={24} className="text-blue-600" />,
      action: () => navigate('/courses'),
    },
    {
      title: 'Pay Tuition',
      description: 'Make payments for tuition and other fees',
      icon: <CreditCard size={24} className="text-green-600" />,
      action: () => navigate('/payments'),
    },
    {
      title: 'View Results',
      description: 'Check your academic performance and results',
      icon: <GraduationCap size={24} className="text-purple-600" />,
      action: () => navigate('/results'),
    },
    {
      title: 'Update Profile',
      description: 'Manage your personal information and settings',
      icon: <User size={24} className="text-orange-600" />,
      action: () => navigate('/profile'),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-[#1a4aa6] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {studentInfo.name}!</h1>
              <p className="mt-2">
                {studentInfo.level} • {studentInfo.semester} • {studentInfo.year}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="bg-white text-[#1a4aa6] hover:bg-blue-50"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Announcements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-yellow-800">Important Announcement</h2>
          <p className="text-yellow-700">
            Course registration for the First Semester 2024/25 academic session will close on June 15th, 2025.
            Please ensure you complete your registration before the deadline.
          </p>
        </div>
        
        {/* Featured Services */}
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {featuredServices.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={service.action}
            >
              <div className="flex items-center mb-3">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  {service.icon}
                </div>
                <h3 className="font-semibold">{service.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start pb-3 border-b">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Course Registration</p>
                <p className="text-sm text-gray-600">You've registered for 4 courses this semester</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start pb-3 border-b">
              <div className="bg-green-100 p-2 rounded-md mr-3">
                <CreditCard size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">Payment Confirmation</p>
                <p className="text-sm text-gray-600">Your tuition payment has been received</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-md mr-3">
                <GraduationCap size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Results Published</p>
                <p className="text-sm text-gray-600">Second semester results have been published</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Academic Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-xl font-bold mb-4">Academic Calendar</h2>
          <div className="space-y-4">
            <div className="flex justify-between pb-3 border-b">
              <div>
                <p className="font-medium">Course Registration Deadline</p>
                <p className="text-sm text-gray-600">Last day to register for courses</p>
              </div>
              <p className="text-sm font-semibold">June 15, 2025</p>
            </div>
            <div className="flex justify-between pb-3 border-b">
              <div>
                <p className="font-medium">Mid-Semester Break</p>
                <p className="text-sm text-gray-600">No classes during this period</p>
              </div>
              <p className="text-sm font-semibold">July 10-17, 2025</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Final Examinations</p>
                <p className="text-sm text-gray-600">Examination period begins</p>
              </div>
              <p className="text-sm font-semibold">August 25, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
