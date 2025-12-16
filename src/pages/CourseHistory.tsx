// src/pages/CourseHistory.tsx

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, Download } from 'lucide-react';
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
import CourseFormDownloader from '@/components/courses/CourseFormDownloader';
import { CourseRegistration } from '@/services/courseApiService';

const CourseHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
  // Level filter explicitly removed

  // Fetch all registrations for the student
  const { data: allRegistrationsData, isLoading: registrationsLoading } = useQuery({
    queryKey: ['all-my-registrations', user?.id],
    queryFn: async () => {
      if (!user?.id) return { data: { items: [] } };
      // Assuming 'api' baseURL is 'http://localhost:3000/api/v1', so path is relative
      const response = await api.get('/student-registrations/me', {
        params: { limit: 1000 }
      });
      return response.data;
    },
    enabled: !!user?.id,
  });

  const allRegistrations: CourseRegistration[] = useMemo(() => {
    return Array.isArray(allRegistrationsData?.data?.items) ? allRegistrationsData.data.items : [];
  }, [allRegistrationsData]);

  // Dynamically generate unique seasons from registered courses
  const uniqueSeasons = useMemo(() => {
    const seasonMap = new Map<number, { id: number; name: string }>();
    allRegistrations.forEach(reg => {
      if (reg.season) {
        seasonMap.set(reg.season.id, reg.season);
      }
    });
    return Array.from(seasonMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allRegistrations]);

  // Dynamically generate unique semesters from registered courses, filtered by selected season
  const uniqueSemesters = useMemo(() => {
    const semesterMap = new Map<number, { id: number; name: string; areStudentEditsLocked?: boolean }>();
    allRegistrations.forEach(reg => {
      // Only include semesters if they belong to the selected season, or all if no season is selected
      if (reg.semester && (!selectedSeasonId || reg.season?.id === selectedSeasonId)) {
        semesterMap.set(reg.semester.id, reg.semester);
      }
    });
    return Array.from(semesterMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allRegistrations, selectedSeasonId]);

  // Compute counts per filter option
  const registrationCounts = useMemo(() => {
    const counts = {
      seasons: {} as Record<number, number>,
      semesters: {} as Record<number, number>,
    };
    
    allRegistrations.forEach((reg) => {
      if (reg.season?.id) {
        counts.seasons[reg.season.id] = (counts.seasons[reg.season.id] || 0) + 1;
      }
      // Count semesters based on the current context (selected season or all)
      if (reg.semester?.id && (!selectedSeasonId || reg.season?.id === selectedSeasonId)) {
        counts.semesters[reg.semester.id] = (counts.semesters[reg.semester.id] || 0) + 1;
      }
    });
    
    return counts;
  }, [allRegistrations, selectedSeasonId]);

  // Filter registrations based on selected filters
  const filteredRegistrations = useMemo(() => {
    return allRegistrations.filter(reg => {
      if (selectedSeasonId && reg.season?.id !== selectedSeasonId) return false;
      if (selectedSemesterId && reg.semester?.id !== selectedSemesterId) return false;
      return true;
    });
  }, [allRegistrations, selectedSeasonId, selectedSemesterId]);

  // Get selected period info for display
  const selectedSeason = uniqueSeasons.find((s: any) => s.id === selectedSeasonId);
  const selectedSemester = uniqueSemesters.find((s: any) => s.id === selectedSemesterId);

  const handleSeasonChange = (value: string) => {
    const id = value === 'all' ? null : parseInt(value);
    setSelectedSeasonId(id);
    setSelectedSemesterId(null); // IMPORTANT: Reset semester when season changes
  };

  const handleSemesterChange = (value: string) => {
    const id = value === 'all' ? null : parseInt(value);
    setSelectedSemesterId(id);
  };

  const totalCredits = filteredRegistrations.reduce((sum, reg) => sum + (reg.course.creditUnit || 0), 0);

  const isLoading = registrationsLoading;

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
                <p className="font-muted-foreground">Program</p>
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
                  value={selectedSeasonId?.toString() || 'all'} 
                  onValueChange={handleSeasonChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Seasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="flex items-center justify-between w-full gap-2">
                        All Seasons
                        {allRegistrations.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                            {allRegistrations.length}
                          </Badge>
                        )}
                      </span>
                    </SelectItem>
                    {uniqueSeasons.map((season: any) => {
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
                  value={selectedSemesterId?.toString() || 'all'} 
                  onValueChange={handleSemesterChange}
                  // Disabled if no season is selected OR if there are no unique semesters for the selected season
                  disabled={selectedSeasonId === null ? false : uniqueSemesters.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="flex items-center justify-between w-full gap-2">
                        All Semesters
                        {/* Show count for the selected season's registrations, or all registrations if no season is selected */}
                        {selectedSeasonId !== null ? (
                          registrationCounts.seasons[selectedSeasonId] > 0 && (
                             <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                                {registrationCounts.seasons[selectedSeasonId]}
                             </Badge>
                          )
                        ) : (
                          allRegistrations.length > 0 && (
                             <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                                {allRegistrations.length}
                             </Badge>
                          )
                        )}
                      </span>
                    </SelectItem>
                    {uniqueSemesters.map((semester: any) => {
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

              {/* Removed Level filter as per request */}
            </div>

          </CardContent>
        </Card>

        {/* Period Display & Download Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          {(selectedSeason || selectedSemester) && (
            <div className="text-sm text-muted-foreground">
              Showing: {selectedSeason?.name || 'All Seasons'} - {selectedSemester?.name || 'All Semesters'}
            </div>
          )}
          
          {/* Download Button - Only show when specific season AND semester are selected */}
          {selectedSeasonId && selectedSemesterId && filteredRegistrations.length > 0 && (
            <CourseFormDownloader registrations={filteredRegistrations}>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download Registration Form
              </Button>
            </CourseFormDownloader>
          )}
        </div>

        {/* Registered Courses Table - Desktop View */}
        <Card className="hidden sm:block">
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

        {/* Registered Courses - Mobile Card View */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Registered Courses ({filteredRegistrations.length})
            </h2>
            <Badge variant="outline">Total: {totalCredits} Units</Badge>
          </div>
          
          {filteredRegistrations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {allRegistrations.length === 0 
                  ? "No course registrations found."
                  : "No courses found for the selected filters."}
              </CardContent>
            </Card>
          ) : (
            filteredRegistrations.map((reg) => {
              const isLocked = reg.semester?.areStudentEditsLocked || reg.isScoreRecorded;
              return (
                <Card key={reg.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{reg.course.code}</p>
                        <p className="text-sm text-muted-foreground">{reg.course.title}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Units: </span>
                        <span className="font-medium">{reg.course.creditUnit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Level: </span>
                        <span className="font-medium">{reg.level?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Semester: </span>
                        <span className="font-medium">{reg.semester?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Season: </span>
                        <span className="font-medium">{reg.season?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                        Registered
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseHistory;