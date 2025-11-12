import api from '@/config/api';

export interface ExamAssignment {
  id: number;
  seatNumber: string | null;
  assignedAt: string;
  student: {
    id: number;
    regNo: string;
    name: string;
    email: string;
    profileImg: string | null;
    department: {
      id: number;
      name: string;
      faculty: {
        id: number;
        name: string;
        facultyCode: string;
      };
    };
    program: {
      id: number;
      name: string;
      programCode: string;
      degree: string;
      duration: number;
      modeOfStudy: string;
    };
  };
  examSession: {
    id: number;
    sessionName: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    exam: {
      id: number;
      title: string;
      examType: string;
      status: string;
      courseId: number;
      semesterId: number;
      seasonId: number;
      course: {
        id: number;
        code: string;
        title: string;
      };
    };
    venue: {
      id: number;
      name: string;
      location: string;
    } | null;
  };
}

export interface ExamAssignmentsResponse {
  assignments: ExamAssignment[];
  totalPages: number;
  currentPage: number;
  totalAssignments: number;
}

export const getMyExamAssignments = async (
  page = 1,
  limit = 20,
  filters?: {
    seasonId?: number;
    semesterId?: number;
    examType?: string;
  }
): Promise<ExamAssignmentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filters?.seasonId && { seasonId: filters.seasonId.toString() }),
    ...(filters?.semesterId && { semesterId: filters.semesterId.toString() }),
    ...(filters?.examType && { examType: filters.examType }),
  });

  const response = await api.get(`/student-assignments/me?${params}`);
  return response.data.data;
};
