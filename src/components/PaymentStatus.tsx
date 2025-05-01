
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

type Payment = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
};

const PaymentStatus = () => {
  // This would come from an API in a real application
  const payments: Payment[] = [
    {
      id: '1',
      description: 'Tuition Fee (First Semester)',
      amount: 120000,
      dueDate: '2023-09-15',
      status: 'paid',
    },
    {
      id: '2',
      description: 'Technology Fee',
      amount: 25000,
      dueDate: '2023-09-30',
      status: 'paid',
    },
    {
      id: '3',
      description: 'Library Fee',
      amount: 10000,
      dueDate: '2023-10-15',
      status: 'pending',
    },
    {
      id: '4',
      description: 'Tuition Fee (Second Semester)',
      amount: 120000,
      dueDate: '2024-01-15',
      status: 'overdue',
    },
  ];

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

  // Calculate total amounts
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
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
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Due Date</th>
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{payment.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">₦{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Badge variant="outline" className={`px-2 py-1 capitalize ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default PaymentStatus;
