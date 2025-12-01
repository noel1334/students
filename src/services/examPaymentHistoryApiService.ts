// src/services/examPaymentHistoryApiService.ts

import api from '@/config/api';

export interface ExamPaymentHistory {
  id: number;
  amountExpected: number;
  amountPaid: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  paymentDate: string | null;
  paymentReference: string;
  transactionId: string | null;
  paymentChannel: 'PAYSTACK' | 'FLUTTERWAVE' | 'STRIPE';
  createdAt: string;
  student: {
    id: number;
    name: string;
    regNo: string;
  };
  exam: {
    id: number;
    title: string;
    course: {
      code: string;
    };
  };
}

export interface PaymentHistoryResponse {
  items: ExamPaymentHistory[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const getMyExamPaymentHistory = async (
  page = 1,
  limit = 20,
  filters?: {
    status?: string;
    channel?: string;
  }
): Promise<PaymentHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.channel && { channel: filters.channel }),
  });

  const response = await api.get(`/student-exam-payments/my-history?${params}`);
  return response.data.data;
};
