
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

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Get registrable courses for the current student
export const getMyRegistrableCourses = async (): Promise<ApiResponse<{ courses: Course[] }>> => {
  const response = await api.get('/students/me/registrable-courses');
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
