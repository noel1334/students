import api from '@/config/api';

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

export const verifyPayment = async (reference: string, gateway: string): Promise<any> => {
  const response = await api.get(`/student-exam-payments/verify-callback?${gateway === 'paystack' ? 'reference' : 'tx_ref'}=${reference}`);
  return response.data;
};
