
import api from '@/config/api';

export interface SchoolFeePaymentPayload {
  feeId: number;
  amount: number;
  paymentChannel: 'FLUTTERWAVE' | 'PAYSTACK' | 'STRIPE';
  purpose: 'SCHOOL_FEE';
}

export interface StripeSessionResponse {
  sessionId: string;
  reference: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

/**
 * Creates a Stripe checkout session for school fee payment
 */
export const createSchoolFeeStripeSession = async (
  feeId: number,
  amount: number,
  paymentChannel: string,
  purpose: string,
  userEmail: string,
  userName: string
): Promise<StripeSessionResponse> => {
  const response = await api.post('/school-fee-payments/create-stripe-session', {
    feeId,
    amount,
    paymentChannel,
    purpose,
    userEmail,
    userName
  });
  return response.data.data;
};

/**
 * Verifies Paystack payment for school fees
 */
export const verifyPaystackSchoolFeePayment = async (
  reference: string,
  paymentDetails: SchoolFeePaymentPayload
): Promise<ApiResponse<any>> => {
  const response = await api.post('/school-fee-payments/verify-paystack', {
    reference,
    ...paymentDetails
  });
  return response.data;
};

/**
 * Verifies Flutterwave payment for school fees
 */
export const verifyFlutterwaveSchoolFeePayment = async (
  transactionId: string,
  txRef: string,
  paymentDetails: SchoolFeePaymentPayload
): Promise<ApiResponse<any>> => {
  const response = await api.post('/school-fee-payments/verify-flutterwave', {
    transactionId,
    txRef,
    ...paymentDetails
  });
  return response.data;
};

/**
 * Deletes incomplete payment record
 */
export const deleteIncompleteSchoolFeePayment = async (reference: string): Promise<void> => {
  await api.delete(`/school-fee-payments/delete-incomplete/${reference}`);
};
