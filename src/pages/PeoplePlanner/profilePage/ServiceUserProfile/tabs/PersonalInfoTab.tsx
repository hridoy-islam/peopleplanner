import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { countries } from '@/types';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface PersonalInfoTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onDateChange: (field: string, value: string) => void;
  onSelectChange: (field: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: any, formData: Record<string, any>) => string[];
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  onUpdate,
  onDateChange,
  onSelectChange,
  isFieldSaving,
  getMissingFields,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Local state to hold changes before saving
  const [localFormData, setLocalFormData] = useState(formData);

  // Sync local state with global state when not editing (initial load or cancel)
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
      // Calculate differences
      const updates: Record<string, any> = {};
      Object.keys(localFormData).forEach((key) => {
        if (localFormData[key] !== formData[key]) {
          updates[key] = localFormData[key];
        }
      });

      // Only save if there are changes
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
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'terminated', label: 'Terminated' }
  ];

  const servicePriorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const typeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'organization', label: 'Organization' },
    { value: 'individual-with-medication', label: 'Individual With Medication' }
  ];

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country
  }));

  return (
    <div className="space-y-8">
      {/* Unified Section */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleDone}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-md bg-supperagent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-supperagent/90 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4" />}
                  Done
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
                id="serviceUserType"
                label="Service User Type"
                value={localFormData.serviceUserType}
                type="select"
                options={typeOptions}
                onUpdate={(value) => handleLocalChange('serviceUserType', value)}
                required
                editing={isEditing}
            />
            <EditableField
                id="title"
                label="Title"
                value={localFormData.title}
                type="select"
                options={titleOptions}
                onUpdate={(value) => handleLocalChange('title', value)}
                required
                editing={isEditing}
            />

            <EditableField
                id="firstName"
                label="First Name"
                value={localFormData.firstName}
                onUpdate={(value) => handleLocalChange('firstName', value)}
                required
                placeholder="Enter first name"
                editing={isEditing}
            />

            <EditableField
                id="initial"
                label="Middle Initial"
                value={localFormData.middleInitial}
                onUpdate={(value) => handleLocalChange('middleInitial', value)}
                placeholder="Enter middle initial"
                editing={isEditing}
            />

            <EditableField
                id="lastName"
                label="Last Name"
                value={localFormData.lastName}
                onUpdate={(value) => handleLocalChange('lastName', value)}
                required
                placeholder="Enter last name"
                editing={isEditing}
            />

            <EditableField
                id="dateOfBirth"
                label="Date of Birth"
                value={
                localFormData.dateOfBirth
                    ? moment(localFormData.dateOfBirth).format('YYYY-MM-DD')
                    : ''
                }
                type="date"
                onUpdate={(value) => handleLocalChange('dateOfBirth', value)}
                required
                editing={isEditing}
            />

            <EditableField
                id="startDate"
                label="Start Date"
                value={localFormData.startDate ? localFormData.startDate : ''}
                type="date"
                onUpdate={(value) => handleLocalChange('startDate', value)}
                required
                editing={isEditing}
            />
            <EditableField
                id="lastDutyDate"
                label="Last Duty Date"
                value={localFormData.lastDutyDate ? localFormData.lastDutyDate : ''}
                type="date"
                onUpdate={(value) => handleLocalChange('lastDutyDate', value)}
                required
                editing={isEditing}
            />

            <EditableField
                id="status"
                label="Status"
                value={localFormData.status}
                type="select"
                options={statusOptions}
                onUpdate={(value) => handleLocalChange('status', value)}
                required
                editing={isEditing}
            />

            <EditableField
                id="servicePriority"
                label="Service Priority"
                value={localFormData.servicePriority}
                type="select"
                options={servicePriorityOptions}
                onUpdate={(value) => handleLocalChange('servicePriority', value)}
                required
                editing={isEditing}
            />

            {/* Address Information Sub-header */}
            <div className="mt-6 mb-2 md:col-span-2 border-b border-gray-100 pb-2">
                <h4 className="text-base font-semibold text-gray-900">Address Information</h4>
            </div>

            <EditableField
                id="address"
                label="Full Address"
                value={localFormData.address}
                type="textarea"
                onUpdate={(value) => handleLocalChange('address', value)}
                required
                placeholder="Enter full street address"
                rows={3}
                editing={isEditing}
            />

            <EditableField
                id="city"
                label="City/Town"
                value={localFormData.city}
                onUpdate={(value) => handleLocalChange('city', value)}
                required
                placeholder="Enter city"
                editing={isEditing}
            />

            <EditableField
                id="postCode"
                label="Postal Code"
                value={localFormData.postCode}
                onUpdate={(value) => handleLocalChange('postCode', value)}
                required
                placeholder="Enter postal code"
                editing={isEditing}
            />

            <EditableField
                id="country"
                label="Country"
                value={localFormData.country}
                type="select"
                options={countryOptions}
                onUpdate={(value) => handleLocalChange('country', value)}
                required
                // className="md:col-span-2" // Uncomment if you want country full width
                editing={isEditing}
            />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;