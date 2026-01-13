import React, { useState, useEffect } from 'react';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface ContactTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onSelectChange?: (field: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: any, formData: Record<string, any>) => string[];
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const ContactTab: React.FC<ContactTabProps> = ({
  formData,
  onUpdate,
  onSelectChange,
  isFieldSaving,
  getMissingFields,
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
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
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
            id="phone"
            label="Phone Number"
            value={localFormData.phone}
            type="text"
            onUpdate={(value) => handleLocalChange('phone', value)}
            required
            placeholder="Enter phone number"
            editing={isEditing}
          />

          <EditableField
            id="fax"
            label="Fax Number"
            value={localFormData.fax}
            type="text"
            onUpdate={(value) => handleLocalChange('fax', value)}
            placeholder="Enter fax number"
            editing={isEditing}
          />

          <EditableField
            id="email"
            label="Email"
            value={localFormData.email}
            type="email"
            disable={true} // Usually email is a unique identifier/login
            onUpdate={(value) => handleLocalChange('email', value)}
            placeholder="Enter the email Contact"
            required
            editing={isEditing}
          />

          <EditableField
            id="mobile"
            label="Mobile Phone"
            value={localFormData.mobile}
            type="text"
            onUpdate={(value) => handleLocalChange('mobile', value)}
            required
            placeholder="Enter Mobile phone number"
            editing={isEditing}
          />

          <EditableField
            id="otherPhone"
            label="Other Phone"
            value={localFormData.otherPhone || localFormData.other} // Handle potential key mismatch
            type="text"
            onUpdate={(value) => handleLocalChange('otherPhone', value)}
            placeholder="Enter other phone number"
            editing={isEditing}
          />

          <EditableField
            id="website"
            label="Website"
            value={localFormData.website}
            type="text"
            onUpdate={(value) => handleLocalChange('website', value)}
            placeholder="Enter website URL"
            editing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactTab;