
import React, { useState } from 'react';
import { Calendar, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateStudentProfile } from '@/services/studentServicesApi';

interface ProfileHeaderProps {
  studentInfo: {
    name: string;
    regNo: string;
    department: string;
    program: string;
    level: string;
    session: string;
  };
  avatar: string | null;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  onProfileUpdated?: () => void | Promise<void>;
}

const ProfileHeader = ({
  studentInfo,
  avatar,
  setAvatar,
  onProfileUpdated
}: ProfileHeaderProps) => {
  const [savingAvatar, setSavingAvatar] = useState(false);
  
  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setAvatar(imageData);

      try {
        setSavingAvatar(true);
        const response = await updateStudentProfile({ profileImg: imageData });
        if (response.status === 'success') {
          toast.success('Profile image updated');
          await onProfileUpdated?.();
        } else {
          toast.error(response.message || 'Failed to update profile image');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to update profile image');
      } finally {
        setSavingAvatar(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold">My Profile</h1>
        <div className="text-sm text-muted-foreground flex items-center mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{studentInfo.session}</span>
        </div>
      </div>

      {/* Profile Header Section with Avatar */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-card p-6 flex flex-col items-center">
            <div className="relative mb-3 group">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                {avatar ? (
                  <AvatarImage src={avatar} alt={studentInfo.name} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {studentInfo.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label 
                  htmlFor="avatar-upload" 
                  className="bg-primary text-primary-foreground rounded-full p-2 cursor-pointer inline-flex items-center justify-center"
                >
                  <Upload className="h-4 w-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={savingAvatar}
                />
              </div>
            </div>
            {savingAvatar && <p className="text-xs text-muted-foreground mb-2">Saving profile image...</p>}
            
            <h2 className="text-xl font-bold">{studentInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{studentInfo.regNo}</p>
            
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              <span className="px-3 py-1 bg-secondary rounded-full text-xs">{studentInfo.program}</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs">{studentInfo.department}</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs">{studentInfo.level}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileHeader;
