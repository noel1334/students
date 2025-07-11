import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, BookOpen, Clock, Users, Calendar, GraduationCap, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllCourses, Course } from '@/services/courseApiService';
import { getAllSeasons, getAllSemesters, Season, Semester } from '@/services/academicPeriodsApiService';

const Courses = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // State for courses and filters
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCourseType, setSelectedCourseType] = useState<string>('');
  
  // Data for select options
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [levels, setLevels] = useState<{ id: string; name: string; value: number }[]>([]);
  const [courseTypes] = useState([
    { id: 'CORE', name: 'Core' },
    { id: 'ELECTIVE', name: 'Elective' },
    { id: 'GENERAL', name: 'General Studies' }
  ]);

  // Selected course for details
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Set default values from user context
  useEffect(() => {
    if (user && !authLoading) {
      console.log('Setting default values from user:', user);
      
      if (user.currentSeasonId) {
        setSelectedSeason(user.currentSeasonId);
      }
      if (user.currentSemesterId) {
        setSelectedSemester(user.currentSemesterId);
      }
      if (user.currentLevelId) {
        setSelectedLevel(user.currentLevelId);
      }
    }
  }, [user, authLoading]);

  // Fetch seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        console.log('Fetching seasons...');
        const response = await getAllSeasons();
        console.log('Seasons response:', response);
        
        if (response.status === 'success' && response.data?.items) {
          setSeasons(response.data.items);
        } else {
          console.warn('No seasons data found in response');
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
        toast({
          title: "Error",
          description: "Failed to load academic seasons",
          variant: "destructive",
        });
      }
    };

    fetchSeasons();
  }, [toast]);

  // Fetch semesters when season changes
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!selectedSeason) {
        setSemesters([]);
        return;
      }

      try {
        console.log('Fetching semesters for season:', selectedSeason);
        const response = await getAllSemesters(parseInt(selectedSeason));
        console.log('Semesters response:', response);
        
        if (response.status === 'success' && response.data?.items) {
          setSemesters(response.data.items);
        } else {
          console.warn('No semesters data found in response');
          setSemesters([]);
        }
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setSemesters([]);
        toast({
          title: "Error",
          description: "Failed to load semesters",
          variant: "destructive",
        });
      }
    };

    fetchSemesters();
  }, [selectedSeason, toast]);

  // Generate levels (100, 200, 300, 400, 500)
  useEffect(() => {
    const generatedLevels = [
      { id: '100', name: '100 Level', value: 100 },
      { id: '200', name: '200 Level', value: 200 },
      { id: '300', name: '300 Level', value: 300 },
      { id: '400', name: '400 Level', value: 400 },
      { id: '500', name: '500 Level', value: 500 },
    ];
    setLevels(generatedLevels);
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedSeason || !selectedSemester || !selectedLevel) {
        console.log('Missing required filters for course fetch:', {
          selectedSeason,
          selectedSemester,
          selectedLevel
        });
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching courses with filters:', {
          seasonId: parseInt(selectedSeason),
          semesterId: parseInt(selectedSemester),
          levelId: parseInt(selectedLevel)
        });

        const response = await getAllCourses({
          seasonId: parseInt(selectedSeason),
          semesterId: parseInt(selectedSemester),
          levelId: parseInt(selectedLevel)
        });

        console.log('Courses response:', response);

        if (response.status === 'success' && response.data?.items) {
          setCourses(response.data.items);
          setFilteredCourses(response.data.items);
        } else {
          console.warn('No courses data found in response');
          setCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedSeason, selectedSemester, selectedLevel, toast]);

  // Filter courses based on search and course type
  useEffect(() => {
    let filtered = [...courses];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by course type
    if (selectedCourseType) {
      filtered = filtered.filter(course => course.type === selectedCourseType);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCourseType]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCourseType('');
    // Keep the season, semester, and level as they are required
  };

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case 'CORE':
        return 'bg-blue-100 text-blue-800';
      case 'ELECTIVE':
        return 'bg-green-100 text-green-800';
      case 'GENERAL':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4aa6] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Browse and explore your academic courses</p>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-[#1a4aa6]" />
          <span className="text-sm text-gray-500">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter courses by academic period and course type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="season">Academic Session</Label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic session" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.length > 0 ? (
                    seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id.toString()}>
                        {season.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-seasons" disabled>
                      No sessions available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.length > 0 ? (
                    semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id.toString()}>
                        {semester.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-semesters" disabled>
                      {selectedSeason ? "No semesters available" : "Select session first"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Secondary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Courses</Label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by course name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type</Label>
              <Select value={selectedCourseType} onValueChange={setSelectedCourseType}>
                <SelectTrigger>
                  <SelectValue placeholder="All course types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {courseTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={handleClearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4aa6] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              {courses.length === 0
                ? "No courses available for the selected filters."
                : "Try adjusting your search terms or filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="font-mono text-sm mt-1">
                      {course.code}
                    </CardDescription>
                  </div>
                  <Badge className={`ml-2 ${getCourseTypeColor(course.type || '')}`}>
                    {course.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{course.creditUnits || 0} Credits</span>
                  </div>
                  {course.maxStudents && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Max {course.maxStudents}</span>
                    </div>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedCourse(course)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>{selectedCourse?.title}</span>
                        <Badge className={getCourseTypeColor(selectedCourse?.type || '')}>
                          {selectedCourse?.type}
                        </Badge>
                      </DialogTitle>
                      <DialogDescription className="font-mono">
                        {selectedCourse?.code}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-gray-600">
                          {selectedCourse?.description || 'No description available'}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Course Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Credit Units:</span>
                              <span>{selectedCourse?.creditUnits || 0}</span>
                            </div>
                            {selectedCourse?.maxStudents && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Max Students:</span>
                                <span>{selectedCourse.maxStudents}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge variant={selectedCourse?.isActive ? 'default' : 'secondary'}>
                                {selectedCourse?.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Academic Period</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Level:</span>
                              <span>{selectedCourse?.level?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Semester:</span>
                              <span>{selectedCourse?.semester?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Session:</span>
                              <span>{selectedCourse?.season?.name || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedCourse?.prerequisites && selectedCourse.prerequisites.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2">Prerequisites</h4>
                            <div className="space-y-1">
                              {selectedCourse.prerequisites.map((prereq, index) => (
                                <Badge key={index} variant="outline" className="mr-2">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
