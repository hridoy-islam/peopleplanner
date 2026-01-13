import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';
import { countries } from '@/types';

interface EqualityTabProps {
  formData: any;
  onUpdate: (fieldName: string, value: any) => void;
  onSelectChange: (fieldName: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const EqualityTab: React.FC<EqualityTabProps> = ({
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

  const nationalityOptions = countries.map((country) => ({
    value: country,
    label: country
  }));

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
    <Card>
      {/* Header with Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
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
            id="nationality"
            label="Nationality"
            value={localFormData.nationality} // Assumed flat structure based on hook
            type="select"
            options={nationalityOptions}
            onUpdate={(value) => handleLocalChange('nationality', value)}
            editing={isEditing}
          />

          <EditableField
            id="religion"
            label="Religion"
            value={localFormData.religion}
            type="select"
            options={religionOptions}
            onUpdate={(value) => handleLocalChange('religion', value)}
            editing={isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EqualityTab;