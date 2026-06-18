
import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import { getStudentProfile, StudentProfileData } from '@/services/studentServicesApi';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getStudentProfile();
      if (response.status === 'success' && response.data?.student) {
        setStudentData(response.data.student);
        setAvatar(response.data.student.profileImg || null);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch profile data",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">No profile data available</p>
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
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          studentInfo={studentInfo}
          avatar={avatar}
          setAvatar={setAvatar}
        />

        {/* Profile Form */}
        <ProfileForm studentInfo={studentInfo} studentData={studentData} onProfileUpdated={fetchProfile} />
      </div>
    </div>
  );
};

export default Profile;
