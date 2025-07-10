
import api from '@/config/api';

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  isElective?: boolean;
  isCarryOver?: boolean;
  instructor?: string;
  schedule?: string;
  description?: string;
}

export interface CourseRegistration {
  id: string;
  courseId: string;
  studentId: string;
  sessionId: string;
  semesterId: string;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Semester {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
}

export interface Level {
  id: string;
  name: string;
  value: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Get all seasons
export const getAllSeasons = async (): Promise<ApiResponse<{ seasons: Season[] }>> => {
  const response = await api.get('/seasons');
  return response.data;
};

// Get all semesters
export const getAllSemesters = async (): Promise<ApiResponse<{ semesters: Semester[] }>> => {
  const response = await api.get('/semesters');
  return response.data;
};

// Get all levels
export const getAllLevels = async (): Promise<ApiResponse<{ levels: Level[] }>> => {
  const response = await api.get('/levels');
  return response.data;
};

// Get registrable courses for the current student with required parameters
export const getMyRegistrableCourses = async (seasonId: string, semesterId: string, levelId?: string): Promise<ApiResponse<{ courses: Course[] }>> => {
  const params = new URLSearchParams({
    seasonId,
    semesterId,
    ...(levelId && { levelId })
  });
  
  const response = await api.get(`/students/me/registrable-courses?${params.toString()}`);
  return response.data;
};

// Register for courses
export const registerForCourses = async (courseIds: string[]): Promise<ApiResponse<{ registrations: CourseRegistration[] }>> => {
  const response = await api.post('/student-course-registrations', {
    courseIds
  });
  return response.data;
};

// Get my course registrations
export const getMyRegistrations = async (): Promise<ApiResponse<{ registrations: CourseRegistration[] }>> => {
  const response = await api.get('/student-course-registrations');
  return response.data;
};
