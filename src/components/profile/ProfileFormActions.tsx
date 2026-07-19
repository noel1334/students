
import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChangePasswordDialog from './ChangePasswordDialog';

interface Props {
  disabled?: boolean;
}

const ProfileFormActions: React.FC<Props> = ({ disabled }) => {
  return (
    <>
      {/* Sticky mobile action bar */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button type="submit" className="w-full" disabled={disabled}>
          <Eye className="mr-2" size={16} /> Review and Update
        </Button>
      </div>

      <div className="hidden sm:flex flex-col gap-4">
        <Button type="submit" className="w-full py-3" disabled={disabled}>
          <Eye className="mr-2" size={18} />
          Review and Update
        </Button>
        <ChangePasswordDialog />
      </div>
      <div className="sm:hidden">
        <ChangePasswordDialog />
      </div>
    </>
  );
};

export default ProfileFormActions;
