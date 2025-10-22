import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
    getApplicableSchoolFeesForStudent, 
    getMySchoolFeeRecords,
    createStripeSession, 
    verifyPaystackPayment, 
    verifyFlutterwavePayment,  
    deleteIncompletePayment 
} from '@/services/feeApiService';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCard, Download, Calendar, Loader2, AlertCircle } from 'lucide-react';
import PaystackPop from "@paystack/inline-js";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/hooks/use-toast";

// --- TYPE DEFINITIONS ---
export interface SchoolFeeRecord {
  id: number;
  amount: number;
  amountPaid: number;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED' | 'OVERDUE' | 'WAIVED';
  description: string | null;
  season: { id: number; name: string; };
  semester: { id: number; name: string; } | null;
  payments: PaymentReceipt[];
}

export interface PaymentReceipt {
  id: number;
  amountPaid: number;
  paymentDate: string;
  reference: string;
  channel: 'PAYSTACK' | 'FLUTTERWAVE' | 'STRIPE';
  description: string | null;
}

interface FlutterwaveConfig {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: { email: string; name: string; };
    customizations: { title: string; description: string; };
}

type GatewayKey = 'flutterwave' | 'paystack' | 'stripe';

// ============================================================================
// --- 1. DEDICATED RECEIPT COMPONENT ---
// This is the component that will be populated with data and printed.
// ============================================================================
const ReceiptComponent = forwardRef<HTMLDivElement, { record: SchoolFeeRecord | null, user: any }>(({ record, user }, ref) => {
    if (!record || !user) {
        return <div ref={ref}></div>;
    }

    const mostRecentPayment = record.payments?.[0];

    return (
        <div ref={ref} className="p-4 sm:p-6 md:p-10 font-sans text-gray-800 bg-white max-w-4xl mx-auto">
            <header className="flex flex-col gap-3 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">ScholarHub University</h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">123 University Drive, Knowledge City</p>
                    </div>
                    <div className="sm:text-right">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-600">PAYMENT RECEIPT</h2>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">Billed To</h3>
                    <p className="font-bold text-base sm:text-lg break-words">{user.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{user.regNo || 'N/A'}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{user.email}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{user.program?.name || 'N/A'}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{user.department?.name || 'N/A'}</p>
                </div>
                <div className="space-y-1 sm:text-right">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">Receipt Details</h3>
                    <p className="text-xs sm:text-sm break-words"><span className="font-semibold">Receipt No:</span> {mostRecentPayment?.reference || record.id}</p>
                    <p className="text-xs sm:text-sm"><span className="font-semibold">Payment Date:</span> {mostRecentPayment ? new Date(mostRecentPayment.paymentDate).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-xs sm:text-sm"><span className="font-semibold">Payment Method:</span> {mostRecentPayment?.channel || 'N/A'}</p>
                </div>
            </section>

            <section className="mt-6 sm:mt-8">
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-2 sm:p-3 grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
                        <div>Description</div>
                        <div>Session</div>
                        <div className="text-right">Amount</div>
                    </div>
                    <div className="p-2 sm:p-3 grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm">
                        <div className="break-words">{record.description || 'School Fees'}</div>
                        <div className="break-words text-xs sm:text-sm">{record.season.name}</div>
                        <div className="text-right font-semibold">₦{record.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </section>

            <section className="mt-4 sm:mt-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 max-w-sm sm:ml-auto">
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-semibold">Total Fee:</span>
                        <span>₦{record.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-semibold">Amount Paid:</span>
                        <span>₦{record.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t">
                        <span>Balance Due:</span>
                        <span className="text-blue-600">₦{(record.amount - record.amountPaid).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </section>

            <footer className="text-center text-xs sm:text-sm text-gray-500 mt-8 sm:mt-12 pt-4 sm:pt-6 border-t">
                <p>Thank you for your payment.</p>
                <p className="mt-1">© {new Date().getFullYear()} ScholarHub University. All rights reserved.</p>
            </footer>
        </div>
    );
});

// ============================================================================
// --- 2. PAYMENT STATUS COMPONENT (Now a presentational component) ---
// It receives data as props from the main Payments component.
// ============================================================================
const PaymentStatus = ({ records, loading, error }: { records: SchoolFeeRecord[], loading: boolean, error: string | null }) => {
    const summary = useMemo(() => {
        if (!records.length) return { totalFee: 0, totalAmountPaid: 0, balanceDue: 0 };
        const totalFee = records.reduce((sum, record) => sum + record.amount, 0);
        const totalAmountPaid = records.reduce((sum, record) => sum + record.amountPaid, 0);
        return { totalFee, totalAmountPaid, balanceDue: totalFee - totalAmountPaid };
    }, [records]);

    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /><span className="ml-2">Fetching payment history...</span></div>;
    if (error) return <div className="flex items-center gap-2 p-4 border border-red-300 bg-red-50 rounded-md"><AlertCircle className="h-5 w-5 text-red-600" /><p className="text-red-700">{error}</p></div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard title="Total Fee" amount={summary.totalFee} />
                <SummaryCard title="Amount Paid" amount={summary.totalAmountPaid} variant="success" />
                <SummaryCard title="Balance Due" amount={summary.balanceDue} variant="danger" />
            </div>
            
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
                <h3 className="font-semibold text-base mb-3">Transaction History</h3>
                {records.length > 0 ? (
                    records.map((record) => (
                        <Card key={record.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{record.description || 'School Fees'}</p>
                                        <p className="text-xs text-gray-600 mt-1">{record.season.name}</p>
                                    </div>
                                    <StatusBadge status={record.paymentStatus} />
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <span className="text-sm text-gray-600">Amount:</span>
                                    <span className="font-bold text-lg">₦{record.amount.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500 text-sm">
                            No payment history found.
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-b"><h3 className="font-semibold text-base">Transaction History</h3></div>
                {records.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="p-3 font-medium">Description</th>
                                    <th className="p-3 font-medium">Amount</th>
                                    <th className="p-3 font-medium">Season</th>
                                    <th className="p-3 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                        <td className="p-3">{record.description || 'School Fees'}</td>
                                        <td className="p-3">₦{record.amount.toLocaleString()}</td>
                                        <td className="p-3">{record.season.name}</td>
                                        <td className="p-3 text-center"><StatusBadge status={record.paymentStatus} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : ( <p className="p-4 text-center text-gray-500 text-sm">No payment history found.</p> )}
            </div>
        </div>
    );
};

// --- Helper Sub-components (kept as they are) ---
const SummaryCard = ({ title, amount, variant = 'default' }: { title: string, amount: number, variant?: 'default' | 'success' | 'danger' }) => {
    const colorClasses = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
    };
    return (
        <Card className={`${colorClasses[variant]} border-none`}>
            <CardContent className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium opacity-80 mb-1">{title}</p>
                <p className="text-xl sm:text-2xl font-bold">₦{amount.toLocaleString()}</p>
            </CardContent>
        </Card>
    );
};

const StatusBadge = ({ status }: { status: SchoolFeeRecord['paymentStatus'] }) => {
    const statusStyles: { [key in SchoolFeeRecord['paymentStatus']]: string } = {
        PAID: 'bg-green-100 text-green-800 hover:bg-green-200',
        PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        PARTIAL: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        OVERDUE: 'bg-red-100 text-red-800 hover:bg-red-200',
        CANCELLED: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        WAIVED: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    };
    return <Badge variant="outline" className={`capitalize ${statusStyles[status]}`}>{status.toLowerCase().replace('_', ' ')}</Badge>;
};

const GatewaySelector = ({ gateways, selectedGateway, onSelectGateway, isProcessing }: { gateways: GatewayKey[], selectedGateway: GatewayKey | null, onSelectGateway: (gateway: GatewayKey) => void, isProcessing: boolean }) => {
    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select a Gateway:</p>
            {gateways.map(gateway => (
                <Button key={gateway} variant="outline" className={`w-full justify-start text-left h-12 ${selectedGateway === gateway ? 'bg-primary/10 border-primary' : ''}`} onClick={() => onSelectGateway(gateway)} disabled={isProcessing}>
                    <CreditCard className="h-5 w-5 mr-3" /><span className="font-semibold">Pay with {gateway.charAt(0).toUpperCase() + gateway.slice(1)}</span>
                </Button>
            ))}
        </div>
    );
};

// ============================================================================
// --- 3. MAIN PAYMENTS COMPONENT ---
// ============================================================================
const Payments = () => {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const receiptRef = useRef<HTMLDivElement>(null);

    // --- State for "Current Fees" section ---
    const [currentBalance, setCurrentBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- State for "Payment History" section ---
    const [paymentRecords, setPaymentRecords] = useState<SchoolFeeRecord[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState<string | null>(null);
    
    // --- Other State ---
    const [selectedSemester, setSelectedSemester] = useState('1st');
    const [selectedSession, setSelectedSession] = useState('2023/2024');
    const [seasonId, setSeasonId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<GatewayKey | null>(null);

    // --- Logic for Printing ---
    // Find the most recent record that has been successfully paid.
    const latestPaidRecord = useMemo(() => {
        return [...paymentRecords]
            .filter(record => record.paymentStatus === 'PAID' && record.payments.length > 0)
            .sort((a, b) => new Date(b.payments[0].paymentDate).getTime() - new Date(a.payments[0].paymentDate).getTime())[0];
    }, [paymentRecords]);

    // Check if the current season has been fully paid
    const hasCurrentSeasonBeenPaid = useMemo(() => {
        if (!user?.currentSeasonId || !paymentRecords.length) return false;
        
        const currentSeasonRecord = paymentRecords.find(
            record => record.season.id.toString() === user.currentSeasonId
        );
        
        return currentSeasonRecord?.paymentStatus === 'PAID';
    }, [paymentRecords, user?.currentSeasonId]);

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        documentTitle: `Payment_Receipt_${latestPaidRecord?.season?.name || 'current'}`,
    });

    // --- Data Fetching and Handlers ---
    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const response = await getMySchoolFeeRecords();
            if (response.status === 'success' && response.data?.records) {
                setPaymentRecords(response.data.records);
            } else { setHistoryError(response.message || 'Failed to fetch payment history.'); }
        } catch (err: any) { setHistoryError(err.message || 'An unexpected error occurred.');
        } finally { setHistoryLoading(false); }
    }, []);

    const fetchCurrentBalance = useCallback(async () => {
        if (!user || !seasonId) return;
        setLoading(true); setError(null);
        try {
            const response = await getApplicableSchoolFeesForStudent(parseInt(seasonId, 10));
            if (response.status === 'success' && response.data) {
                const totalAmount = response.data.items.reduce((sum, fee) => sum + fee.amount, 0);
                setCurrentBalance(totalAmount);
            } else { setError(response.message || 'Failed to fetch school fees'); setCurrentBalance(0); }
        } catch (err: any) { setError(err.response?.data?.message || err.message || 'An error occurred while fetching fees.'); setCurrentBalance(0);
        } finally { setLoading(false); }
    }, [user, seasonId]);

    const closePaymentMethodModal = () => {
        setPaymentMethodModalOpen(false);
        setSelectedPaymentMethod(null);
        setIsProcessing(false);
    };

    const handlePaymentFailure = useCallback((error: any, gateway: string) => {
        setIsProcessing(false);
        const errorMessage = typeof error === 'string' ? error : (error.message || "An unknown error occurred.");
        toast({ title: `${gateway} Payment Failed`, description: errorMessage, variant: "destructive" });
    }, [toast]);

    const handlePaymentSuccess = useCallback(async (gateway: string) => {
        setIsProcessing(false);
        toast({ title: "Payment Verified!", description: `Your payment via ${gateway} has been successfully recorded.` });
        await fetchCurrentBalance(); 
        await fetchHistory();
        closePaymentMethodModal();
    }, [toast, fetchCurrentBalance, fetchHistory]);

    useEffect(() => {
        if (user) {
            if (user.currentSeasonId) setSeasonId(user.currentSeasonId.toString());
            if (user.currentSeasonName) setSelectedSession(user.currentSeasonName);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && seasonId) {
            fetchCurrentBalance();
            fetchHistory();
        }
    }, [authLoading, seasonId, fetchCurrentBalance, fetchHistory]);

    const openPaymentMethodModal = () => setPaymentMethodModalOpen(true);
    
    const handleProceedToPayment = async () => {
        if (!selectedPaymentMethod) {
            toast({ title: "No Gateway Selected", description: "Please select a payment gateway to proceed.", variant: "destructive" });
            return;
        }
        setIsProcessing(true); setError(null);
        switch (selectedPaymentMethod) {
            case 'stripe': await initiateStripePayment(); break;
            case 'paystack': initiatePaystackPayment(); break;
            case 'flutterwave': initiateFlutterwavePayment(); break;
            default: handlePaymentFailure("Invalid payment method selected.", "System");
        }
    };
 const initiateStripePayment = async () => {
    if (!user?.email || !user?.name || !seasonId) {
        return handlePaymentFailure("User details or academic session are missing.", "Stripe");
    }
    try {
        const stripeData = await createStripeSession(
            parseInt(user.id),
            parseInt(seasonId, 10),
            1,
            currentBalance,
            'STRIPE',
            `School fees for ${selectedSession}`,
            user.email,
            user.name
        );

        if (!stripeData.sessionId) throw new Error("Stripe session ID was not returned.");

        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
        if (!stripe) throw new Error("Stripe.js failed to load.");


        const { error } = await stripe.redirectToCheckout({ sessionId: stripeData.sessionId });
        if (error) throw new Error(error.message);
        


    } catch (error) {
        handlePaymentFailure(error, "Stripe");
    }
};




    const initiatePaystackPayment = () => {
        if (!user?.email) {
            return handlePaymentFailure("User email is required for Paystack.", "Paystack");
        }
        try {
            const paystack = new PaystackPop();
            paystack.newTransaction({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY!,
                email: user.email,
                amount: currentBalance * 100, // Paystack uses kobo
                ref: `UMS_SF_${Date.now()}`,
                onSuccess: async (transaction) => {
                    try {
                        toast({ title: "Payment Successful, Verifying..." });
                        await verifyPaystackPayment(transaction.reference, {
                            studentId: user.id,
                            amount: currentBalance,
                            seasonId: parseInt(seasonId!, 10),
                            semesterId: 1, // Example semester ID
                        });
                        await handlePaymentSuccess("Paystack");
                    } catch (verificationError) {
                        handlePaymentFailure(verificationError, 'Paystack Verification');
                    }
                },
                onCancel: () => {
                    handlePaymentFailure("Payment was cancelled by user.", 'Paystack');
                },
            });
        } catch (error) {
            handlePaymentFailure(error, "Paystack");
        }
    };

    const flutterwaveConfig = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY!,
        tx_ref: `UMS_SF_${Date.now()}`,
        amount: currentBalance,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: {
            email: user?.email || '',
            phone_number: '0000000000',
            name: user?.name || '',
        },
        customizations: {
            title: 'University School Fees',
            description: `Payment for ${selectedSession} session`,
            logo: '',
        },
    };

    const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

    const initiateFlutterwavePayment = () => {
        if (!user?.email || !user?.name) {
            return handlePaymentFailure("User details are missing.", "Flutterwave");
        }
        handleFlutterwavePayment({
            callback: async (response) => {
                closePaymentModal();
                if (response.status === "successful") {
                    try {
                        toast({ title: "Payment Successful, Verifying..." });
                        await verifyFlutterwavePayment(String(response.transaction_id), flutterwaveConfig.tx_ref, {
                            studentId: user.id,
                            amount: currentBalance,
                            seasonId: parseInt(seasonId!, 10),
                            semesterId: 1, // Example semester ID
                        });
                        await handlePaymentSuccess("Flutterwave");
                    } catch (verificationError) {
                        handlePaymentFailure(verificationError, "Flutterwave Verification");
                    }
                } else {
                    handlePaymentFailure("Payment was not completed.", "Flutterwave");
                }
            },
            onClose: () => {
                handlePaymentFailure("Payment modal closed by user.", 'Flutterwave');
            },
        });
    };


    return (
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto bg-background print:hidden">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6">Payment Dashboard</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <Card className="col-span-1 lg:col-span-2 shadow-sm">
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Calendar size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />Payment History & Receipts</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">View your past payments and download receipts.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4">
                                    <Button onClick={handlePrint} variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm" disabled={!latestPaidRecord || historyLoading}>
                                        <Download size={14} className="mr-2 sm:w-4 sm:h-4" />
                                        Download Latest Receipt
                                    </Button>
                                </div>
                                <PaymentStatus records={paymentRecords} loading={historyLoading} error={historyError} />
                            </CardContent>
                        </Card>

                        <div className="space-y-4 sm:space-y-6">
                            <Card className="shadow-sm">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><CreditCard size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />Current Fees</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Outstanding balance for {selectedSession}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    {loading ? ( <div className="flex items-center justify-center h-24"><Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" /></div>
                                    ) : error ? ( <p className="text-xs sm:text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                                    ) : (
                                        <>
                                            <div className="bg-primary/5 p-3 sm:p-4 rounded-lg text-center"><p className="text-xs sm:text-sm text-gray-600">Amount Due</p><p className="text-2xl sm:text-3xl font-bold text-gray-900">₦{currentBalance.toLocaleString()}</p></div>
                                            {!hasCurrentSeasonBeenPaid && (
                                                <Button className="w-full mt-3 sm:mt-4 text-sm" size="sm" disabled={loading || currentBalance === 0} onClick={openPaymentMethodModal}><CreditCard size={16} className="mr-2" />Make Payment</Button>
                                            )}
                                            {hasCurrentSeasonBeenPaid && (
                                                <div className="mt-3 sm:mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                                    <p className="text-xs sm:text-sm text-green-700 font-medium">✓ Payment Complete</p>
                                                    <p className="text-xs text-green-600 mt-1">You have paid for this session</p>
                                                </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* This div holds the receipt component but is positioned off-screen for printing */}
                <div className="fixed -left-[9999px] top-0 print:static print:left-0">
                    <ReceiptComponent ref={receiptRef} record={latestPaidRecord} user={user} />
                </div>

                <AlertDialog open={paymentMethodModalOpen} onOpenChange={setPaymentMethodModalOpen}>
                    <AlertDialogContent className="max-w-[90vw] sm:max-w-md mx-auto print:hidden">
                        <AlertDialogHeader><AlertDialogTitle className="text-base sm:text-lg">Complete Your Payment</AlertDialogTitle><AlertDialogDescription className="text-xs sm:text-sm">Select a secure payment gateway to pay your fees.</AlertDialogDescription></AlertDialogHeader>
                        <div className="py-2 space-y-1">
                            <div className="flex justify-between text-xs sm:text-sm"><span className="text-gray-500">Payment for:</span><span className="font-medium">School Fees</span></div>
                            <div className="flex justify-between text-base sm:text-lg"><span className="text-gray-600">Amount:</span><span className="font-bold text-gray-900">₦{currentBalance.toLocaleString()}</span></div>
                        </div>
                        <GatewaySelector gateways={['paystack', 'flutterwave', 'stripe']} selectedGateway={selectedPaymentMethod} onSelectGateway={(method) => setSelectedPaymentMethod(method as GatewayKey)} isProcessing={isProcessing}/>
                        <AlertDialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                            <AlertDialogCancel onClick={closePaymentMethodModal} disabled={isProcessing} className="w-full sm:w-auto text-sm">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleProceedToPayment} disabled={!selectedPaymentMethod || isProcessing} className="w-full sm:w-auto text-sm">
                                {isProcessing ? (<><Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />Processing...</>) : (`Pay with ${selectedPaymentMethod || '...'}`)}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default Payments;