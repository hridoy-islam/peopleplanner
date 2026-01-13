import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EditableField } from '../components/EditableField';
import { countries } from '@/types';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface ContactTabProps {
  formData: any;
  onUpdate: (fieldName: string, value: any) => void;
  onSelectChange: (fieldName: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const ContactTab: React.FC<ContactTabProps> = ({
  formData,
  onUpdate,
  onSelectChange,
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

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country
  }));

  return (
    <Card>
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Contact Information
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EditableField
            id="email"
            label="Email"
            value={localFormData.email}
            type="email"
            onUpdate={(value) => handleLocalChange('email', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="homePhone"
            label="Home Phone"
            value={localFormData.homePhone}
            onUpdate={(value) => handleLocalChange('homePhone', value)}
            editing={isEditing}
          />

          <EditableField
            id="mobilePhone"
            label="Mobile Phone"
            value={localFormData.mobilePhone}
            onUpdate={(value) => handleLocalChange('mobilePhone', value)}
            editing={isEditing}
          />

          <EditableField
            id="otherPhone"
            label="Other Phone"
            value={localFormData.otherPhone}
            onUpdate={(value) => handleLocalChange('otherPhone', value)}
            editing={isEditing}
          />

          <div >
            <EditableField
              id="address"
              label="Address"
              value={localFormData.address}
              onUpdate={(value) => handleLocalChange('address', value)}
              editing={isEditing}
            />
          </div>

          <EditableField
            id="cityOrTown"
            label="City/Town"
            value={localFormData.cityOrTown}
            onUpdate={(value) => handleLocalChange('cityOrTown', value)}
            editing={isEditing}
          />

          <EditableField
            id="stateOrProvince"
            label="State/Province"
            value={localFormData.stateOrProvince}
            onUpdate={(value) => handleLocalChange('stateOrProvince', value)}
            editing={isEditing}
          />

          <EditableField
            id="postCode"
            label="Post Code"
            value={localFormData.postCode}
            onUpdate={(value) => handleLocalChange('postCode', value)}
            editing={isEditing}
          />

          <EditableField
            id="country"
            label="Country"
            value={localFormData.country}
            type="select"
            options={countryOptions}
            onUpdate={(value) => handleLocalChange('country', value)}
            editing={isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactTab;