import api from '@/config/api'; 
import { ApiResponse } from './academicPeriodsApiService'; // Re-use the ApiResponse interface from common location

// Interface for a single registrable course item
export interface RegistrableCourse {
  id: number;
  code: string;
  title: string;
  creditUnit: number;
  courseType: 'CORE' | 'ELECTIVE'; 
  isElective: boolean; 
  preferredSemesterType: string | null; 
  
  // Prerequisite status from backend
  prerequisitesMet?: boolean;
  unmetPrerequisites?: { code: string; title: string; }[];
  prerequisiteList?: { id: number; code: string; title: string; }[];
  
  offeringReason?: string; // e.g., "Current Program Offering", "Carryover"
  programCourseId?: number | null; 
}

// Interface for the data section of the API response for registrable courses
export interface RegistrableCoursesResponseData {
  student: {
    id: number;
    name: string;
    regNo: string;
    level: string; 
    program: string;
  };
  targetSeason: {
    id: number;
    name: string; 
  };
  targetSemester: {
    id: number;
    name: string; 
    type: string; 
  };
  availableCourses: RegistrableCourse[];
}

// Interface for Level
export interface Level {
  id: number;
  name: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for course registration
export interface CourseRegistration {
  id: number;
  studentId: number;
  courseId: number;
  seasonId: number;
  semesterId: number;
  levelId: number;
  programCourseId?: number;
  registeredAt: string;
  course: {
    id: number;
    code: string;
    title: string;
    creditUnit: number;
  };
}

/**
 * Fetches courses a student is eligible to register for in a specific season and semester.
 * This function uses the comprehensive backend logic (including passed courses, carryovers, prerequisites).
 * @param seasonId The ID of the academic season.
 * @param semesterId The ID of the semester within that season.
 * @param levelId Optional level ID for filtering courses by level.
 * @returns A promise that resolves to an ApiResponse containing RegistrableCoursesResponseData.
 */
export const getRegistrableCourses = async (
  seasonId: number,
  semesterId: number,
  levelId?: number
): Promise<ApiResponse<RegistrableCoursesResponseData>> => {
  const params: any = {
    seasonId,
    semesterId,
  };
  
  if (levelId) {
    params.levelId = levelId;
  }
  
  const response = await api.get('/students/me/registrable-courses', {
    params,
  });
  return response.data;
};

/**
 * Fetches all levels from the backend.
 * @returns A promise that resolves to an ApiResponse containing an array of Level objects.
 */
export const getAllLevels = async (): Promise<ApiResponse<{ items: Level[] }>> => {
  const response = await api.get('/levels');
  return response.data;
};

/**
 * Register student for selected courses.
 * @param registrations Array of course registration data
 * @returns A promise that resolves to an ApiResponse.
 */
export const registerForCourses = async (registrations: {
  courseId: number;
  seasonId: number;
  semesterId: number;
  levelId: number;
  programCourseId?: number;
}[]): Promise<ApiResponse<any>> => {
  const response = await api.post('/student-registrations', {
    registrations,
  });
  return response.data;
};

/**
 * Get student's current course registrations.
 * @param seasonId The ID of the academic season.
 * @param semesterId The ID of the semester within that season.
 * @returns A promise that resolves to an ApiResponse containing registrations.
 */
export const getMyRegistrations = async (
  seasonId: number,
  semesterId: number
): Promise<ApiResponse<{ items: CourseRegistration[] }>> => {
  const response = await api.get('/student-registrations/me', { // Corrected endpoint here
    params: {
      seasonId,
      semesterId,
    },
  });
  console.log(response.data)
  return response.data;
};