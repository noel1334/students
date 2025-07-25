// src/services/feeApiService.ts

import api from '@/config/api';

// Define a common ApiResponse interface if it's not global
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Interface for School Fee List Item (simplified for what's needed)
export interface SchoolFeeListItem {
  id: number;
  amount: number;
  description?: string | null;
  level: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  } | null;
  program?: {
    id: number;
    name: string;
  } | null;
  faculty?: {
    id: number;
    name: string;
  } | null;
  season: {
    id: number;
    name: string;
  };
  nationality?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface for the API response when fetching applicable school fees
export interface ApplicableSchoolFeesResponseData {
  items: SchoolFeeListItem[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalItems: number;
}

/**
 * Fetches the list of applicable school fees for the currently logged-in student
 * for a specific academic season.
 *
 * @param seasonId The ID of the academic season for which to fetch the fees.
 * @returns A promise that resolves to an ApiResponse containing
 *          ApplicableSchoolFeesResponseData.
 */
export const getApplicableSchoolFeesForStudent = async (
  seasonId: number
): Promise<ApiResponse<ApplicableSchoolFeesResponseData>> => {
  try {
    const response = await api.get('/school-fee-lists', {
      params: {
        seasonId: seasonId,
      },
    });
    console.log(response.data); 
    return response.data;
  } catch (error: any) {
    console.error('Error fetching applicable school fees:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch applicable school fees.',
    };
  }
};

// Interface for a single School Fee bill
export interface SchoolFeeBill {
  id: number;
  studentId: number;
  seasonId: number;
  semesterId?: number | null;
  amount: number;
  amountPaid: number;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'WAIVED' | 'OVERDUE' | 'CANCELLED';
  dueDate?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  departmentId?: number | null;
  programId?: number | null;
  Department?: {
    id: number;
    name: string;
  } | null;
  Program?: {
    id: number;
    name: string;
  } | null;
  payments?: any[]; // Adjust type if needed
}


