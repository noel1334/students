import { useQuery } from '@tanstack/react-query';
import { fetchUniversitySettings, UniversitySetting } from '@/services/universitySettingApiService';

export const useUniversitySettings = () => {
  return useQuery<UniversitySetting>({
    queryKey: ['university-settings'],
    queryFn: fetchUniversitySettings,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
};