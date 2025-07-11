// src/services/courseApiService.ts

import api from '@/config/api'; // Assuming '@/config/api' points to your axios instance

// Interface for a single registrable course item
export interface RegistrableCourse {
  id: number;
  code: string;
  title: string;
  creditUnit: number;
  courseType: 'CORE' | 'ELECTIVE'; // Based on your backend CourseType enum
  isElective: boolean; // From ProgramCourse mapping
  preferredSemesterType: string | null; // From Course model
  
  // Prerequisite status from backend
  prerequisitesMet?: boolean;
  unmetPrerequisites?: { code: string; title: string; }[];
  prerequisiteList?: { id: number; code: string; title: string; }[];
  
  offeringReason?: string; // e.g., "Current Program Offering", "Carryover"
  programCourseId?: number | null; // ID of the ProgramCourse mapping, if applicable
}

// Interface for the data section of the API response for registrable courses
export interface RegistrableCoursesResponseData {
  student: {
    id: number;
    name: string;
    regNo: string;
    level: string; // e.g., "100 Level"
    program: string;
  };
  targetSeason: {
    id: number;
    name: string; // e.g., "2024/2025 Academic Session"
  };
  targetSemester: {
    id: number;
    name: string; // e.g., "First Semester"
    type: string; // e.g., "FIRST"
  };
  availableCourses: RegistrableCourse[];
}

// Re-using your existing ApiResponse interface
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

/**
 * Fetches courses a student is eligible to register for in a specific season and semester.
 * This function uses the comprehensive backend logic (including passed courses, carryovers, prerequisites).
 * @param seasonId The ID of the academic season.
 * @param semesterId The ID of the semester within that season.
 * @returns A promise that resolves to an ApiResponse containing RegistrableCoursesResponseData.
 */
export const getRegistrableCourses = async (
  seasonId: number,
  semesterId: number
): Promise<ApiResponse<RegistrableCoursesResponseData>> => {
  const response = await api.get('/students/me/registrable-courses', {
    params: {
      seasonId,
      semesterId,
    },
  });
  return response.data;
};

// You can add other course-related API calls here if needed, e.g., for `getMyProgramCurriculumCourses`
// export const getProgramCurriculumCourses = async (
//   seasonId: number,
//   semesterId: number,
//   levelId?: number
// ): Promise<ApiResponse<ProgramCurriculumResponseData>> => {
//   const response = await api.get('/students/me/program-curriculum-courses', {
//     params: {
//       seasonId,
//       semesterId,
//       levelId,
//     },
//   });
//   return response.data;
// };