import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';
import moment from 'moment';

interface PersonalInfoTabProps {
  formData: any;
  onUpdate: (fieldName: string, value: any) => void;
  onDateChange: (fieldName: string, dateStr: string) => void;
  onSelectChange: (fieldName: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  onUpdate,
  onDateChange,
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

  const titleOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Separated', label: 'Separated' },
    { value: 'Civil Partnership', label: 'Civil Partnership' }
  ];

  return (
    <Card>
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EditableField
            id="title"
            label="Title"
            value={localFormData.title}
            type="select"
            options={titleOptions}
            onUpdate={(value) => handleLocalChange('title', value)}
            editing={isEditing}
          />

          <EditableField
            id="firstName"
            label="First Name"
            value={localFormData.firstName}
            onUpdate={(value) => handleLocalChange('firstName', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="initial"
            label="Initial"
            value={localFormData.initial}
            onUpdate={(value) => handleLocalChange('initial', value)}
            editing={isEditing}
          />

          <EditableField
            id="lastName"
            label="Last Name"
            value={localFormData.lastName}
            onUpdate={(value) => handleLocalChange('lastName', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="dateOfBirth"
            label="Date of Birth"
            // Safely handle string or moment object
            value={localFormData.dateOfBirth ? moment(localFormData.dateOfBirth).format('YYYY-MM-DD') : ''}
            type="date"
            onUpdate={(value) => handleLocalChange('dateOfBirth', value)}
            max={moment().subtract(16, 'years').format('YYYY-MM-DD')}
            editing={isEditing}
          />

          <EditableField
            id="gender"
            label="Gender"
            value={localFormData.gender}
            type="select"
            options={genderOptions}
            onUpdate={(value) => handleLocalChange('gender', value)}
            editing={isEditing}
          />

          <EditableField
            id="maritalStatus"
            label="Marital Status"
            value={localFormData.maritalStatus}
            type="select"
            options={maritalStatusOptions}
            onUpdate={(value) => handleLocalChange('maritalStatus', value)}
            editing={isEditing}
          />

          <EditableField
            id="ethnicOrigin"
            label="Ethnic Origin"
            value={localFormData.ethnicOrigin}
            onUpdate={(value) => handleLocalChange('ethnicOrigin', value)}
            editing={isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;