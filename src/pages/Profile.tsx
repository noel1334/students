
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useStudentProfile } from '@/hooks/useStudentProfile';

const Profile = () => {
  const { data: studentData, isLoading, isError, error, refetch, isRefetching } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-40 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !studentData) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-md mx-auto text-center space-y-4 mt-10">
          <p className="text-muted-foreground">
            {(error as Error)?.message || "Unable to load your profile."}
          </p>
          <Button onClick={() => refetch()} disabled={isRefetching}>
            {isRefetching ? "Retrying…" : "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  const studentInfo = {
    name: studentData.name || "N/A",
    regNo: studentData.regNo || "N/A",
    department: studentData.department?.name || "N/A",
    program: studentData.program?.name || "N/A",
    level: studentData.currentLevel?.name || "N/A",
    email: studentData.email || "",
    phone: studentData.studentDetails?.phone || "",
    session: `${studentData.currentSemester?.name || ''}, ${studentData.currentSeason?.name || ''}`.trim()
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background pb-28 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader studentInfo={studentInfo} avatar={studentData.profileImg || null} />
        <ProfileForm studentInfo={studentInfo} studentData={studentData} />
      </div>
    </div>
  );
};

export default Profile;
