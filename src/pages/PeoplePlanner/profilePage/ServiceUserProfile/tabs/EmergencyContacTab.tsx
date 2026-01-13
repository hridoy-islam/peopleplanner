import React, { useState, useEffect } from 'react';
import { EditableField } from '../components/EditableField';
import { countries } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash, Pencil, Check, Loader2, X, Plus } from 'lucide-react';

interface EmergencyContact {
  emergencyContactName: string;
  relationship: string;
  address: string;
  cityOrTown: string;
  country: string;
  postCode: string;
  note: string;
  phone: string;
  mobile: string;
  email: string;
  emailRota: boolean;
  sendInvoice: boolean;
}

interface EmergencyContactTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: string, formData: Record<string, any>) => string[];
  // New prop for batch saving
  onSave?: (updates: any) => Promise<void>;
}

const EmergencyContactTab: React.FC<EmergencyContactTabProps> = ({
  formData,
  onUpdate,
  isFieldSaving,
  getMissingFields,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Local state to hold changes (including array additions/removals)
  const [localFormData, setLocalFormData] = useState(formData);

  // Sync local state with global state when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalFormData(formData);
    }
  }, [formData, isEditing]);

  const contacts: EmergencyContact[] = localFormData.emergencyContacts || [];

  const handleLocalChange = (updatedContacts: EmergencyContact[]) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      emergencyContacts: updatedContacts
    }));
  };

  const updateContactField = <K extends keyof EmergencyContact>(
    index: number,
    field: K,
    value: EmergencyContact[K]
  ) => {
    const updatedContacts = [...contacts];
    // Ensure the object exists at index before updating
    if (!updatedContacts[index]) return;

    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    handleLocalChange(updatedContacts);
  };

  const addNewContact = () => {
    const newContact: EmergencyContact = {
      emergencyContactName: '',
      relationship: '',
      address: '',
      cityOrTown: '',
      country: '',
      postCode: '',
      note: '',
      phone: '',
      mobile: '',
      email: '',
      emailRota: false,
      sendInvoice: false
    };
    handleLocalChange([...contacts, newContact]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    handleLocalChange(updatedContacts);
  };

  const handleDone = async () => {
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {};

      const localContacts = localFormData.emergencyContacts || [];
      const globalContacts = formData.emergencyContacts || [];

      if (JSON.stringify(localContacts) !== JSON.stringify(globalContacts)) {
        updates.emergencyContacts = localContacts;
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

  // Define options
  const booleanOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Emergency Contacts</h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={addNewContact}
                className="mr-2 flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add New
              </Button>
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

      {contacts.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
          No emergency contacts added yet. Click "Edit" then "Add New" to start.
        </div>
      )}

      {contacts.map((contact, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          {/* Contact Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Emergency Contact #{index + 1}
            </h3>

            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => removeContact(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-0 px-6 py-4 md:grid-cols-2">
            <EditableField
              id={`emergencyContactName-${index}`}
              label="Name"
              value={contact.emergencyContactName}
              type="text"
              onUpdate={(val) =>
                updateContactField(index, 'emergencyContactName', val)
              }
              required
              editing={isEditing}
            />

            <EditableField
              id={`relationship-${index}`}
              label="Relationship"
              value={contact.relationship}
              type="select"
              options={relationshipOptions}
              onUpdate={(val) => updateContactField(index, 'relationship', val)}
              required
              editing={isEditing}
            />

            <EditableField
              id={`address-${index}`}
              label="Address"
              value={contact.address}
              type="text"
              onUpdate={(val) => updateContactField(index, 'address', val)}
              editing={isEditing}
            />

            <EditableField
              id={`cityOrTown-${index}`}
              label="City / Town"
              value={contact.cityOrTown}
              type="text"
              onUpdate={(val) => updateContactField(index, 'cityOrTown', val)}
              editing={isEditing}
            />

            <EditableField
              id={`country-${index}`}
              label="Country"
              value={contact.country}
              type="select"
              options={countryOptions}
              onUpdate={(val) => updateContactField(index, 'country', val)}
              editing={isEditing}
            />

            <EditableField
              id={`postCode-${index}`}
              label="Post Code"
              value={contact.postCode}
              type="text"
              onUpdate={(val) => updateContactField(index, 'postCode', val)}
              editing={isEditing}
            />

            <EditableField
              id={`note-${index}`}
              label="Note"
              value={contact.note}
              type="text"
              onUpdate={(val) => updateContactField(index, 'note', val)}
              editing={isEditing}
            />

            <EditableField
              id={`phone-${index}`}
              label="Phone"
              value={contact.phone}
              type="text"
              onUpdate={(val) => updateContactField(index, 'phone', val)}
              editing={isEditing}
            />

            <EditableField
              id={`mobile-${index}`}
              label="Mobile"
              value={contact.mobile}
              type="text"
              onUpdate={(val) => updateContactField(index, 'mobile', val)}
              editing={isEditing}
            />

            <EditableField
              id={`email-${index}`}
              label="Email"
              value={contact.email}
              type="email"
              onUpdate={(val) => updateContactField(index, 'email', val)}
              editing={isEditing}
            />

            <EditableField
              id={`emailRota-${index}`}
              label="Email Rota"
              value={contact.emailRota}
              type="select"
              options={booleanOptions}
              onUpdate={(val) => updateContactField(index, 'emailRota', val === 'true' || val === true)}
              editing={isEditing}
            />

            <EditableField
              id={`sendInvoice-${index}`}
              label="Send Invoice"
              value={contact.sendInvoice}
              type="select"
              options={booleanOptions}
              onUpdate={(val) => updateContactField(index, 'sendInvoice', val === 'true' || val === true)}
              editing={isEditing}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmergencyContactTab;