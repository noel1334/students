import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentProfile,
  updateStudentProfile,
  UpdateStudentProfileData,
  StudentProfileData,
} from "@/services/studentServicesApi";

export const STUDENT_PROFILE_KEY = ["student", "me"] as const;

export function useStudentProfile() {
  return useQuery({
    queryKey: STUDENT_PROFILE_KEY,
    queryFn: async () => {
      const res = await getStudentProfile();
      if (res.status !== "success" || !res.data?.student) {
        throw new Error(res.message || "Failed to load profile");
      }
      return res.data.student as StudentProfileData;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useUpdateStudentProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStudentProfileData) => updateStudentProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STUDENT_PROFILE_KEY });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      updateStudentProfile({
        currentPassword: data.currentPassword,
        password: data.newPassword,
      }),
  });
}

export function useUpdateProfileImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profileImg: string | null) => updateStudentProfile({ profileImg }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STUDENT_PROFILE_KEY });
    },
  });
}