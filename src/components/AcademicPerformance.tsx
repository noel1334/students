
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type SemesterResult = {
  semester: string;
  gpa: number;
  maxGpa: number;
};

const AcademicPerformance = () => {
  // This would come from an API in a real application
  const semesterResults: SemesterResult[] = [
    { semester: '1st', gpa: 3.7, maxGpa: 5.0 },
    { semester: '2nd', gpa: 4.0, maxGpa: 5.0 },
    { semester: '3rd', gpa: 3.5, maxGpa: 5.0 },
    { semester: '4th', gpa: 3.8, maxGpa: 5.0 },
    { semester: '5th', gpa: 4.2, maxGpa: 5.0 },
  ];

  // Calculate CGPA
  const cgpa = semesterResults.reduce((sum, sem) => sum + sem.gpa, 0) / semesterResults.length;

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Academic Performance</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-primary text-white rounded-md">
            <span className="font-medium">CGPA: {cgpa.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={semesterResults}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 5]} />
            <Tooltip 
              formatter={(value) => [`${value} / 5.0`, 'GPA']}
              labelFormatter={(label) => `${label} Semester`}
            />
            <Bar 
              dataKey="gpa" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
              name="GPA"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
        {semesterResults.map((result, index) => (
          <div key={index} className="text-center p-2 border border-border rounded-md">
            <span className="block text-sm text-muted-foreground">{result.semester} Semester</span>
            <span className="text-lg font-bold">{result.gpa.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">/5.0</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicPerformance;
