
import React from 'react';
import { Eye, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const ProfileFormActions = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        <Eye className="mr-2" size={18} />
        Review and Update
      </Button>
      
      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Print Profile Records
        </Button>
        <Button
          type="button"
          className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Print Medical Records
        </Button>
      </div>

      <Button
        type="button"
        className="w-full py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors mt-4"
        onClick={() => signOut()}
      >
        <LogOut className="mr-2" size={18} />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileFormActions;
