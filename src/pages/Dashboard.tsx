
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, CreditCard, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Extract real data from user with fallbacks
  const studentInfo = {
    name: user?.name?.split(' ')[0] || user?.email?.split('@')[0] || "Student",
    level: user?.currentLevelName || "N/A Level",
    semester: user?.currentSemesterName || "N/A Semester",
    cgpa: "3.77", // This would come from API when available
    registeredCourses: 0, // This would come from API when available
    year: user?.currentSeasonName || "N/A Session"
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-primary/20">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Hi {studentInfo.name},</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome to your dashboard</p>
        </div>
        
        {/* Overview Section */}
        <h3 className="text-lg font-semibold mb-4 text-foreground">Overview</h3>
        
        {/* Registered Courses Card */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start">
            <div className="bg-card/20 p-3 rounded-lg mr-4">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-primary-foreground/80 mb-1">Registered Courses</p>
              <h3 className="text-4xl font-bold">{studentInfo.registeredCourses}</h3>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="text-primary mr-2">
                <BookOpen size={20} />
              </div>
              <p className="text-muted-foreground">Level</p>
            </div>
            <h4 className="text-2xl font-semibold text-foreground">{studentInfo.level}</h4>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="text-primary mr-2">
                <BookOpen size={20} />
              </div>
              <p className="text-muted-foreground">Semester</p>
            </div>
            <h4 className="text-2xl font-semibold text-foreground">{studentInfo.semester}</h4>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="text-primary mr-2">
                <GraduationCap size={20} />
              </div>
              <p className="text-muted-foreground">CGPA</p>
            </div>
            <h4 className="text-2xl font-semibold text-foreground">{studentInfo.cgpa}</h4>
          </div>
        </div>
        
        {/* Quick Links */}
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
        
        <div className="space-y-3">
          <Link to="/payments" className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:bg-accent transition-colors">
            <div className="text-primary font-medium">Payments history</div>
            <ChevronRight className="text-muted-foreground" size={20} />
          </Link>
          
          <Link to="/courses" className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:bg-accent transition-colors">
            <div className="text-primary font-medium">Courses</div>
            <ChevronRight className="text-muted-foreground" size={20} />
          </Link>
          
          <Link to="/results" className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:bg-accent transition-colors">
            <div className="text-primary font-medium">Results</div>
            <ChevronRight className="text-muted-foreground" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
