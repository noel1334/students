// src/pages/CourseHistory.tsx

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { getAllSeasons, getAllSemesters, getAllLevels } from '@/services/academicPeriodsApiService';

interface CourseRegistration {
  id: number;
  course: {
    id: number;
    code: string;
    title: string;
    creditUnit: number;
    courseType?: string;
  };
  level: {
    id: number;
    name: string;
  };
  season: {
    id: number;
    name: string;
  };
  semester: {
    id: number;
    name: string;
    areStudentEditsLocked?: boolean;
  };
  registeredAt: string;
  isScoreRecorded?: boolean;
}

const CourseHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  // Fetch all registrations for the student
  const { data: allRegistrationsData, isLoading: registrationsLoading } = useQuery({
    queryKey: ['all-my-registrations'],
    queryFn: async () => {
      const response = await api.get('/student-registrations/me', {
        params: { limit: 1000 }
      });
      return response.data;
    },
  });

  // Fetch filter options
  const { data: allSeasonsData, isLoading: seasonsLoading } = useQuery({
    queryKey: ['allSeasons'],
    queryFn: getAllSeasons,
  });

  const { data: allSemestersData, isLoading: semestersLoading } = useQuery({
    queryKey: ['allSemesters', selectedSeasonId],
    queryFn: () => getAllSemesters(selectedSeasonId || undefined),
    enabled: !!selectedSeasonId
  });

  const { data: allLevelsData, isLoading: levelsLoading } = useQuery({
    queryKey: ['allLevels'],
    queryFn: getAllLevels,
  });

  const allRegistrations: CourseRegistration[] = useMemo(() => {
    return Array.isArray(allRegistrationsData?.data?.items) ? allRegistrationsData.data.items : [];
  }, [allRegistrationsData]);

  const seasons = Array.isArray(allSeasonsData?.data?.seasons) ? allSeasonsData.data.seasons : [];
  const semesters = Array.isArray(allSemestersData?.data?.semesters) ? allSemestersData.data.semesters : [];
  const levels = Array.isArray(allLevelsData?.data?.items) 
    ? allLevelsData.data.items 
    : Array.isArray(allLevelsData?.data?.levels) 
      ? allLevelsData.data.levels 
      : [];

  // Compute counts per filter option
  const registrationCounts = useMemo(() => {
    const counts = {
      seasons: {} as Record<number, number>,
      semesters: {} as Record<number, number>,
      levels: {} as Record<number, number>,
    };
    
    allRegistrations.forEach((reg) => {
      if (reg.season?.id) {
        counts.seasons[reg.season.id] = (counts.seasons[reg.season.id] || 0) + 1;
      }
      if (reg.semester?.id) {
        counts.semesters[reg.semester.id] = (counts.semesters[reg.semester.id] || 0) + 1;
      }
      if (reg.level?.id) {
        counts.levels[reg.level.id] = (counts.levels[reg.level.id] || 0) + 1;
      }
    });
    
    return counts;
  }, [allRegistrations]);

  // Filter registrations based on selected filters
  const filteredRegistrations = useMemo(() => {
    return allRegistrations.filter(reg => {
      if (selectedSeasonId && reg.season?.id !== selectedSeasonId) return false;
      if (selectedSemesterId && reg.semester?.id !== selectedSemesterId) return false;
      if (selectedLevelId && reg.level?.id !== selectedLevelId) return false;
      return true;
    });
  }, [allRegistrations, selectedSeasonId, selectedSemesterId, selectedLevelId]);

  // Get unique period info for display
  const selectedSeason = seasons.find((s: any) => s.id === selectedSeasonId);
  const selectedSemester = semesters.find((s: any) => s.id === selectedSemesterId);
  const selectedLevel = levels.find((l: any) => l.id === selectedLevelId);

  const handleSeasonChange = (seasonId: number) => {
    setSelectedSeasonId(seasonId);
    setSelectedSemesterId(null);
  };

  const totalCredits = filteredRegistrations.reduce((sum, reg) => sum + (reg.course.creditUnit || 0), 0);

  const isLoading = registrationsLoading || seasonsLoading || levelsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">Loading course history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/courses')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Course Registration History</h1>
            <p className="text-sm text-muted-foreground">
              View all your registered courses across semesters
            </p>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Registration Number</p>
                <p className="font-medium">{user?.regNo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Student Name</p>
                <p className="font-medium">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{user?.departmentName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Program</p>
                <p className="font-medium">{user?.programName || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium mb-1.5">Season</label>
                <Select 
                  value={selectedSeasonId?.toString() || ''} 
                  onValueChange={(value) => handleSeasonChange(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Seasons" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season: any) => {
                      const count = registrationCounts.seasons[season.id] || 0;
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
                  onValueChange={(value) => setSelectedSemesterId(parseInt(value))}
                  disabled={!selectedSeasonId || semestersLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester: any) => {
                      const count = registrationCounts.semesters[semester.id] || 0;
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
                  onValueChange={(value) => setSelectedLevelId(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level: any) => {
                      const count = registrationCounts.levels[level.id] || 0;
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

          </CardContent>
        </Card>

        {/* Period Display */}
        {(selectedSeason || selectedSemester || selectedLevel) && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing: {selectedSeason?.name || 'All Seasons'} - {selectedSemester?.name || 'All Semesters'} - {selectedLevel?.name || 'All Levels'}
          </div>
        )}

        {/* Registered Courses Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Registered Courses ({filteredRegistrations.length})
              </CardTitle>
              <Badge variant="outline">Total Credits: {totalCredits}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {allRegistrations.length === 0 
                  ? "No course registrations found."
                  : "No courses found for the selected filters."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead className="text-center">Units</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Date Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((reg) => {
                      const isLocked = reg.semester?.areStudentEditsLocked || reg.isScoreRecorded;
                      return (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">{reg.course.code}</TableCell>
                          <TableCell>{reg.course.title}</TableCell>
                          <TableCell className="text-center">{reg.course.creditUnit}</TableCell>
                          <TableCell>{reg.level?.name}</TableCell>
                          <TableCell>{reg.semester?.name}</TableCell>
                          <TableCell>{reg.season?.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isLocked ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Unlock className="h-4 w-4 text-green-500" />
                              )}
                              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                Registered
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(reg.registeredAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseHistory;
