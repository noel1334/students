import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { getMySchoolFeeRecords } from '@/services/feeApiService';
import { CreditCard, CheckCircle2, XCircle, Clock, Download, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['paymentRecords', user?.id],
    queryFn: getMySchoolFeeRecords,
    enabled: !!user?.id,
  });

  const records = Array.isArray(data?.data?.records) ? data.data.records : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const currentRecord = records.find(
    r => r.season.id.toString() === user?.currentSeasonId
  );

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Payments</h1>
          <p className="text-sm text-muted-foreground">Manage your school fees and payment history</p>
        </div>

        {/* Current Season Payment Status */}
        {currentRecord && (
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Current Season
                  </h2>
                  <p className="text-sm text-muted-foreground">{currentRecord.season.name}</p>
                </div>
                <Badge className={`${getStatusColor(currentRecord.paymentStatus)} border`}>
                  {currentRecord.paymentStatus}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount Due</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    ₦{currentRecord.expectedAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    ₦{currentRecord.amountPaid.toLocaleString()}
                  </p>
                </div>
              </div>

              {currentRecord.paymentStatus !== 'PAID' && (
                <Button 
                  className="w-full mt-2" 
                  size="lg"
                  onClick={() => navigate('/payments/status')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
              )}

              {currentRecord.paymentStatus === 'PAID' && currentRecord.receiptNumber && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Payment History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1">Payment History</h2>
          
          {records.length === 0 ? (
            <Card className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No payment records found</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <Card 
                  key={record.id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPayment(record)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(record.paymentStatus)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {record.season.name}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{record.semester.name}</span>
                        <span>•</span>
                        <span>{record.level.name}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Paid: </span>
                          <span className="font-semibold text-foreground">
                            ₦{record.amountPaid.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground"> / ₦{record.expectedAmount.toLocaleString()}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(record.paymentStatus)}`}
                        >
                          {record.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Payment Details Modal would go here if needed */}
      </div>
    </div>
  );
};

export default Payments;
