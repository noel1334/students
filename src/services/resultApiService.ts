import api from '@/config/api';

export interface CourseScore {
  courseCode: string;
  courseTitle: string;
  credit: number;
  CA: number;
  exam: number;
  total: number;
  grade: string;
  gradePoint: number;
  weightedPoint: number;
  status: string;
}

export interface ResultDetail {
  id: number;
  gpa: number;
  cgpa: number;
  cuAttempted: number;
  cuPassed: number;
  cuTotal: number;
  remarks: string;
  isApprovedForStudentRelease: boolean;
  studentReleaseApprovedAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    regNo: string;
    name: string;
    departmentId: number;
    programId: number;
    currentLevelId: number;
  };
  semester: {
    id: number;
    name: string;
    type: string;
    semesterNumber: number;
  };
  season: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  } | null;
  program: {
    id: number;
    name: string;
  } | null;
  level: {
    id: number;
    name: string;
  } | null;
  courseScores: CourseScore[];
}

export interface ResultMinimal {
  id: number;
  seasonId: number;
  semesterId: number;
  seasonName: string;
  semesterName: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Fetch minimal result history for dropdowns
// For students, this will automatically filter to their own results
export const getStudentResultHistory = async (): Promise<ApiResponse<ResultMinimal[]>> => {
  // Use the main /results endpoint which auto-filters for students
  const response = await api.get('/results', { 
    params: { 
      page: 1, 
      limit: 100 // Get all results
    } 
  });
  
  // Transform the full results data to minimal format for dropdowns
  if (response.data?.status === 'success' && response.data?.data?.results) {
    const minimal: ResultMinimal[] = response.data.data.results.map((result: ResultDetail) => ({
      id: result.id,
      seasonId: result.season.id,
      semesterId: result.semester.id,
      seasonName: result.season.name,
      semesterName: result.semester.name,
    }));
    
    return {
      status: 'success',
      data: minimal
    };
  }
  
  return {
    status: 'success',
    data: []
  };
};

// Fetch specific result by ID
export const getResultById = async (resultId: number): Promise<ApiResponse<ResultDetail>> => {
  const response = await api.get(`/results/${resultId}`);
  return response.data;
};

// Fetch all results with optional filters
export const getAllResults = async (params?: {
  seasonId?: number;
  semesterId?: number;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{
  results: ResultDetail[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
}>> => {
  const response = await api.get('/results', { params });
  return response.data;
};
