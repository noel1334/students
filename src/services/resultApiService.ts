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
export const getStudentResultHistory = async (): Promise<ApiResponse<ResultMinimal[]>> => {
  const response = await api.get('/results/student-history/me');
  return response.data;
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
