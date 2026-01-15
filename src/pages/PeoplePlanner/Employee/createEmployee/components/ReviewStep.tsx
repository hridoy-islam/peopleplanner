import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ServiceUserFormData } from './validation';
import { User, MapPin, Briefcase } from 'lucide-react';

export const ReviewStep: React.FC = () => {
  const { watch } = useFormContext<ServiceUserFormData>();
  const formData = watch();

  // Helper to safely handle object values (like Select options) or primitives
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'object' && 'label' in value) return value.label;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  };

  const sections = [
    {
      title: 'Personal & Contact Information',
      icon: User,
      fields: [
        { label: 'Title', value: formData.title },
        { label: 'First Name', value: formData.firstName },
        { label: 'Middle Initial', value: formData.middleInitial },
        { label: 'Last Name', value: formData.lastName },
        { label: 'Email', value: formData.email },
        { label: 'Phone', value: formData.phone },
        { label: 'Date of Birth', value: formData.dateOfBirth },
        { label: 'Gender', value: formData.gender },
        { label: 'Marital Status', value: formData.maritalStatus },
        { label: 'Ethnic Origin', value: formData.ethnicOrigin },
      ]
    },
    {
      title: 'Address',
      icon: MapPin,
      fields: [
        { label: 'Address', value: formData.address },
        { label: 'City / Town', value: formData.cityOrTown },
        { label: 'State / Province', value: formData.stateOrProvince },
        { label: 'Post Code', value: formData.postCode },
        { label: 'Country', value: formData.country },
      ]
    },
    {
      title: 'Employment Details',
      icon: Briefcase,
      fields: [
        { label: 'Employment Type', value: formData.employmentType },
        { label: 'Position', value: formData.position },
        { label: 'Source', value: formData.source },
        { label: 'Branch', value: formData.branch },
        { label: 'Application Date', value: formData.applicationDate },
        { label: 'Available From', value: formData.availableFromDate },
        { label: 'Start Date', value: formData.startDate },
        { label: 'Contract Hours', value: formData.contractHours },
        { label: 'Car Travel Allowance', value: formData.carTravelAllowance },
        { label: 'Area', value: formData.area },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const Icon = section.icon;
        // Check if any field in this section has a value
        const hasData = section.fields.some((field) => {
            const val = formatValue(field.value);
            return val !== null && val !== '';
        });

        if (!hasData) return null;

        return (
          <div key={index} className="rounded-lg bg-gray-50 p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-3 rounded-lg bg-blue-100 p-2">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.fields.map((field, fieldIndex) => {
                const displayValue = formatValue(field.value);

                if (displayValue === null || displayValue === '') return null;

                return (
                  <div
                    key={fieldIndex}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <dt className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-1">
                      {field.label}
                    </dt>
                    <dd className="text-sm font-medium text-gray-900 break-words">
                      {displayValue}
                    </dd>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};