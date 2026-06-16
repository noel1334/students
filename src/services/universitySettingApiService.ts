import api from '@/config/api';

export interface UniversitySetting {
  id: number;
  name: string;
  acronym: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
}

export const fetchUniversitySettings = async (): Promise<UniversitySetting> => {
  const response = await api.get('/university-settings');
  return response.data?.data?.settings;
};