import api from '@/config/api';

export interface StudentProfileData {
  id: string;
  regNo?: string;
  jambRegNo?: string;
  name?: string;
  email?: string;
  profileImg?: string | null;
  avatarLetter?: string; // This is a computed property from your service
  
  department?: {
    id: number;
    name: string;
    faculty: {
      id: number;
      name: string;
      facultyCode: string;
    };
  };
  program?: {
    id: number;
    name: string;
    programCode: string;
    degree: string;
    duration: number;
    modeOfStudy: string; 
  };
  currentLevel?: {
    id: number;
    name: string;
    value: number;
  };
  currentSeason?: {
    id: number;
    name: string;
  };
  currentSemester?: {
    id: number;
    name: string;
    type: string;
  };

  isActive?: boolean;
  isGraduated?: boolean;
  yearOfAdmission?: number;
  entryMode?: string;
  admissionSeasonId?: number;
  admissionSemesterId?: number;
  departmentId?: number;
  programId?: number;
  entryLevelId?: number;
  currentLevelId?: number;
  graduationSeasonId?: number | null;
  graduationSemesterId?: number | null;
  currentSeasonId?: number | null;
  currentSemesterId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  studentDetails?: any;
  _count?: {
    registrations: number;
    results: number;
  };
}

// This interface describes the *overall API response wrapper*
export interface ApiResponse<T> {
  status: string;
  data?: T; // This T will be { student: StudentProfileData }
  message?: string;
}

export const getStudentProfile = async (): Promise<ApiResponse<{ student: StudentProfileData }>> => {
  const response = await api.get('/students/me');
  return response.data;
};

export interface UpdateStudentProfileData {
  // Student table fields
  profileImg?: string;
  password?: string;
  
  // StudentDetails fields
  dob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export const updateStudentProfile = async (data: UpdateStudentProfileData): Promise<ApiResponse<{ student: StudentProfileData }>> => {
  const response = await api.put('/students/me', data);
  return response.data;
};