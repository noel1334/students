import api from '@/config/api';

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
  isAvailable: boolean;
  hostelId: number;
}

export interface HostelRoomsResponse {
  status: string;
  data: {
    rooms: HostelRoom[];
  };
}

/**
 * Fetches hostel fees relevant to the authenticated student
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export const getStudentHostelFees = async (page = 1, limit = 50): Promise<HostelFeesResponse> => {
  const response = await api.get('/hostel-fee-lists/my-fees', {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Fetches available rooms for a specific hostel
 * @param hostelId - The ID of the hostel
 */
export const getHostelRooms = async (hostelId: number): Promise<HostelRoomsResponse> => {
  const response = await api.get(`/hostels/${hostelId}/rooms`);
  return response.data;
};

/**
 * Creates a hostel booking
 * @param bookingData - The booking data
 */
export const createHostelBooking = async (bookingData: {
  hostelId: number;
  roomId: number;
  hostelFeeListId: number;
}) => {
  const response = await api.post('/hostel-bookings', bookingData);
  return response.data;
};
