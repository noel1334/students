import api from '@/config/api';

export interface ExamFee {
  id: number;
  amount: number;
  description: string | null;
  isActive: boolean;
  exam: {
    id: number;
    title: string;
    course: {
      code: string;
    };
  };
}

export const getExamFee = async (examId: number): Promise<ExamFee | null> => {
  try {
    const response = await api.get(`/exam-fees/exam/${examId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
