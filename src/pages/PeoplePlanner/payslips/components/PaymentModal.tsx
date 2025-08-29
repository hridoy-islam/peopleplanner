import React, { useState } from 'react';
import { Banknote, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceAmount: number;
  userInfo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  date: string;
  reference: string;
  notes: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  invoiceAmount,
  userInfo
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>(
    invoiceAmount.toString()
  );
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [existingPayments, setExistingPayments] = useState<PaymentRecord[]>([]);
  const { toast } = useToast();

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'bank', label: 'Bank Transfer/Cheque', icon: Banknote }
  ];

  // Totals
  const totalPaid = existingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const remainingAmount = Math.max(invoiceAmount - totalPaid, 0);
  const currentPaymentAmount = parseFloat(paymentAmount) || 0;

  // For preview
  const newRemaining = Math.max(
    invoiceAmount - (totalPaid + currentPaymentAmount),
    0
  );

  // Status
  const isFullPayment = remainingAmount === 0;
  const isPartialPayment = totalPaid > 0 && remainingAmount > 0;

  const handleSubmit = () => {
    if (!paymentAmount || !paymentMethod || !paymentDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (currentPaymentAmount > remainingAmount) {
      toast({
        title: 'Error',
        description: 'Payment amount cannot exceed remaining balance',
        variant: 'destructive'
      });
      return;
    }

    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      amount: currentPaymentAmount,
      method: paymentMethod,
      date: paymentDate,
      reference,
      notes
    };

    setExistingPayments((prev) => [...prev, newPayment]);

    const afterRemaining = Math.max(
      invoiceAmount - (totalPaid + currentPaymentAmount),
      0
    );

    const paymentStatus =
      afterRemaining <= 0
        ? 'Fully Paid'
        : afterRemaining < invoiceAmount
        ? 'Partially Paid'
        : 'Unpaid';

    toast({
      title: 'Payment Recorded',
      description: `Payment of $${currentPaymentAmount.toLocaleString()} recorded. Status: ${paymentStatus}`
    });

    // Reset only form fields, not history
    setPaymentAmount(invoiceAmount.toString());
    setPaymentMethod('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setReference('');
    setNotes('');
    onClose()
  };

  const getPaymentStatusColor = () => {
    if (isFullPayment) return 'bg-green-100 text-green-800';
    if (isPartialPayment) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPaymentStatusText = () => {
    if (isFullPayment) return 'Fully Paid';
    if (isPartialPayment) return 'Partially Paid';
    return 'Unpaid';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment
          </DialogTitle>
          <DialogDescription>
            Record payment information for the payslip
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
              {userInfo && (
                <CardDescription>Payment for {userInfo.name}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <div className="text-xs font-bold text-blue-800">
                    Invoice Total
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    ${invoiceAmount.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 p-3 text-center">
                  <div className="text-xs font-bold text-green-800">Paid</div>
                  <div className="text-lg font-bold text-green-600">
                    ${totalPaid.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-lg bg-purple-50 p-3 text-center">
                  <div className="mt-1 text-xs font-bold text-purple-800">
                    Status
                  </div>
                  <Badge className={getPaymentStatusColor()}>
                    {getPaymentStatusText()}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-yellow-50 p-2 text-center">
                <div className="text-xs font-bold text-yellow-800">
                  Remaining Balance
                </div>
                <div className="text-md font-bold text-yellow-600">
                  ${remainingAmount.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Payment Amount *</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <div className="text-xs text-gray-500">
                    Max: ${remainingAmount.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Payment Date *</Label>
                  <Input
                    id="payment-date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional payment notes"
                  rows={3}
                />
              </div>

             
            </CardContent>
          </Card>

          {/* Existing Payments */}
          {existingPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {existingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded bg-gray-50 p-2"
                    >
                      <div className="text-sm">
                        <div className="font-medium">
                          ${payment.amount.toLocaleString()}
                        </div>
                        <div className="text-gray-600">
                          {payment.method} • {payment.date}
                        </div>
                        {payment.notes && (
                          <div className="text-xs text-gray-500">
                            Note: {payment.notes}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="default"
                        className="bg-supperagent text-white hover:bg-supperagent/90"
                      >
                        Recorded
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-supperagent text-white hover:bg-supperagent/90"
          >
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
