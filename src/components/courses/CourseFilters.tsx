
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  semestersLoading
}: CourseFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Season</label>
        <Select 
          value={selectedSeasonId?.toString() || ''} 
          onValueChange={(value) => onSeasonChange(parseInt(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map(season => (
              <SelectItem key={season.id} value={season.id.toString()}>
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Semester</label>
        <Select 
          value={selectedSemesterId?.toString() || ''} 
          onValueChange={(value) => onSemesterChange(parseInt(value))}
          disabled={!selectedSeasonId || semestersLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map(semester => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Level</label>
        <Select 
          value={selectedLevelId?.toString() || ''} 
          onValueChange={(value) => onLevelChange(parseInt(value))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map(level => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CourseFilters;
