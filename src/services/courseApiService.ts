// src/services/courseApiService.ts

import api from '@/config/api';

// Define a common ApiResponse interface if it's not global
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Interface for Level
export interface Level {
  id: number;
  name: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for Season (re-defined if not imported from academicPeriodsApiService)
export interface Season {
  id: number;
  name: string;
  // Add other properties if needed
}

// Interface for Semester (re-defined if not imported from academicPeriodsApiService)
export interface Semester {
  id: number;
  name: string;
  type: string;
  areStudentEditsLocked: boolean; // Crucial for delete logic
  // Add other properties if needed
}

// Interface for a single registrable course item
export interface RegistrableCourse {
  id: number;
  code: string;
  title: string;
  creditUnit: number;
  courseType: 'CORE' | 'ELECTIVE';
  isElective: boolean;
  preferredSemesterType: string | null; // ADDED: Now included from backend for courses
  // Prerequisite status from backend
  prerequisitesMet?: boolean;
  unmetPrerequisites?: { code: string; title: string; }[];
  prerequisiteList?: { id: number; code: string; title: string; }[];

  offeringReason?: string; // e.g., "Current Program Offering", "Carryover"
  programCourseId?: number | null; // This is on RegistrableCourse from getRegistrableCourses API
}


// Interface for course registration (from getMyRegistrations)
export interface CourseRegistration {
  id: number;
  studentId: number;
  courseId: number;
  seasonId: number;
  semesterId: number;
  levelId: number;
  // programCourseId?: number; // Removed as it's not on the Prisma model for StudentCourseRegistration
  registeredAt: string;
  isScoreRecorded: boolean; // Crucial for delete logic
  course: { // UPDATED: Include new fields from backend `registrationPublicSelection`
    id: number;
    code: string;
    title: string;
    creditUnit: number;
    courseType: 'CORE' | 'ELECTIVE';          // ADDED
    preferredSemesterType: string | null; // ADDED
  };
  semester: {
    id: number;
    name: string;
    type: string;
    areStudentEditsLocked: boolean; // Crucial for delete logic
  };
  level: {
    id: number;
    name: string;
  };
  season: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    regNo: string;
    name: string;
    departmentId: number;
    programId: number;
  };
  score?: { // Add optional score property, only present if score is recorded
    id: number;
  }
}

// Interface used for courses in AvailableCoursesList to indicate registration status
// This is an extension of RegistrableCourse
export interface DisplayCourse extends RegistrableCourse {
  isAlreadyRegistered?: boolean; // NEW: Indicates if this course is currently registered
  // isCheckboxDisabled?: boolean; // This prop is used in CourseCard, not part of the course object itself.
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
  availableCourses: RegistrableCourse[]; // This is still RegistrableCourse
}

// NEW INTERFACE for the filter options from registered courses
export interface RegistrationFilterOptions {
  seasons: { id: number; name: string; }[];
  semesters: { id: number; name: string; }[];
  levels: { id: number; name: string; }[];
}

// Update the return type for getMyRegistrations
export interface MyRegistrationsResponseData {
  items: CourseRegistration[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalItems: number;
  filterOptions: RegistrationFilterOptions; // Add this new field
}


// ... (All your API functions: getRegistrableCourses, registerForCourses, getMyRegistrations,
// deleteIndividualRegistration, deleteBatchRegistrations, updateStudentRegistrations) ...

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
 * Register student for selected courses (initial registration, or adding more without reconciliation).
 * @param registrations Array of course registration data
 * @returns A promise that resolves to an ApiResponse.
 */
export const registerForCourses = async (registrations: {
  courseId: number;
  seasonId: number; // Added
  semesterId: number; // Added
  levelId: number; // Added
}[]) : Promise<ApiResponse<any>> => { // Simplified type for data field
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
): Promise<ApiResponse<MyRegistrationsResponseData>> => { // Use the updated interface
  const response = await api.get('/student-registrations/me', {
    params: {
      seasonId,
      semesterId,
    },
  });
  return response.data;
};

/**
 * Deletes a single student course registration.
 * @param registrationId The ID of the registration to delete.
 * @returns A promise that resolves to an ApiResponse.
 */
export const deleteIndividualRegistration = async (
  registrationId: number
): Promise<ApiResponse<any>> => {
  const response = await api.delete(`/student-registrations/${registrationId}`);
  return response.data;
};


/**
 * Deletes multiple student course registrations.
 * @param registrationIds An array of IDs of registrations to delete.
 * @returns A promise that resolves to an ApiResponse.
 */
export const deleteBatchRegistrations = async (
  registrationIds: number[]
): Promise<ApiResponse<any>> => {
  const response = await api.delete('/student-registrations/batch', {
    data: { ids: registrationIds }, // Send IDs in the request body
  });
  return response.data;
};

/**
 * Updates a student's course registrations for a given period to match a desired set of courses.
 * This performs a reconciliation (add new, delete removed, keep existing).
 * @param data Object containing student's academic period IDs and the desired course IDs.
 * @returns A promise that resolves to an ApiResponse.
 */
export const updateStudentRegistrations = async (data: {
  seasonId: number;
  semesterId: number;
  levelId: number;
  desiredCourses: { courseId: number }[]; // Removed programCourseId here, frontend ensures only courseId
}): Promise<ApiResponse<any>> => {
  const response = await api.put('/student-registrations/me', data); // PUT to /me
  return response.data;
};