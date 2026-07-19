
import React, { useRef } from 'react';
import { Calendar, Camera, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUpdateProfileImage } from '@/hooks/useStudentProfile';

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
}

const ProfileHeader = ({ studentInfo, avatar }: ProfileHeaderProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const updateImage = useUpdateProfileImage();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      toast.error('Only PNG, JPEG or WEBP images are allowed');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      updateImage.mutate(imageData, {
        onSuccess: (res) =>
          res.status === 'success'
            ? toast.success('Profile image updated')
            : toast.error(res.message || 'Failed to update image'),
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || 'Failed to update image'),
        onSettled: () => {
          if (fileRef.current) fileRef.current.value = '';
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    if (!avatar) return;
    updateImage.mutate(null, {
      onSuccess: (res) =>
        res.status === 'success'
          ? toast.success('Profile image removed')
          : toast.error(res.message || 'Failed to remove image'),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || 'Failed to remove image'),
    });
  };

  const initials = studentInfo.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold">My Profile</h1>
        <div className="text-sm text-muted-foreground flex items-center mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{studentInfo.session}</span>
        </div>
      </div>
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-card p-6 flex flex-col items-center">
            <div className="relative mb-3">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                {avatar ? (
                  <AvatarImage src={avatar} alt={studentInfo.name} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {initials || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={updateImage.isPending}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 shadow ring-2 ring-background hover:bg-primary/90 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            {updateImage.isPending && (
              <p className="text-xs text-muted-foreground mb-2">Saving profile image…</p>
            )}
            {avatar && !updateImage.isPending && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleRemove}
                className="text-xs text-muted-foreground mb-2 h-auto py-1"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove photo
              </Button>
            )}

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
