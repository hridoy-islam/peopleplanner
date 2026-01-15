import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@/components/ui/input';
import { ServiceUserFormData } from './validation';
import { FormField } from './FromField';
import { countries } from '@/types';

const typeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'organization', label: 'Organization' },
  { value: 'individual-with-medication', label: 'Individual With Medication' }
];

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

export const PersonalInformationStep: React.FC = () => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<ServiceUserFormData>();

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Title */}
        <FormField label="Title" required error={errors.title?.message}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={titleOptions}
                placeholder="Select title"
                className="react-select-container"
                classNamePrefix="react-select"
                value={
                  titleOptions.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(selected) => field.onChange(selected?.value || '')}
              />
            )}
          />
        </FormField>

        <FormField
          label="First Name"
          required
          error={errors.firstName?.message}
        >
          <Input {...register('firstName')} placeholder="Enter first name" />
        </FormField>

        <FormField label="Middle Initial" error={errors.middleInitial?.message}>
          <Input {...register('middleInitial')} placeholder="M" />
        </FormField>

        <FormField label="Last Name" required error={errors.lastName?.message}>
          <Input {...register('lastName')} placeholder="Enter last name" />
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          <Input
            {...register('email')}
            placeholder="Enter email address"
            type="email"
          />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message}>
          <Input
            {...register('phone')}
            placeholder="Enter phone number"
            type="tel"
          />
        </FormField>

        {/* Date of Birth */}
        <FormField
          label="Date of Birth"
          required
          error={errors.dateOfBirth?.message}
        >
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  const dateValue = date
                    ? date.toISOString().split('T')[0]
                    : '';
                  field.onChange(dateValue);
                }}
                placeholderText="Select date of birth"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable
                maxDate={new Date()}
                wrapperClassName="w-full"
              />
            )}
          />
        </FormField>

        {/* Gender - Added */}
        <FormField required label="Gender" error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={genderOptions}
                placeholder="Select gender"
                className="react-select-container"
                classNamePrefix="react-select"
                value={
                  genderOptions.find(
                    (option) => option.value === field.value
                  ) || null
                }
                onChange={(selected) => field.onChange(selected?.value || '')}
                isClearable
              />
            )}
          />
        </FormField>

        {/* Marital Status - Added */}
        <FormField label="Marital Status" error={errors.maritalStatus?.message}>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={maritalStatusOptions}
                placeholder="Select status"
                className="react-select-container"
                classNamePrefix="react-select"
                value={
                  maritalStatusOptions.find(
                    (option) => option.value === field.value
                  ) || null
                }
                onChange={(selected) => field.onChange(selected?.value || '')}
                isClearable
              />
            )}
          />
        </FormField>

        {/* Ethnic Origin - Added */}
        <FormField label="Ethnic Origin" error={errors.ethnicOrigin?.message}>
          <Input
            {...register('ethnicOrigin')}
            placeholder="Enter ethnic origin"
          />
        </FormField>
      </div>
    </div>
  );
};
