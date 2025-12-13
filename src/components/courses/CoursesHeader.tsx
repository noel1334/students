import React from 'react';

interface CoursesHeaderProps {
  selectedSeason?: { name: string };
  selectedSemester?: { name: string };
  selectedLevel?: { name: string };
  userCurrentSeasonName?: string;
  userCurrentSemesterName?: string;
  userCurrentLevelName?: string;
  isViewingRegistrations?: boolean;
  registrationSeason?: string;
  registrationSemester?: string;
  registrationLevel?: string;
}

const CoursesHeader = ({
  selectedSeason,
  selectedSemester,
  selectedLevel,
  userCurrentSeasonName,
  userCurrentSemesterName,
  userCurrentLevelName,
  isViewingRegistrations,
  registrationSeason,
  registrationSemester,
  registrationLevel
}: CoursesHeaderProps) => {
  // When viewing registrations, show the registration period info
  const displaySeason = isViewingRegistrations && registrationSeason 
    ? registrationSeason 
    : (selectedSeason?.name || userCurrentSeasonName || 'No Season Selected');
  
  const displaySemester = isViewingRegistrations && registrationSemester 
    ? registrationSemester 
    : (selectedSemester?.name || userCurrentSemesterName || 'No Semester Selected');
  
  const displayLevel = isViewingRegistrations && registrationLevel 
    ? registrationLevel 
    : (selectedLevel?.name || userCurrentLevelName || 'No Level Selected');

  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold mb-1">Courses</h1>
      <div className="text-sm text-muted-foreground">
        <p>{displaySeason}</p>
        <p className="font-medium text-foreground">{displayLevel}</p>
        <p>{displaySemester}</p>
      </div>
    </div>
  );
};

export default CoursesHeader;
