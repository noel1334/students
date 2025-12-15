import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Season {
  id: number;
  name: string;
}

interface Semester {
  id: number;
  name: string;
}

interface Level {
  id: number;
  name: string;
}

interface RegistrationCounts {
  seasons: Record<number, number>;
  semesters: Record<number, number>;
  levels: Record<number, number>;
}

interface CourseFiltersProps {
  seasons: Season[];
  semesters: Semester[];
  levels: Level[];
  selectedSeasonId: number | null;
  selectedSemesterId: number | null;
  selectedLevelId: number | null;
  onSeasonChange: (seasonId: number) => void;
  onSemesterChange: (semesterId: number) => void;
  onLevelChange: (levelId: number) => void;
  semestersLoading: boolean;
  registrationCounts?: RegistrationCounts;
}

const CourseFilters = ({
  seasons,
  semesters,
  levels,
  selectedSeasonId,
  selectedSemesterId,
  selectedLevelId,
  onSeasonChange,
  onSemesterChange,
  onLevelChange,
  semestersLoading,
  registrationCounts
}: CourseFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium mb-1.5">Season</label>
        <Select 
          value={selectedSeasonId?.toString() || ''} 
          onValueChange={(value) => onSeasonChange(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map(season => {
              const count = registrationCounts?.seasons[season.id] || 0;
              return (
                <SelectItem key={season.id} value={season.id.toString()}>
                  <span className="flex items-center justify-between w-full gap-2">
                    {season.name}
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                        {count}
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium mb-1.5">Semester</label>
        <Select 
          value={selectedSemesterId?.toString() || ''} 
          onValueChange={(value) => onSemesterChange(parseInt(value))}
          disabled={!selectedSeasonId || semestersLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map(semester => {
              const count = registrationCounts?.semesters[semester.id] || 0;
              return (
                <SelectItem key={semester.id} value={semester.id.toString()}>
                  <span className="flex items-center justify-between w-full gap-2">
                    {semester.name}
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                        {count}
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium mb-1.5">Level</label>
        <Select 
          value={selectedLevelId?.toString() || ''} 
          onValueChange={(value) => onLevelChange(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map(level => {
              const count = registrationCounts?.levels[level.id] || 0;
              return (
                <SelectItem key={level.id} value={level.id.toString()}>
                  <span className="flex items-center justify-between w-full gap-2">
                    {level.name}
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                        {count}
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CourseFilters;
