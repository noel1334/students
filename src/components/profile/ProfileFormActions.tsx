
import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChangePasswordDialog from './ChangePasswordDialog';

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

      <ChangePasswordDialog />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:flex-1 py-3"
        >
          Print Profile Records
        </Button>
        <Button
          type="button"
          className="w-full sm:flex-1 py-3"
        >
          Print Medical Records
        </Button>
      </div>
    </div>
  );
};

export default ProfileFormActions;
