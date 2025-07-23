
import api from '@/config/api';

// Define interfaces for school fee data
export interface SchoolFeeItem {
  id: number;
  name: string;
  description?: string;
  amount: number;
  dueDate?: string;
  isOptional: boolean;
  feeType: 'TUITION' | 'ACCOMMODATION' | 'REGISTRATION' | 'EXAM' | 'LIBRARY' | 'MEDICAL' | 'SPORTS' | 'OTHER';
  seasonId: number;
  semesterId?: number;
  levelId?: number;
  programId?: number;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolFeeListResponse {
  items: SchoolFeeItem[];
  totalAmount: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  student?: {
    id: number;
    name: string;
    regNo: string;
    level: string;
    program: string;
    department: string;
  };
  academicPeriod?: {
    season: {
      id: number;
      name: string;
    };
    semester?: {
      id: number;
      name: string;
    };
    level: {
      id: number;
      name: string;
    };
  };
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

/**
 * Fetches applicable school fees for the current student based on their academic period
 * @param seasonId The ID of the academic season
 * @param semesterId Optional semester ID
 * @param levelId Optional level ID
 * @param page Optional page number for pagination
 * @param limit Optional limit for pagination
 * @returns A promise that resolves to an ApiResponse containing school fee data
 */
export const getApplicableSchoolFees = async (
  seasonId?: number,
  semesterId?: number,
  levelId?: number,
  page: number = 1,
  limit: number = 50
): Promise<ApiResponse<SchoolFeeListResponse>> => {
  const params: any = {
    page,
    limit
  };

  if (seasonId) {
    params.seasonId = seasonId;
  }

  if (semesterId) {
    params.semesterId = semesterId;
  }

  if (levelId) {
    params.levelId = levelId;
  }

  const response = await api.get('/school-fee-lists', { params });
  return response.data;
};

/**
 * Fetches school fees for the student's current academic period
 * Uses the student's current season, semester, and level from their profile
 * @returns A promise that resolves to an ApiResponse containing current school fee data
 */
export const getCurrentSchoolFees = async (): Promise<ApiResponse<SchoolFeeListResponse>> => {
  // This will use the backend logic to automatically determine the student's current academic period
  const response = await api.get('/school-fee-lists');
  return response.data;
};

/**
 * Gets a specific school fee item by ID (typically for admin use)
 * @param id The ID of the school fee item
 * @returns A promise that resolves to an ApiResponse containing the school fee item
 */
export const getSchoolFeeItemById = async (id: number): Promise<ApiResponse<SchoolFeeItem>> => {
  const response = await api.get(`/school-fee-lists/${id}`);
  return response.data;
};
