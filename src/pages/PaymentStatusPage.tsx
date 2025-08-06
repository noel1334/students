// src/pages/PaymentStatusPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// --- IMPORT THE NEW FUNCTION ---
import { completeSchoolFeeStripePayment, handleStripeCancellation } from '@/services/feeApiService';

type Status = 'verifying' | 'success' | 'failed' | 'cancelled';

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('Please wait...');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentStatus = searchParams.get('status');
    const schoolFeeId = searchParams.get('school_fee_id'); // For cancellation

    const processPayment = async () => {
        // --- THIS IS THE UPDATED LOGIC ---
        if (paymentStatus === 'cancelled') {
            setStatus('cancelled');
            setMessage('Your payment was cancelled. You have not been charged.');
            if (schoolFeeId) {
                // Also call the cleanup function in the background.
                // We don't need to wait for it or show an error if it fails.
                handleStripeCancellation(schoolFeeId);
            }
            return;
        }

        if (sessionId) {
            setMessage('Payment successful. Verifying transaction...');
            try {
                await completeSchoolFeeStripePayment(sessionId);
                setStatus('success');
                setMessage('Your payment has been successfully recorded. Thank you!');
            } catch (error: any) {
                setStatus('failed');
                setMessage(error.message || 'Verification failed. Please contact support.');
            }
        } else {
            setStatus('failed');
            setMessage('Invalid payment session. Could not verify payment.');
        }
    };
    
    processPayment();
  }, [searchParams]);

  const StatusDisplay = () => {
    switch (status) {
      case 'verifying':
        return {
          icon: <Loader2 className="h-16 w-16 animate-spin text-blue-500" />,
          title: 'Verifying Payment',
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-gray-500" />,
          title: 'Payment Cancelled',
        };
      case 'failed':
      default:
        return {
          icon: <AlertTriangle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
        };
    }
  };

  const { icon, title } = StatusDisplay();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{icon}</div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="pt-2">{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button asChild className="mt-4">
            <Link to="/payments">Return to Payment Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusPage;