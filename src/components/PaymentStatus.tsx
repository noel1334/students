
import React from 'react';
import { CreditCard, Download, AlertCircle } from 'lucide-react';

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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total amounts
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payment Status</h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
          <Download size={16} />
          <span>Receipt</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">Total Fee</p>
          <p className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">Amount Paid</p>
          <p className="text-2xl font-bold text-green-700">₦{paidAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">Amount Due</p>
          <p className="text-2xl font-bold text-red-700">₦{pendingAmount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Due Date</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-secondary/50">
                <td className="px-4 py-3">{payment.description}</td>
                <td className="px-4 py-3 text-right font-medium">₦{payment.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">{new Date(payment.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pendingAmount > 0 && (
        <div className="mt-4 flex items-center gap-2 p-3 border border-yellow-300 bg-yellow-50 rounded-md">
          <AlertCircle size={18} className="text-yellow-600" />
          <p className="text-sm text-yellow-700">
            You have outstanding payments. Please settle your fees to avoid late penalties.
          </p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          <CreditCard className="mr-2" size={18} />
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
