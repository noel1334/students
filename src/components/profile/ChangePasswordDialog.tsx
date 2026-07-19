import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { useChangePassword } from '@/hooks/useStudentProfile';
import { passwordSchema, passwordStrength } from '@/lib/validation/studentProfile';
import { z } from 'zod';

type FormValues = z.infer<typeof passwordSchema>;

const StrengthBar: React.FC<{ pw: string }> = ({ pw }) => {
  const { score, label } = passwordStrength(pw);
  const colors = ['bg-destructive', 'bg-destructive', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-600'];
  return (
    <div className="space-y-1">
      <div className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${i < score ? colors[score] : 'bg-muted'}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Strength: {label}</p>
    </div>
  );
};

const ChangePasswordDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [show, setShow] = useState(false);
  const mutation = useChangePassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const newPassword = form.watch('newPassword');

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await mutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (response.status === 'success') {
        toast.success('Password updated successfully');
        form.reset();
        setOpen(false);
      } else {
        toast.error(response.message || 'Failed to update password');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || '';
      if (error.response?.status === 401 || /current password/i.test(msg) || /incorrect/i.test(msg)) {
        form.setError('currentPassword', { message: msg || 'Current password is incorrect' });
      } else {
        toast.error(msg || 'Failed to update password');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset(); }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full py-3">
          <KeyRound className="mr-2" size={18} />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                {...form.register('currentPassword')}
                aria-invalid={!!form.formState.errors.currentPassword}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                aria-pressed={showCurrent}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">{form.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={show ? 'text' : 'password'}
                {...form.register('newPassword')}
                aria-invalid={!!form.formState.errors.newPassword}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={show ? 'Hide password' : 'Show password'}
                aria-pressed={show}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="text-xs text-destructive">{form.formState.errors.newPassword.message}</p>
            )}
            <StrengthBar pw={newPassword || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={show ? 'text' : 'password'}
              {...form.register('confirmPassword')}
              aria-invalid={!!form.formState.errors.confirmPassword}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;