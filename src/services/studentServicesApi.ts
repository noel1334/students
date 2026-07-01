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
    degreeType?: string;
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
  medicalFitness?: {
    id?: number;
    bloodGroup?: string | null;
    genotype?: string | null;
    fileUrl?: string | null;
    status?: string | null;
    rejectionReason?: string | null;
  } | null;
  admissionOfferDetails?: {
    id?: number;
    hasPaidAcceptanceFee?: boolean;
    isAccepted?: boolean;
    applicationProfile?: {
      id?: number;
      bioData?: ApplicantBioData | null;
      contactInfo?: ApplicantContactInfo | null;
      nextOfKin?: ApplicantNextOfKin | null;
      guardianInfo?: ApplicantGuardianInfo | null;
      uploadedDocuments?: Array<{
        id?: number;
        documentType?: string;
        fileUrl?: string;
        status?: string;
      }>;
    } | null;
  } | null;
  _count?: {
    registrations: number;
    results: number;
  };
}

export interface ApplicantBioData {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  placeOfBirth?: string | null;
  religion?: string | null;
  maritalStatus?: string | null;
}

export interface ApplicantContactInfo {
  countryOfResidence?: string | null;
  stateOfResidence?: string | null;
  lgaOfResidence?: string | null;
  residentialAddress?: string | null;
}

export interface ApplicantNextOfKin {
  fullName?: string | null;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface ApplicantGuardianInfo {
  fullName?: string | null;
  relationship?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  occupation?: string | null;
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
  // Student table fields (self-editable)
  profileImg?: string | null;
  password?: string;
  currentPassword?: string;

  // StudentDetails fields (self-editable)
  dob?: string | null;
  gender?: string;
  address?: string | null;
  phone?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;

  // MedicalFitness fields (self-editable)
  bloodGroup?: string | null;
  genotype?: string | null;
  fileUrl?: string | null;

  // ApplicationProfile sub-model updates (self-editable)
  bioData?: Partial<ApplicantBioData>;
  contactInfo?: Partial<ApplicantContactInfo>;
  nextOfKin?: Partial<ApplicantNextOfKin>;
  guardianInfo?: Partial<ApplicantGuardianInfo>;
}

export const updateStudentProfile = async (data: UpdateStudentProfileData): Promise<ApiResponse<{ student: StudentProfileData }>> => {
  const response = await api.put('/students/me', data);
  return response.data;
};