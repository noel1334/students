
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getApplicableSchoolFeesForStudent, SchoolFeeListItem } from '@/services/feeApiService';
import { Button } from '@/components/ui/button';

const PaymentStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const [schoolFees, setSchoolFees] = useState<SchoolFeeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchoolFees = async () => {
    console.log('PaymentStatus: Fetching school fees...');
    console.log('PaymentStatus: User data:', user);
    
    if (authLoading) {
      console.log('PaymentStatus: Auth still loading...');
      return;
    }
    
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    if (!user.currentSeasonId) {
      setError('Current season information not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('PaymentStatus: Fetching school fees for season ID:', user.currentSeasonId);
      
      const response = await getApplicableSchoolFeesForStudent(parseInt(user.currentSeasonId));
      console.log('PaymentStatus: School fees response:', response);
      
      if (response.status === 'success' && response.data) {
        setSchoolFees(response.data.items);
        console.log('PaymentStatus: School fees set:', response.data.items);
      } else {
        const errorMessage = response.message || 'Failed to fetch school fees';
        console.error('PaymentStatus: API error:', errorMessage);
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('PaymentStatus: Error fetching school fees:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching school fees';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchSchoolFees();
    }
  }, [user?.currentSeasonId, authLoading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-4 border border-red-300 bg-red-50 rounded-md">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-600 mt-1">
              Please ensure you have a current academic season assigned or contact support.
            </p>
          </div>
          <Button 
            onClick={fetchSchoolFees}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-100"
          >
            <RefreshCw size={14} className="mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate total amounts from fetched school fees
  const totalAmount = schoolFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = 0; // This will be implemented later when payment tracking is added
  const pendingAmount = totalAmount - paidAmount;

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
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Level</th>
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schoolFees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No school fees found for the current session
                  </td>
                </tr>
              ) : (
                schoolFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">
                      {fee.description || 'School Fee'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₦{fee.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {fee.level.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Badge variant="outline" className="px-2 py-1 capitalize bg-yellow-100 text-yellow-800 border-yellow-200">
                          pending
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {schoolFees.length > 0 && (
              <tfoot className="bg-gray-50 print:bg-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-700">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">₦{totalAmount.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
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
    </div>
  );
};

export default PaymentStatus;
