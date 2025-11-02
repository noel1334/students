
import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfileFormActions = () => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="submit"
        className="w-full py-3"
      >
        <Eye className="mr-2" size={18} />
        Review and Update
      </Button>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 py-3"
        >
          Print Profile Records
        </Button>
        <Button
          type="button"
          className="flex-1 py-3"
        >
          Print Medical Records
        </Button>
      </div>
    </div>
  );
};

export default ProfileFormActions;
