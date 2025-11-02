
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type SemesterResult = {
  semester: string;
  gpa: number;
  maxGpa: number;
};

interface AcademicPerformanceProps {
  semesterResults?: SemesterResult[];
  cgpa?: number;
}

const AcademicPerformance = ({ semesterResults = [], cgpa }: AcademicPerformanceProps) => {
  // If no data provided, show a message
  if (semesterResults.length === 0) {
    return (
      <div className="dashboard-card">
        <h2 className="text-lg font-semibold mb-4">Academic Performance</h2>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>No academic performance data available yet.</p>
        </div>
      </div>
    );
  }

  // Calculate CGPA if not provided
  const displayCgpa = cgpa ?? (semesterResults.reduce((sum, sem) => sum + sem.gpa, 0) / semesterResults.length);

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Academic Performance</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
            <span className="font-medium">CGPA: {displayCgpa.toFixed(2)}</span>
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
