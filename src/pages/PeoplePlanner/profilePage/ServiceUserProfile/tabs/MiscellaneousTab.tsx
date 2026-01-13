import React, { useState, useEffect } from 'react';
import { EditableField } from '../components/EditableField';
import { Pencil, Check, Loader2, X } from 'lucide-react';

interface MiscellaneousTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onDateChange: (field: string, value: string) => void;
  onSelectChange: (field: string, value: any) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: any, formData: Record<string, any>) => string[];
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const MiscellaneousTab: React.FC<MiscellaneousTabProps> = ({
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

  // Note: react-select options usually work best with string labels. 
  // We use boolean values here, EditableField should handle passing the value back correctly.
  const booleanOptions: any = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Employment and Service Details
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
            id="serviceLocationExId"
            label="Service Location Ex ID"
            value={localFormData.serviceLocationExId || ''}
            type="text"
            onUpdate={(value) => handleLocalChange('serviceLocationExId', value)}
            required
            editing={isEditing}
          />

          <EditableField
            id="timesheetSignature"
            label="Timesheet Signature Required"
            value={localFormData.timesheetSignature}
            type="select"
            options={booleanOptions}
            // Ensure boolean conversion if selects return strings, though local state usually holds value directly
            onUpdate={(value) => handleLocalChange('timesheetSignature', value === 'true' || value === true)}
            required
            editing={isEditing}
          />

          {localFormData.timesheetSignature === true && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12">
               {/* Note: Placed in a nested grid or sub-container to match layout. 
                  Since the parent is already a 2-col grid, we can just render the field directly 
                  if we want it to flow naturally, or wrap it to force full width/specific placement.
                  Given the original code had a separate div, here is the field styled to fit.
               */}
              <EditableField
                id="timesheetSignatureNote"
                label="Timesheet Signature Note"
                value={localFormData.timesheetSignatureNote || ''}
                type="textarea"
                onUpdate={(value) => handleLocalChange('timesheetSignatureNote', value)}
                required
                className="md:col-span-2"
                editing={isEditing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiscellaneousTab;