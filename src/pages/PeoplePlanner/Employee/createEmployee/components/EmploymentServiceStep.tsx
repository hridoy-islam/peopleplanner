import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@/components/ui/input';
import { ServiceUserFormData } from './validation';
import { FormField } from './FromField';

const employmentTypeOptions = [
  { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'intern', label: 'Intern' }
];

const carTravelAllowanceOptions = [
  { value: true, label: 'Yes' },
    { value: false, label: 'No' }
];

export const EmploymentServiceStep: React.FC = () => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<ServiceUserFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Employment Type */}
        <FormField label="Employment Type" error={errors.employmentType?.message}>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={employmentTypeOptions}
                placeholder="Select type"
                className="react-select-container"
                classNamePrefix="react-select"
                value={employmentTypeOptions.find((opt) => opt.value === field.value) || null}
                onChange={(selected) => field.onChange(selected?.value || '')}
                isClearable
              />
            )}
          />
        </FormField>

        {/* Position */}
        <FormField label="Position" error={errors.position?.message}>
          <Input 
            {...register('position')} 
            placeholder="Enter position" 
          />
        </FormField>

        {/* Source */}
        <FormField label="Source" error={errors.source?.message}>
          <Input 
            {...register('source')} 
            placeholder="Enter source" 
          />
        </FormField>

        {/* Branch */}
        <FormField label="Branch" error={errors.branch?.message}>
          <Input 
            {...register('branch')} 
            placeholder="Enter branch" 
          />
        </FormField>

        {/* Application Date */}
        <FormField label="Application Date" error={errors.applicationDate?.message}>
          <Controller
            control={control}
            name="applicationDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Select application date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable
                wrapperClassName="w-full"
              />
            )}
          />
        </FormField>

        {/* Available From Date */}
        <FormField label="Available From Date" error={errors.availableFromDate?.message}>
          <Controller
            control={control}
            name="availableFromDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Select available date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable
                wrapperClassName="w-full"
              />
            )}
          />
        </FormField>

        {/* Start Date */}
        <FormField label="Start Date" error={errors.startDate?.message}>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Select start date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable
                wrapperClassName="w-full"
              />
            )}
          />
        </FormField>

        {/* Contract Hours */}
        <FormField label="Contract Hours" error={errors.contractHours?.message}>
          <Input 
            {...register('contractHours')} 
            placeholder="Enter contract hours" 
            type="number"
            step="0.01"
          />
        </FormField>

        {/* Car Travel Allowance */}
        <FormField label="Car Travel Allowance" error={errors.carTravelAllowance?.message}>
          <Controller
            name="carTravelAllowance"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={carTravelAllowanceOptions}
                placeholder="Select allowance"
                className="react-select-container"
                classNamePrefix="react-select"
                value={carTravelAllowanceOptions.find((opt) => opt.value === field.value) || null}
                onChange={(selected) => field.onChange(selected?.value || '')}
                isClearable
              />
            )}
          />
        </FormField>

        {/* Area */}
        <FormField label="Area" error={errors.area?.message}>
          <Input 
            {...register('area')} 
            placeholder="Enter area" 
          />
        </FormField>

      </div>
    </div>
  );
};