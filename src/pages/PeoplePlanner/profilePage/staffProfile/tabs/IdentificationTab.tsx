import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';
import moment from 'moment';

interface IdentificationTabProps {
  formData: any;
  onUpdate: (fieldName: string, value: any) => void;
  onDateChange: (fieldName: string, dateStr: string) => void;
  isFieldSaving: Record<string, boolean>;
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const IdentificationTab: React.FC<IdentificationTabProps> = ({
  formData,
  onDateChange,
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

  const handleLocalChange = (field: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDone = async () => {
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {};
      Object.keys(localFormData).forEach((key) => {
        if (localFormData[key] !== formData[key]) {
          updates[key] = localFormData[key];
        }
      });

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

  return (
    <Card>
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Identification</h3>
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
          <EditableField
            id="nationalInsuranceNumber"
            label="National Insurance Number"
            value={localFormData.nationalInsuranceNumber}
            onUpdate={(value) => handleLocalChange('nationalInsuranceNumber', value)}
            editing={isEditing}
          />

          <EditableField
            id="nhsNumber"
            label="NHS Number"
            value={localFormData.nhsNumber}
            onUpdate={(value) => handleLocalChange('nhsNumber', value)}
            editing={isEditing}
          />

          <EditableField
            id="passportNo"
            label="Passport Number"
            value={localFormData.passportNo}
            onUpdate={(value) => handleLocalChange('passportNo', value)}
            placeholder="Enter Passport No"
            editing={isEditing}
          />

          <EditableField
            id="passportExpiry"
            label="Passport Expiry Date"
            value={
              localFormData.passportExpiry
                ? moment(localFormData.passportExpiry).format('YYYY-MM-DD')
                : ''
            }
            type="date"
            onUpdate={(value) => handleLocalChange('passportExpiry', value)}
            required
            editing={isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificationTab;