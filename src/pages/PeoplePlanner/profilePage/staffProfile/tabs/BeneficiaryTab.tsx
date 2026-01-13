import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EditableField } from '../components/EditableField';
import { countries } from '@/types';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface BeneficiaryTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: string, formData: Record<string, any>) => string[];
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const BeneficiaryTab: React.FC<BeneficiaryTabProps> = ({
  formData,
  onUpdate,
  isFieldSaving,
  getMissingFields,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Local state to hold changes
  const [localFormData, setLocalFormData] = useState(formData);

  // Sync local state with global state when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalFormData(formData);
    }
  }, [formData, isEditing]);

  // Helper to safely get beneficiary object
  const beneficiary = localFormData.beneficiary || {
    fullName: '',
    relationship: '',
    email: '',
    mobile: '',
    sameAddress: false,
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postCode: '',
      country: ''
    }
  };

  const handleBeneficiaryChange = (field: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      beneficiary: {
        ...(prev.beneficiary || {}),
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      beneficiary: {
        ...(prev.beneficiary || {}),
        address: {
          ...(prev.beneficiary?.address || {}),
          [field]: value
        }
      }
    }));
  };

  const handleDone = async () => {
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {};
      
      // Check if beneficiary object has changed
      // Simple JSON comparison for the nested object
      if (JSON.stringify(localFormData.beneficiary) !== JSON.stringify(formData.beneficiary)) {
        updates.beneficiary = localFormData.beneficiary;
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

  const relationshipOptions = [
    { value: 'Parent', label: 'Parent' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Child', label: 'Child' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' }
  ];

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country
  }));

  return (
    <Card>
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Beneficiary Information</h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleDone}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-md bg-supperagent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-supperagent/90 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
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
            id="beneficiary.fullName"
            label="Full Name"
            value={beneficiary.fullName}
            onUpdate={(value) => handleBeneficiaryChange('fullName', value)}
            editing={isEditing}
          />

          <EditableField
            id="beneficiary.relationship"
            label="Relationship"
            value={beneficiary.relationship}
            type="select"
            options={relationshipOptions}
            onUpdate={(value) => handleBeneficiaryChange('relationship', value)}
            editing={isEditing}
          />

          <EditableField
            id="beneficiary.email"
            label="Email"
            type="email"
            value={beneficiary.email}
            onUpdate={(value) => handleBeneficiaryChange('email', value)}
            editing={isEditing}
          />

          <EditableField
            id="beneficiary.mobile"
            label="Mobile"
            value={beneficiary.mobile}
            onUpdate={(value) => handleBeneficiaryChange('mobile', value)}
            editing={isEditing}
          />

          <div className="">
            <EditableField
              id="beneficiary.sameAddress"
              label="Same as Employee Address"
              value={beneficiary.sameAddress}
              type="checkbox"
              onUpdate={(checked) => handleBeneficiaryChange('sameAddress', checked)}
              editing={isEditing}
            />
          </div>
          <div></div>

          {!beneficiary.sameAddress && (
            <>
              <div >
                <EditableField
                  id="beneficiary.address.line1"
                  label="Address Line 1"
                  value={beneficiary.address?.line1}
                  onUpdate={(value) => handleAddressChange('line1', value)}
                  editing={isEditing}
                />
              </div>

              <div >
                <EditableField
                  id="beneficiary.address.line2"
                  label="Address Line 2"
                  value={beneficiary.address?.line2}
                  onUpdate={(value) => handleAddressChange('line2', value)}
                  editing={isEditing}
                />
              </div>

              <EditableField
                id="beneficiary.address.city"
                label="City"
                value={beneficiary.address?.city}
                onUpdate={(value) => handleAddressChange('city', value)}
                editing={isEditing}
              />

              <EditableField
                id="beneficiary.address.state"
                label="State"
                value={beneficiary.address?.state}
                onUpdate={(value) => handleAddressChange('state', value)}
                editing={isEditing}
              />

              <EditableField
                id="beneficiary.address.postCode"
                label="Post Code"
                value={beneficiary.address?.postCode}
                onUpdate={(value) => handleAddressChange('postCode', value)}
                editing={isEditing}
              />

              <EditableField
                id="beneficiary.address.country"
                label="Country"
                value={beneficiary.address?.country}
                type="select"
                options={countryOptions}
                onUpdate={(value) => handleAddressChange('country', value)}
                editing={isEditing}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryTab;