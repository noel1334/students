// src/pages/PaymentStatusPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import { completeSchoolFeeStripePayment, handleStripeCancellation } from '@/services/feeApiService';
import { completeHostelBookingStripePayment } from '@/services/hostelApiService';

type Status = 'verifying' | 'success' | 'failed' | 'cancelled';
type PaymentPurpose = 'schoolFee' | 'hostelBooking' | null;

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('Please wait while we verify your transaction...');
  const [redirectPath, setRedirectPath] = useState('/payments');
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const statusFromUrl = searchParams.get('status');
    const currentPurpose: PaymentPurpose = searchParams.get('purpose') as PaymentPurpose;
    const schoolFeeIdFromUrl = searchParams.get('school_fee_id');
    const relatedIdFromUrl = searchParams.get('related_id');

    setPaymentPurpose(currentPurpose);

    // FIXED: Dynamically route the redirect back to the correct dashboard path
    if (currentPurpose === 'hostelBooking') {
      if (relatedIdFromUrl) {
        setRedirectPath(`/hostel-bookings/${relatedIdFromUrl}`);
      } else {
        setRedirectPath('/hostel'); // Redirect back to Hostel page on general failure/fallback
      }
    } else {
      setRedirectPath('/payments');
    }

    const processPayment = async () => {
        if (statusFromUrl === 'cancelled') {
            setStatus('cancelled');
            setMessage('Your payment was cancelled. You have not been charged.');

            if (currentPurpose === 'schoolFee' && schoolFeeIdFromUrl) {
                try {
                    console.log(`Attempting cleanup for cancelled school fee ID: ${schoolFeeIdFromUrl}`);
                    await handleStripeCancellation(schoolFeeIdFromUrl);
                } catch (cleanupError) {
                    console.error(`Failed to perform cleanup for cancelled school fee ID ${schoolFeeIdFromUrl}:`, cleanupError);
                }
            }
            return;
        }

        if (!sessionId) {
            setStatus('failed');
            setMessage('Invalid payment session. No Stripe session ID found in the URL.');
            return;
        }

        if (!currentPurpose || (currentPurpose !== 'schoolFee' && currentPurpose !== 'hostelBooking')) {
            setStatus('failed');
            setMessage(`Unknown or missing payment purpose ("${currentPurpose || 'none'}"). Contact support.`);
            return;
        }

        try {
            setMessage(`Verifying ${currentPurpose === 'hostelBooking' ? 'hostel booking' : 'school fee'} payment...`);

            if (currentPurpose === 'schoolFee') {
                await completeSchoolFeeStripePayment(sessionId);
            } else if (currentPurpose === 'hostelBooking') {
                await completeHostelBookingStripePayment(sessionId);
            }

            setStatus('success');
            setMessage('Your payment has been successfully recorded. Thank you!');

        } catch (error: any) {
            setStatus('failed');
            setMessage(error.message || `Verification failed for ${currentPurpose}. Please contact support.`);
            console.error(`Error completing ${currentPurpose} payment for session ${sessionId}:`, error);
        }
    };

    processPayment();
  }, [searchParams, navigate]);

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
            <Link to={redirectPath}>
              Return to {paymentPurpose === 'hostelBooking' ? 'Hostel' : 'Payment'} Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusPage;