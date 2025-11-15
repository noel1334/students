// src/services/examPaymentApiService.ts

import api from '@/config/api';

// This type definition is required by the verifyPayment function
export type PaymentPurpose = 'schoolFee' | 'hostelBooking' | 'examFee' | null;

// It's good practice to define the expected response shape
export interface VerificationResponse {
  status: 'success' | 'error';
  message: string;
  data?: any; // You can make this more specific if you know the data structure
}
interface ExamPaymentDetails {
    examId: number;
    // The studentId will be added by the backend from the auth token
}
export interface ExamPaymentStatus {
  status: 'PAID' | 'PENDING' | 'FAILED' | 'NOT_PAID' | 'NOT_REQUIRED';
  message: string;
  feeDetails?: {
    id: number;
    amount: number;
    description: string;
    isActive: boolean;
  };
  paymentDetails?: {
    id: number;
    amountPaid: number;
    paymentStatus: string;
    paymentDate: string;
    paymentReference: string;
    transactionId: string;
    paymentChannel: string;
  };
  student?: {
    id: number;
    name: string;
    email: string;
    regNo: string;
  };
}

export interface InitializePaymentResponse {
  message: string;
  authorization_url: string;
  reference: string;
}

export const getPaymentStatus = async (examId: number): Promise<ExamPaymentStatus> => {
  const response = await api.get(`/student-exam-payments/my-status/exam/${examId}`);
  return response.data.data;
};

export const initializePayment = async (examId: number, paymentChannel: 'PAYSTACK' | 'FLUTTERWAVE'): Promise<InitializePaymentResponse> => {
  const response = await api.post('/student-exam-payments/initialize', {
    examId,
    paymentChannel
  });
  return response.data.data;
};

export const verifyPayment = async (
  reference: string,
  gateway: 'PAYSTACK' | 'FLUTTERWAVE' | 'STRIPE',
  purpose: PaymentPurpose,
  transactionId?: string
): Promise<VerificationResponse> => { // Using a more specific return type
  const params = new URLSearchParams();
  params.append('gateway', gateway);
  if (purpose) {
      params.append('purpose', purpose);
  }

  // FIX: Changed 'paystack' to 'PAYSTACK'
  if (gateway === 'PAYSTACK') {
    params.append('ref', reference);
  } 
  // FIX: Changed 'flutterwave' to 'FLUTTERWAVE'
  else if (gateway === 'FLUTTERWAVE') {
    params.append('tx_ref', reference);
    if (transactionId) {
      params.append('transaction_id', transactionId);
    }
  }

  const response = await api.get(`/student-exam-payments/verify-callback?${params.toString()}`);
  return response.data;
};

export const verifyPaystackExamPayment = async (reference: string, paymentDetails: ExamPaymentDetails) => {
    const response = await api.post('/student-exam-payments/verify-paystack', {
        reference,
        paymentDetails,
    });
    return response.data;
};

// NEW verification function for Flutterwave
export const verifyFlutterwaveExamPayment = async (transactionId: string, tx_ref: string, paymentDetails: ExamPaymentDetails) => {
    const response = await api.post('/student-exam-payments/verify-flutterwave', {
        transactionId,
        tx_ref,
        paymentDetails,
    });
    return response.data;
};