// src/services/hostelApiService.ts

import api from '@/config/api';

// --- Type Definitions ---
export interface HostelFeeData {
  id: number;
  hostelId: number;
  roomId: number | null;
  seasonId: number;
  amount: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hostel: {
    id: number;
    name: string;
    gender: 'MALE' | 'FEMALE' | null;
  };
  room: {
    id: number;
    roomNumber: string;
    capacity: number;
  } | null;
  season: {
    id: number;
    name: string;
  };
}

export interface HostelFeesResponse {
  status: string;
  data: {
    hostelFees: HostelFeeData[];
    totalPages: number;
    currentPage: number;
    totalHostelFees: number;
  };
}

export interface HostelRoom {
  id: number;
  roomNumber: string;
  capacity: number;
  isAvailable: boolean; // This now means physically available
  hostelId: number;
  currentOccupancy?: number; // <<< NEW: Add current occupancy to the interface >>>
}

export interface HostelRoomsResponse {
  status: string;
  data: {
    rooms: HostelRoom[];
  };
}

export type PaymentChannelType = 'PAYSTACK' | 'FLUTTERWAVE' | 'STRIPE';

export interface PreparedHostelBookingData {
    studentId: number;
    hostelId: number;
    roomId: number;
    seasonId: number;
    hostelFeeListId: number | null;
    amountDue: number;
    studentEmail: string;
    studentName: string;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    paymentDeadline: Date | null;
}

// --- API Service Functions ---
export const validateHostelBookingForPayment = async (bookingRequestData: {
  hostelId: number;
  roomId: number;
  seasonId: number;
  hostelFeeListId: number;
  checkInDate?: string;
  checkOutDate?: string;
  paymentDeadline?: string;
}) => {
  const response = await api.post('/hostel-bookings/prepare-payment', bookingRequestData);
  return response.data.data.booking as PreparedHostelBookingData;
};

export const getStudentHostelFees = async (page = 1, limit = 50): Promise<HostelFeesResponse> => {
  const response = await api.get('/hostel-fee-lists/my-fees', {
    params: { page, limit }
  });
  return response.data;
};

// <<< MODIFIED: getHostelRooms now takes seasonId and calls new backend endpoint >>>
export const getHostelRooms = async (hostelId: number, seasonId: number): Promise<HostelRoomsResponse> => {
  const response = await api.get(`/hostels/${hostelId}/rooms-with-occupancy`, { // New endpoint
    params: { seasonId } // Pass the seasonId as a query parameter
  });
  return response.data;
};

export const initializeHostelBookingStripePayment = async (
  bookingDetails: PreparedHostelBookingData,
  userDetails: { email: string; name: string },
  paymentChannel: PaymentChannelType
): Promise<{ sessionId: string; reference: string }> => {
  const response = await api.post('/hostel-bookings/create-stripe-session', {
    bookingDetails,
    userDetails,
    paymentChannel
  });
  return response.data;
};

export const completeHostelBookingStripePayment = async (sessionId: string) => {
    const response = await api.post('/hostel-bookings/complete-stripe-payment', { sessionId });
    return response.data;
}

export const verifyPaystackHostelBookingPayment = async (
  reference: string,
  bookingDetails: PreparedHostelBookingData,
) => {
  const response = await api.post('/hostel-bookings/verify-paystack', { reference, bookingDetails });
  return response.data;
};

export const verifyFlutterwaveBookingPayment = async (
  transactionId: string,
  tx_ref: string,
  bookingDetails: PreparedHostelBookingData,
) => {
  const response = await api.post('/hostel-bookings/verify-flutterwave', { transactionId, tx_ref, bookingDetails });
  return response.data;
};