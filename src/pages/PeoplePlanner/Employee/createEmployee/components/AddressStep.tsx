import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Input } from '@/components/ui/input';
import { ServiceUserFormData } from './validation';
import { FormField } from './FromField';
import { countries } from '@/types';
import { Textarea } from '@/components/ui/textarea';

export const AddressStep: React.FC = () => {
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Address - Full Width */}
        <div className="md:col-span-2">
          <FormField required label="Address" error={errors.address?.message}>
            <Textarea 
              {...register('address')} 
              placeholder="Enter full address" 
            />
          </FormField>
        </div>

        {/* City / Town */}
        <FormField required label="City / Town" error={errors.cityOrTown?.message}>
          <Input 
            {...register('cityOrTown')} 
            placeholder="Enter city or town" 
          />
        </FormField>

        {/* State / Province */}
        <FormField  label="State / Province" error={errors.stateOrProvince?.message}>
          <Input 
            {...register('stateOrProvince')} 
            placeholder="Enter state or province" 
          />
        </FormField>

        {/* Post Code */}
        <FormField required label="Post Code" error={errors.postCode?.message}>
          <Input 
            {...register('postCode')} 
            placeholder="Enter post code" 
            className="uppercase"
          />
        </FormField>

        {/* Country - Select */}
        <FormField required label="Country" error={errors.country?.message}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={countryOptions}
                placeholder="Select Country"
                className="react-select-container"
                classNamePrefix="react-select"
                value={countryOptions.find((option) => option.value === field.value) || null}
                onChange={(selected) => field.onChange(selected?.value || '')}
                isClearable
              />
            )}
          />
        </FormField>

      </div>
    </div>
  );
};