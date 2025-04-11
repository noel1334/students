
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, CreditCard, GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const studentInfo = {
    name: "Victor",
    level: "600 Level",
    semester: "First Semester",
    cgpa: "3.77",
    registeredCourses: 0,
    year: "2024/25"
  };

  return (
    <>
      <DashboardHeader />
      
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="md:hidden flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-600">{studentInfo.year}</p>
              <h2 className="text-xl font-bold">{studentInfo.level} LEVEL</h2>
              <p className="text-gray-600">{studentInfo.semester}</p>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Hi {studentInfo.name},</h2>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>
          
          {/* Overview Section */}
          <h3 className="text-lg font-semibold mb-3">Overview</h3>
          
          {/* Registered Courses Card */}
          <div className="bg-[#1a4aa6] text-white rounded-lg p-5 mb-5">
            <div className="flex items-start">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-white/80 mb-1">Registered Courses</p>
                <h3 className="text-3xl font-bold">{studentInfo.registeredCourses}</h3>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="text-blue-800 mr-2">
                  <BookOpen size={20} />
                </div>
                <p className="text-blue-800">Level</p>
              </div>
              <h4 className="text-xl font-semibold">{studentInfo.level}</h4>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="text-blue-800 mr-2">
                  <BookOpen size={20} />
                </div>
                <p className="text-blue-800">Semester</p>
              </div>
              <h4 className="text-xl font-semibold">{studentInfo.semester}</h4>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="text-blue-800 mr-2">
                  <GraduationCap size={20} />
                </div>
                <p className="text-blue-800">CGPA</p>
              </div>
              <h4 className="text-xl font-semibold">{studentInfo.cgpa}</h4>
            </div>
          </div>
          
          {/* Quick Links */}
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          
          <div className="space-y-3">
            <Link to="/payments" className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="text-blue-500 font-medium">Payments history</div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
            
            <Link to="/courses" className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="text-blue-500 font-medium">Courses</div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
            
            <Link to="/results" className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="text-blue-500 font-medium">Results</div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
