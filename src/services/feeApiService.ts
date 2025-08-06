// src/services/feeApiService.ts
import api from '@/config/api';
import axios from 'axios';  // Import axios if you haven't already

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
  faculty?: { //  Include faculty here too.
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
  totalAmount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
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

// --- ADDED INTERFACE FOR PAYMENT ---
export interface SchoolFeePaymentPayload {
    feeId: number;
    amount: number;
    paymentChannel: 'FLUTTERWAVE' | 'PAYSTACK' | 'STRIPE'; // Use the enum for type safety.
    purpose: 'SCHOOL_FEE'; // Fixed, or potentially from an enum
}

export interface SchoolFeeRecord {
  id: number;
  amount: number;         // This is the Total Fee for this record
  amountPaid: number;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL';
  description: string | null;
  season: {
    id: number;
    name: string; // e.g., "2023/2024"
  };
  semester: {
    id: number;
    name: string; // e.g., "First Semester"
  } | null;
  // This is the crucial part: the list of actual payments made for this fee
  payments: PaymentReceipt[];
}

export interface PaymentReceipt {
  id: number;
  amountPaid: number;
  paymentDate: string;
  reference: string;
  channel: 'PAYSTACK' | 'FLUTTERWAVE' | 'STRIPE';
  description: string | null;
}

export const getMySchoolFeeRecords = async (): Promise<ApiResponse<{ records: any[] }>> => {
  try {
    const response = await api.get('/school-fee/my-records');
    return response.data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch payment records.',
    };
  }
};
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

// --- STRIPE SESSION CREATION ---
export const createStripeSession = async (
    studentId: number,
    seasonId: number,
    semesterId: number,
    amount: number,
    paymentChannel: 'STRIPE',
    purpose: string,
    email: string,
    name: string
) => {
    try {
        const response = await api.post('/school-fee/create-stripe-session', {
            studentId,
            seasonId,
            semesterId,
            amount,
            email,
            name,
            paymentChannel,
        });

        return response.data;
    } catch (error: any) {
        console.error("Error creating Stripe session (feeApiService):", error);
        throw new Error(error.response?.data?.message || 'Failed to create Stripe session.');
    }
};
export const completeSchoolFeeStripePayment = async (sessionId: string) => {
  try {
    const response = await api.post('/school-fee/complete-stripe-payment', {
        sessionId,
    });
    return response.data; // Expecting { message: string, payment?: any }
  } catch (error: any) {
    console.error("Error completing Stripe payment (feeApiService):", error);
    throw new Error(error.response?.data?.message || 'Failed to complete Stripe payment.');
  }
};
export const handleStripeCancellation = async (schoolFeeId: string): Promise<any> => {
  try {
    const response = await api.post('/school-fee/handle-stripe-cancellation', {
        schoolFeeId,
    });
    return response.data; // Expects { message: "..." }
  } catch (error: any) {
    console.error("Error handling Stripe cancellation (feeApiService):", error);
    // We don't need to throw an error that the user sees for a background cleanup task.
    // Just logging it is often enough.
    return { message: "Cancellation cleanup could not be confirmed." };
  }
};

// --- PAYSTACK VERIFICATION ---
export const verifyPaystackPayment = async (reference: string, paymentDetails: any) => {
  try {
    const response = await api.post('/school-fee/verify-paystack', {
        reference,
        paymentDetails,
    });
    return response.data; // Or whatever structure your API returns on success
  } catch (error: any) {
    console.error("Error verifying Paystack payment (feeApiService):", error);
    throw new Error(error.response?.data?.message || 'Failed to verify Paystack payment.');
  }
};

// --- FLUTTERWAVE VERIFICATION ---
export const verifyFlutterwavePayment = async (transactionId: string, tx_ref: string, paymentDetails: any) => {
    try {
        const response = await api.post('/school-fee/verify-flutterwave', {
            transactionId,
            tx_ref,
            paymentDetails,
        });
        return response.data; // Or whatever structure your API returns on success
    } catch (error: any) {
        console.error("Error verifying Flutterwave payment (feeApiService):", error);
        throw new Error(error.response?.data?.message || 'Failed to verify Flutterwave payment.');
    }
};

export const deleteIncompletePayment = async (reference: string): Promise<any> => {
  try {
    // The route you created is /delete-incomplete/:reference
    const response = await api.delete(`/school-fee/delete-incomplete/${reference}`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete incomplete payment with reference ${reference}:`, error);
    // We don't need to throw an error to the user for a background cleanup task.
    // Logging it is sufficient.
  }
};