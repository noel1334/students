
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolFeeListResponse } from '@/services/schoolFeeApiService';

interface SchoolFeePaymentSummaryProps {
  schoolFeesData: SchoolFeeListResponse | null;
  renderPaymentButton: () => React.ReactNode;
}

export const SchoolFeePaymentSummary: React.FC<SchoolFeePaymentSummaryProps> = ({
  schoolFeesData,
  renderPaymentButton,
}) => {
  const { user } = useAuth();

  if (!schoolFeesData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Loading payment details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No payment data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = schoolFeesData.totalAmount;
  const studentInfo = schoolFeesData.student;
  const academicPeriod = schoolFeesData.academicPeriod;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
        <CardDescription>Review your payment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Student:</span>
            <span className="font-medium">{studentInfo?.name || user?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reg No:</span>
            <span className="font-medium">{studentInfo?.regNo || user?.regNo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level:</span>
            <span className="font-medium">{studentInfo?.level || user?.currentLevelName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Program:</span>
            <span className="font-medium">{studentInfo?.program || user?.programName}</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Academic Session:</span>
              <span className="font-medium">{academicPeriod?.season?.name || user?.currentSeasonName}</span>
            </div>
            {academicPeriod?.semester && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Semester:</span>
                <span className="font-medium">{academicPeriod.semester.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="pt-4">
          {renderPaymentButton()}
        </div>
      </CardContent>
    </Card>
  );
};
