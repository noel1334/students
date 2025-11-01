
import React from 'react';

interface CoursesHeaderProps {
  selectedSeason?: { name: string };
  selectedSemester?: { name: string };
  selectedLevel?: { name: string };
  userCurrentSeasonName?: string;
  userCurrentSemesterName?: string;
  userCurrentLevelName?: string;
}

const CoursesHeader = ({
  selectedSeason,
  selectedSemester,
  selectedLevel,
  userCurrentSeasonName,
  userCurrentSemesterName,
  userCurrentLevelName
}: CoursesHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold mb-1">Courses</h1>
      <div className="text-sm text-muted-foreground">
        <p>{selectedSeason?.name || userCurrentSeasonName || 'No Season Selected'}</p>
        <p className="font-medium text-foreground">{selectedLevel?.name || userCurrentLevelName || 'No Level Selected'}</p>
        <p>{selectedSemester?.name || userCurrentSemesterName || 'No Semester Selected'}</p>
      </div>
    </div>
  );
};

export default CoursesHeader;
