
import React from 'react';
import { User, Edit } from 'lucide-react';

type StudentData = {
  name: string;
  regNo: string;
  department: string;
  program: string;
  level: string;
  avatar?: string;
};

const ProfileCard = () => {
  // This would come from an API in a real application
  const studentData: StudentData = {
    name: "John Doe",
    regNo: "SIT/2020/001",
    department: "Computer Science",
    program: "B.Sc Software Engineering",
    level: "300 Level",
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <button className="text-primary hover:text-primary/80">
          <Edit size={18} />
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="bg-primary/10 text-primary rounded-full w-20 h-20 flex items-center justify-center text-2xl font-medium">
          {studentData.avatar ? (
            <img 
              src={studentData.avatar} 
              alt={studentData.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={32} />
          )}
        </div>
        
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">{studentData.name}</h3>
          <p className="text-muted-foreground text-sm">{studentData.regNo}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <div className="px-3 py-1 bg-secondary rounded text-sm">
              <span className="block font-medium">{studentData.department}</span>
            </div>
            <div className="px-3 py-1 bg-secondary rounded text-sm">
              <span className="block font-medium">{studentData.program}</span>
            </div>
            <div className="px-3 py-1 bg-secondary rounded text-sm">
              <span className="block font-medium">{studentData.level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
