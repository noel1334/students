// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api, { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post(endpoints.auth.forgotPassword, { identifier });
      setSubmitted(true);
    } catch (error: any) {
      // Still show the generic success state to avoid account enumeration,
      // but surface network/server errors via toast.
      const status = error?.response?.status;
      if (status && status >= 500) {
        toast({
          title: 'Something went wrong',
          description:
            error?.response?.data?.message ||
            'We could not process your request. Please try again.',
          variant: 'destructive',
        });
      } else {
        setSubmitted(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border">
        <div className="text-center">
          <h1 className="mt-2 text-3xl font-bold text-primary">Forgot password?</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Enter your registration or JAMB number and we'll send a reset link to
            the email on your account.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              If an account matches <span className="font-medium text-foreground">{identifier}</span>,
              a password reset link has been sent to the email on file. The link
              expires shortly for your security.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="identifier">Registration Number / JAMB Number</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your RegNo or JAMB Number"
                required
                className="mt-1"
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full py-3" disabled={isLoading || !identifier}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? 'Sending link…' : 'Send reset link'}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center">
                <ArrowLeft className="mr-1 h-3 w-3" /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;