
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: {
    first_name?: string;
    last_name?: string;
    name?: string;
    profileImage?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar = ({ user, size = 'md', className = '' }: UserAvatarProps) => {
  // Get user initials
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user.profileImage ? (
        <AvatarImage 
          src={user.profileImage} 
          alt={user.name || `${user.first_name} ${user.last_name}`}
        />
      ) : (
        <AvatarFallback className={`bg-primary/10 text-primary font-medium ${textSizeClasses[size]}`}>
          {getInitials()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
