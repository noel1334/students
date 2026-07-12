// src/pages/ResetPassword.tsx
import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, KeyRound, ArrowLeft, AlertTriangle } from 'lucide-react';
import api, { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = params.get('token') || '';
  const emailHint = params.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationError = useMemo(() => {
    if (!password) return null;
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Include at least one number.';
    if (confirm && password !== confirm) return 'Passwords do not match.';
    return null;
  }, [password, confirm]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg border text-center">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Invalid reset link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing or malformed. Please request a new
            one.
          </p>
          <Button asChild className="w-full">
            <Link to="/forgot-password">Request a new link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError || password !== confirm) return;
    setIsLoading(true);
    try {
      await api.post(endpoints.auth.resetPassword, {
        token,
        password,
      });
      toast({
        title: 'Password updated',
        description: 'You can now sign in with your new password.',
      });
      navigate('/login', { replace: true });
    } catch (error: any) {
      toast({
        title: 'Reset failed',
        description:
          error?.response?.data?.message ||
          'This reset link may have expired. Please request a new one.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border">
        <div className="text-center">
          <h1 className="mt-2 text-3xl font-bold text-primary">Set a new password</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {emailHint
              ? `Choose a new password for ${emailHint}.`
              : 'Choose a strong new password to secure your account.'}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password">New password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your new password"
              required
              className="mt-1"
            />
          </div>

          {validationError && (
            <p className="text-sm text-destructive" role="alert">
              {validationError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full py-3"
            disabled={isLoading || !!validationError || !password || !confirm}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isLoading ? 'Updating…' : 'Update password'}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center">
              <ArrowLeft className="mr-1 h-3 w-3" /> Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;