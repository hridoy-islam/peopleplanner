import React, { useState, useEffect } from 'react';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface EqualityTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onSelectChange: (field: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: any, formData: Record<string, any>) => string[];
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const EqualityTab: React.FC<EqualityTabProps> = ({
  formData,
  onUpdate,
  getMissingFields,
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

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'separated', label: 'Separated' }
  ];

  const ethnicOriginOptions = [
    { value: 'white-british', label: 'White British' },
    { value: 'white-irish', label: 'White Irish' },
    { value: 'white-other', label: 'White Other' },
    {
      value: 'mixed-white-black-caribbean',
      label: 'Mixed White and Black Caribbean'
    },
    {
      value: 'mixed-white-black-african',
      label: 'Mixed White and Black African'
    },
    { value: 'mixed-white-asian', label: 'Mixed White and Asian' },
    { value: 'mixed-other', label: 'Mixed Other' },
    { value: 'asian-indian', label: 'Asian Indian' },
    { value: 'asian-pakistani', label: 'Asian Pakistani' },
    { value: 'asian-bangladeshi', label: 'Asian Bangladeshi' },
    { value: 'asian-other', label: 'Asian Other' },
    { value: 'black-caribbean', label: 'Black Caribbean' },
    { value: 'black-african', label: 'Black African' },
    { value: 'black-other', label: 'Black Other' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'other', label: 'Other' }
  ];

  const religionOptions = [
    { value: 'christianity', label: 'Christianity' },
    { value: 'islam', label: 'Islam' },
    { value: 'hinduism', label: 'Hinduism' },
    { value: 'buddhism', label: 'Buddhism' },
    { value: 'sikhism', label: 'Sikhism' },
    { value: 'judaism', label: 'Judaism' },
    { value: 'atheism', label: 'Atheism' },
    { value: 'agnosticism', label: 'Agnosticism' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Equality Information
          </h3>
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

        <div className="grid grid-cols-1 gap-x-12 gap-y-0 px-6 py-4 md:grid-cols-2">
          <EditableField
            id="gender"
            label="Gender"
            value={localFormData.gender}
            type="select"
            options={genderOptions}
            onUpdate={(value) => handleLocalChange('gender', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="maritalStatus"
            label="Marital Status"
            value={localFormData.maritalStatus}
            type="select"
            options={maritalStatusOptions}
            onUpdate={(value) => handleLocalChange('maritalStatus', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="ethnicOrigin"
            label="Ethnic Origin"
            value={localFormData.ethnicOrigin}
            type="select"
            options={ethnicOriginOptions}
            onUpdate={(value) => handleLocalChange('ethnicOrigin', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="religion"
            label="Religion"
            value={localFormData.religion}
            type="select"
            options={religionOptions}
            onUpdate={(value) => handleLocalChange('religion', value)}
            placeholder="Enter religion"
            editing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default EqualityTab;