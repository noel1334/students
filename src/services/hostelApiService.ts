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
  currentOccupancy?: number; // Added current occupancy to the interface
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

// --- NEW INTERFACES FOR BOOKINGS AND PAYMENTS ---
export interface PaymentReceipt {
  id: number;
  amountPaid: number;
  paymentStatus: string; // Assuming it maps to BookingPaymentStatus enum values
  reference: string;
  channel: PaymentChannelType;
  transactionId: string | null;
  paymentDate: string; // Date string
  // Add other fields from your PaymentReceipt model if needed
}

export interface StudentLite {
  id: number;
  regNo: string;
  name: string;
  email: string;
}

export interface BookingDetail {
  id: number;
  checkInDate: string | null;
  checkOutDate: string | null;
  isActive: boolean;
  amountDue: number | null;
  amountPaid: number;
  paymentStatus: string; // Maps to BookingPaymentStatus
  paymentDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  hostelFeeListId: number | null;
  hostelFeeListItem: {
    id: number;
    amount: number;
    description: string | null;
    isActive: boolean;
  } | null;
  student: StudentLite;
  hostel: { id: number; name: string };
  room: { id: number; roomNumber: string; capacity: number } | null;
  season: { id: number; name: string };
  payments: PaymentReceipt[]; // Include payment receipts
  // Add other booking-related fields if you have them and want them here
}

export interface HostelBookingsResponse {
  status: string;
  data: {
    bookings: BookingDetail[];
    totalPages: number;
    currentPage: number;
    totalBookings: number;
  };
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

export const getHostelRooms = async (hostelId: number, seasonId: number): Promise<HostelRoomsResponse> => {
  const response = await api.get(`/hostels/${hostelId}/rooms-with-occupancy`, {
    params: { seasonId }
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

export interface RoommateDetail {
  id: number;
  name: string;
  regNo: string;
  // Add other student fields if needed, like email, gender from studentDetails
}

// NEW: Fetch all bookings for the current student
export const getMyHostelBookings = async (
  page = 1,
  limit = 10,
  status?: string, // Optional status filter
  search?: string // Optional search filter
): Promise<HostelBookingsResponse> => {
  const params: { [key: string]: any } = { page, limit };
  if (status) params.status = status;
  if (search) params.search = search; // Assuming backend supports search for my-bookings
  const response = await api.get('/hostel-bookings/my-bookings', { params });
  return response.data;
};

// NEW: Fetch a single booking by ID (for admin or student's own booking)
export const getHostelBookingById = async (bookingId: number): Promise<{ status: string; data: { booking: BookingDetail } }> => {
  const response = await api.get(`/hostel-bookings/${bookingId}`);
  return response.data;
};


export const fetchMyRoommates = async (seasonId: number): Promise<RoommateDetail[]> => {
    const response = await api.get('/hostel-bookings/my-roommates', {
        params: { seasonId }
    });
    return response.data.data.roommates;
};