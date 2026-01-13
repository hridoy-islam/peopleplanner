import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface PayrollTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  isFieldSaving: Record<string, boolean>;
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const PayrollTab: React.FC<PayrollTabProps> = ({
  formData,
  onUpdate,
  isFieldSaving,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Local state to hold changes before saving
  const [localFormData, setLocalFormData] = useState(formData);

  // Sync local state with global state when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalFormData(formData);
    }
  }, [formData, isEditing]);

  // Helper to safely get payroll object
  const payroll = localFormData.payroll || {};

  const handlePayrollChange = (field: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      payroll: {
        ...(prev.payroll || {}),
        [field]: value
      }
    }));
  };

  const handleDone = async () => {
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {};

      // Check if payroll object has changed
      if (JSON.stringify(localFormData.payroll) !== JSON.stringify(formData.payroll)) {
        updates.payroll = localFormData.payroll;
      }

      if (Object.keys(updates).length > 0 && onSave) {
        await onSave(updates);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save changes", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalFormData(formData); // Revert changes
    setIsEditing(false);
  };

  const paymentMethodOptions = [
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Cash', label: 'Cash' }
  ];

  const paymentMethod = payroll.paymentMethod || '';

  return (
    <Card>
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Payroll Information
        </h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleDone}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-md bg-supperagent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-supperagent/90 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Done
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-70"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
          )}
        </div>
      </div>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Payroll Number */}
          <EditableField
            id="payrollNumber"
            label="Payroll Number"
            value={payroll.payrollNumber || ''}
            onUpdate={(value) => handlePayrollChange('payrollNumber', value)}
            editing={isEditing}
          />

          {/* Payment Method */}
          <EditableField
            id="paymentMethod"
            label="Payment Method"
            value={paymentMethod}
            type="select"
            options={paymentMethodOptions}
            onUpdate={(value) => handlePayrollChange('paymentMethod', value)}
            editing={isEditing}
          />

          {/* Conditional Bank Fields */}
          {paymentMethod === 'Bank Transfer' && (
            <>
              <EditableField
                id="bankName"
                label="Bank Name"
                value={payroll.bankName || ''}
                onUpdate={(value) => handlePayrollChange('bankName', value)}
                editing={isEditing}
              />

              <EditableField
                id="accountNumber"
                label="Account Number"
                value={payroll.accountNumber || ''}
                onUpdate={(value) => handlePayrollChange('accountNumber', value)}
                editing={isEditing}
              />

              <EditableField
                id="sortCode"
                label="Sort Code"
                value={payroll.sortCode || ''}
                onUpdate={(value) => handlePayrollChange('sortCode', value)}
                editing={isEditing}
              />

              <EditableField
                id="beneficiary"
                label="Beneficiary Name"
                value={payroll.beneficiary || ''}
                onUpdate={(value) => handlePayrollChange('beneficiary', value)}
                editing={isEditing}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollTab;