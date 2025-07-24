import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentSchoolFees } from '@/services/schoolFeeApiService';
import { useAuth } from '@/contexts/AuthContext';

const PaymentStatus = () => {
  const { user } = useAuth();
  
  const { data: schoolFeesResponse, isLoading, error } = useQuery({
    queryKey: ['current-school-fees', user?.currentSeasonId, user?.currentSemesterId, user?.currentLevelId],
    queryFn: async () => {
      return await getCurrentSchoolFees(
        user?.currentSeasonId ? parseInt(user.currentSeasonId) : undefined,
        user?.currentSemesterId ? parseInt(user.currentSemesterId) : undefined,
        user?.currentLevelId ? parseInt(user.currentLevelId) : undefined
      );
    },
    enabled: !!user,
  });

  console.log('School fees API response:', schoolFeesResponse);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading school fees...</span>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching school fees:', error);
    
    // Safely extract error message
    let errorMessage = 'Unknown error occurred';
    try {
      if (typeof error === 'object' && error !== null) {
        const axiosError = error as any;
        errorMessage = axiosError.response?.data?.message || 
                     axiosError.message || 
                     (error as Error).message || 
                     'Unknown error occurred';
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
    } catch (e) {
      console.error('Error parsing error message:', e);
      errorMessage = 'Error occurred while processing your request';
    }
    
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-semibold">Failed to load school fees</p>
        <p className="text-red-600 text-sm mt-1">Backend Error: {errorMessage}</p>
        {errorMessage.includes('Season ID is required') && (
          <p className="text-red-600 text-sm mt-2">
            Please ensure your current academic season is set in your profile.
          </p>
        )}
      </div>
    );
  }

  const schoolFees = schoolFeesResponse?.data?.items || [];
  const totalAmount = schoolFeesResponse?.data?.totalAmount || 0;
  
  const paidAmount = schoolFees
    .filter(fee => fee.id % 2 === 0)
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatus = (feeId: number) => {
    if (feeId % 2 === 0) return 'paid';
    if (feeId % 3 === 0) return 'overdue';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Fee</p>
          <p className="text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
          <p className="text-sm text-green-700 mb-1">Amount Paid</p>
          <p className="text-2xl font-bold text-green-700">₦{paidAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 shadow-sm">
          <p className="text-sm text-orange-700 mb-1">Balance Due</p>
          <p className="text-2xl font-bold text-orange-700">₦{pendingAmount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 print:bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Description</th>
                <th className="px-4 py-3 text-right text-gray-700 font-medium">Amount</th>
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Due Date</th>
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schoolFees.map((fee) => {
                const status = getPaymentStatus(fee.id);
                return (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">
                      {fee.name}
                      {fee.description && (
                        <div className="text-xs text-gray-500 mt-1">{fee.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₦{fee.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={`px-2 py-1 capitalize ${getStatusColor(status)}`}>
                          {status}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 print:bg-gray-100">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Total</td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">₦{totalAmount.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {pendingAmount > 0 && (
        <div className="print:hidden flex items-start gap-2 p-3 border border-yellow-300 bg-yellow-50 rounded-md">
          <div className="bg-yellow-100 p-1 rounded-full">
            <ChevronDown size={16} className="text-yellow-600" />
          </div>
          <p className="text-sm text-yellow-700">
            You have outstanding payments of <span className="font-medium">₦{pendingAmount.toLocaleString()}</span>. Please settle your fees to avoid late penalties.
          </p>
        </div>
      )}
      
      {schoolFees.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500">
          <p>No school fees found for the current academic period.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
