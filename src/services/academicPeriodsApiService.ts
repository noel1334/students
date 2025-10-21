// src/services/academicPeriodsApiService.ts

import api from '@/config/api'; 

// Define a common ApiResponse interface if it's not global
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Define interfaces for Season and Semester from your backend schema
export interface Season {
  id: number;
  name: string; 
  isActive: boolean;
  isComplete: boolean;
  startDate: string; 
  endDate: string; 
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  id: number;
  name: string; 
  seasonId: number;
  type: 'FIRST' | 'SECOND' | 'SUMMER'; 
  semesterNumber: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  areStudentEditsLocked: boolean;
  areLecturerScoreEditsLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- ADD THIS LEVEL INTERFACE HERE ---
export interface Level {
  id: number;
  name: string;
  value: number;
  description?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
// --- END ADDITION ---

/**
 * Fetches all academic seasons from the backend.
 * @returns A promise that resolves to an ApiResponse containing an object with a 'seasons' array.
 */
export const getAllSeasons = async (): Promise<ApiResponse<{ seasons: Season[], totalPages: number, currentPage: number, totalSeasons: number }>> => {
  const response = await api.get('/seasons');
  return response.data;
};

/**
 * Fetches all academic semesters from the backend.
 * @param seasonId Optional season ID to filter semesters.
 * @returns A promise that resolves to an ApiResponse containing an object with a 'semesters' array.
 */
export const getAllSemesters = async (seasonId?: number): Promise<ApiResponse<{ semesters: Semester[], totalPages: number, currentPage: number, totalSemesters: number }>> => {
  const params: { seasonId?: number } = {};
  if (seasonId) {
    params.seasonId = seasonId;
  }
  const response = await api.get('/semesters', { params });
  return response.data;
};

// --- ADD THIS FUNCTION HERE ---
/**
 * Fetches all levels from the backend.
 * @returns A promise that resolves to an ApiResponse containing an array of Level objects.
 */
export const getAllLevels = async (): Promise<ApiResponse<{ items: Level[] }>> => {
  const response = await api.get('/levels'); // Assuming your backend route for levels is /levels
  return response.data;
};
// --- END ADDITION ---