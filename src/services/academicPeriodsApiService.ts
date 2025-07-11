// src/services/academicPeriodsApiService.ts

import api from '@/config/api'; 
import { ApiResponse } from './courseApiService'; // Re-use the ApiResponse interface

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

/**
 * Fetches all academic seasons from the backend.
 * @returns A promise that resolves to an ApiResponse containing an array of Season objects.
 */
export const getAllSeasons = async (): Promise<ApiResponse<{ items: Season[] }>> => {
  const response = await api.get('/seasons');
  console.log(response.data);
  return response.data;
};


export const getAllSemesters = async (seasonId?: number): Promise<ApiResponse<{ items: Semester[] }>> => {
  const params: { seasonId?: number } = {};
  if (seasonId) {
    params.seasonId = seasonId;
  }
  const response = await api.get('/semesters', { params });
  console.log(response.data);
  return response.data;
};