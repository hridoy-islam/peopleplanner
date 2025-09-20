import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ServiceUserFormData } from './validation';
import { FormField } from './FromField';
import Select from 'react-select';

export const EqualityStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<ServiceUserFormData>();

  const watchedGender = watch('gender');
  const watchedMaritalStatus = watch('maritalStatus');
  const watchedEthnicOrigin = watch('ethnicOrigin');
  const watchedReligion = watch('religion');

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'separated', label: 'Separated' }
  ];

  const ethnicOriginOptions = [
    { value: 'white-british', label: 'White British' },
    { value: 'white-irish', label: 'White Irish' },
    { value: 'white-other', label: 'White Other' },
    { value: 'mixed-white-black-caribbean', label: 'Mixed White and Black Caribbean' },
    { value: 'mixed-white-black-african', label: 'Mixed White and Black African' },
    { value: 'mixed-white-asian', label: 'Mixed White and Asian' },
    { value: 'mixed-other', label: 'Mixed Other' },
    { value: 'asian-indian', label: 'Asian Indian' },
    { value: 'asian-pakistani', label: 'Asian Pakistani' },
    { value: 'asian-bangladeshi', label: 'Asian Bangladeshi' },
    { value: 'asian-other', label: 'Asian Other' },
    { value: 'black-caribbean', label: 'Black Caribbean' },
    { value: 'black-african', label: 'Black African' },
    { value: 'black-other', label: 'Black Other' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'other', label: 'Other' }
  ];

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
    <div className="space-y-6">
   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
  {/* ✅ Gender — Fixed */}
  <FormField label="Gender" required error={errors.gender?.message}>
    <Select
      value={genderOptions.find(option => option.value === watchedGender) || null}
      onChange={(selectedOption) => setValue('gender', selectedOption?.value || '')}
      options={genderOptions}
      placeholder="Select gender"
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
    />
  </FormField>

  {/* ✅ Marital Status — Fixed */}
  <FormField label="Marital Status" error={errors.maritalStatus?.message}>
    <Select
      value={maritalStatusOptions.find(option => option.value === watchedMaritalStatus) || null}
      onChange={(selectedOption) => setValue('maritalStatus', selectedOption?.value || '')}
      options={maritalStatusOptions}
      placeholder="Select marital status"
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
    />
  </FormField>

  {/* ✅ Ethnic Origin — Fixed */}
  <FormField label="Ethnic Origin" error={errors.ethnicOrigin?.message}>
    <Select
      value={ethnicOriginOptions.find(option => option.value === watchedEthnicOrigin) || null}
      onChange={(selectedOption) => setValue('ethnicOrigin', selectedOption?.value || '')}
      options={ethnicOriginOptions}
      placeholder="Select ethnic origin"
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
    />
  </FormField>

  {/* ✅ Religion — Already Correct ✅ */}
  <FormField label="Religion" error={errors.religion?.message}>
    <Select
      value={religionOptions.find(option => option.value === watchedReligion) || null}
      onChange={(selectedOption) => setValue('religion', selectedOption?.value || '')}
      options={religionOptions}
      placeholder="Select religion"
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
    />
  </FormField>
</div>
    </div>
  );
};
