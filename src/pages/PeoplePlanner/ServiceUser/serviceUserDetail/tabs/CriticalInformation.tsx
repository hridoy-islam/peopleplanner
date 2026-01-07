import React from 'react';
import { EditableField } from '../components/EditableField';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react'; // ✅ Import Trash icon

interface CriticalInfoItem {
  date: string;
  type: { label: string; value: string } | null;
  details: string;
}

interface CriticalInfoTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: string, formData: Record<string, any>) => string[]; // ✅ Add this prop
}

const typeOptions = [
  { value: 'medical', label: 'Medical' },
  { value: 'legal', label: 'Legal' },
  { value: 'other', label: 'Other' }
];

const CriticalInfoTab: React.FC<CriticalInfoTabProps> = ({
  formData,
  onUpdate,
  isFieldSaving,
  getMissingFields // ✅ Destructure it
}) => {
  const criticalInfo: CriticalInfoItem[] = formData.criticalInfo || [];

  const updateCriticalField = <K extends keyof CriticalInfoItem>(
    index: number,
    field: K,
    value: CriticalInfoItem[K]
  ) => {
    const updated = [...criticalInfo];
    updated[index][field] = value;
    onUpdate('criticalInfo', updated);
  };

  const addNewCriticalInfo = () => {
    const updated = [...criticalInfo, { date: '', type: null, details: '' }];
    onUpdate('criticalInfo', updated);
  };

  // ✅ Add remove function
  const removeCriticalInfo = (index: number) => {
    const updated = criticalInfo.filter((_, i) => i !== index);
    onUpdate('criticalInfo', updated);
  };

  // ✅ Use global validation
  const missingFields = getMissingFields('criticalInfo', formData);

  const isFieldMissing = (index: number, field: keyof CriticalInfoItem) => {
    return missingFields.includes(`${field}[${index}]`);
  };

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-gray-900">
        Critical Information
      </h1>

      {criticalInfo.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
        >
          {/* ✅ Header with remove button */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Critical Information #{index + 1}
            </h3>

            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => removeCriticalInfo(index)}
              className="text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <EditableField
              id={`date-${index}`}
              label="Date"
              value={item.date}
              type="date"
              onUpdate={(val) => updateCriticalField(index, 'date', val)}
              isSaving={isFieldSaving[`date[${index}]`]} // ✅ Better key format
              isMissing={isFieldMissing(index, 'date')}
              required
            />

            <EditableField
              id={`type-${index}`}
              label="Type"
              value={item.type?.value || ''}
              type="select"
              options={typeOptions}
              onUpdate={(val) =>
                updateCriticalField(
                  index,
                  'type',
                  typeOptions.find((option) => option.value === val) || null
                )
              }
              isSaving={isFieldSaving[`type[${index}]`]} // ✅ Better key format
              isMissing={isFieldMissing(index, 'type')}
              required
            />

            <EditableField
              id={`details-${index}`}
              label="Details"
              value={item.details}
              type="textarea"
              onUpdate={(val) => updateCriticalField(index, 'details', val)}
              isSaving={isFieldSaving[`details[${index}]`]} // ✅ Better key format
              isMissing={isFieldMissing(index, 'details')}
              required
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={addNewCriticalInfo}
          className="rounded bg-supperagent px-4 py-2 text-white hover:bg-supperagent/90"
        >
          Add More
        </Button>
      </div>
    </div>
  );
};

export default CriticalInfoTab;
