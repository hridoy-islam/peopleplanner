import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

interface EditableFieldProps {
  id: string;
  label: string;
  value: string | number | boolean | string[];
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'email'
    | 'textarea'
    | 'select'
    | 'checkbox';
  options?: { value: string; label: string }[];
  isSaving?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onUpdate: (value: any) => void;
  maxLength?: number;
  max?: string;
  rows?: number;
  disable?: boolean;
  multiple?: boolean;
  editing?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  id,
  label,
  value,
  type = 'text',
  options = [],
  isSaving = false,
  required = false,
  placeholder = '',
  className = '',
  onUpdate,
  maxLength,
  disable = false,
  max,
  rows = 3,
  multiple = false,
  editing = false
}) => {
  // FIX: Default to '' if value is null/undefined to avoid uncontrolled input warnings
  const safeValue = value ?? (type === 'checkbox' ? false : '');
  const [fieldValue, setFieldValue] = useState(safeValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setFieldValue(value ?? (type === 'checkbox' ? false : ''));
  }, [value, type]);

  const handleBlur = () => {
    if (fieldValue !== safeValue) {
      onUpdate(fieldValue);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFieldValue(e.target.value);
  };

  const handleSelectChange = (val: any) => {
    setFieldValue(val);
    onUpdate(val);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFieldValue(checked);
    onUpdate(checked);
  };

  const handleDateChange = (date: Date | null) => {
    const iso = date ? date.toISOString().split('T')[0] : '';
    setFieldValue(iso);
    onUpdate(iso);
  };

  const formatDate = (dateStr: string | number) => {
    if (!dateStr) return '';
    const m = moment(dateStr);
    return m.isValid() ? m.format('DD-MM-YYYY') : dateStr.toString();
  };

  // --- RENDER INPUT MODE ---
  const renderInput = () => {
    if (type === 'checkbox') {
      return (
        <Checkbox
          id={id}
          checked={fieldValue as boolean}
          onCheckedChange={handleCheckboxChange}
          disabled={isSaving || disable}
        />
      );
    }

    if (type === 'select') {
      const isMulti = !!multiple;
      const formattedOptions = options.map((opt) => ({
        label: opt.label,
        value: opt.value
      }));
      const selectValue = isMulti
        ? formattedOptions.filter(
            (opt) => Array.isArray(fieldValue) && fieldValue.includes(opt.value)
          )
        : formattedOptions.find((opt) => opt.value === fieldValue) || null;

      return (
        <Select
          inputId={id}
          isMulti={isMulti}
          isDisabled={isSaving || disable}
          value={selectValue}
          onChange={(selected) => {
            if (isMulti) {
              const values = (selected as any[]).map((s) => s.value);
              handleSelectChange(values);
            } else {
              handleSelectChange((selected as any)?.value || '');
            }
          }}
          options={formattedOptions}
          placeholder={placeholder || `Select ${label}`}
          className="w-full text-sm"
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      );
    }

    if (type === 'textarea') {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          value={fieldValue as string}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isSaving || disable}
          required={required}
          maxLength={maxLength}
          rows={rows}
          className="w-full border border-gray-300 text-sm"
        />
      );
    }

    if (type === 'date') {
      return (
        <div className="w-full">
          <DatePicker
            selected={fieldValue ? new Date(fieldValue as string) : null}
            onChange={handleDateChange}
            placeholderText={placeholder || 'Select date'}
            disabled={isSaving || disable}
            wrapperClassName="w-full"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      );
    }

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        id={id}
        type={type}
        value={fieldValue as string}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={isSaving || disable}
        required={required}
        maxLength={maxLength}
        max={max}
        className="h-9 w-full text-sm"
      />
    );
  };

  // --- RENDER VIEW MODE ---
  const renderValue = () => {
    if (type === 'checkbox') {
      return (
        <span
          className={`text-sm ${fieldValue ? 'font-medium text-green-600' : 'text-gray-500'}`}
        >
          {(fieldValue as boolean) ? 'Yes' : 'No'}
        </span>
      );
    }

    if (type === 'select') {
      if (Array.isArray(fieldValue)) {
        if (fieldValue.length === 0)
          return (
            <span className="text-sm italic text-gray-400">Not selected</span>
          );
        return (
          <span className="text-sm text-gray-900">
            {fieldValue
              .map(
                (val) => options.find((opt) => opt.value === val)?.label || val
              )
              .join(', ')}
          </span>
        );
      }
      const labelStr = options.find((opt) => opt.value === fieldValue)?.label;
      return (
        <span
          className={`text-sm ${!labelStr ? 'italic text-gray-400' : 'text-gray-900'}`}
        >
          {labelStr || 'Not selected'}
        </span>
      );
    }

    if (type === 'date') {
      return (
        <span
          className={`text-sm ${!fieldValue ? 'italic text-gray-400' : 'text-gray-900'}`}
        >
          {fieldValue ? formatDate(fieldValue) : 'Not set'}
        </span>
      );
    }

    return (
      <span
        className={`text-sm ${
          !fieldValue ? 'italic text-gray-400' : 'text-gray-900'
        } whitespace-pre-wrap`}
      >
        {fieldValue || '__'}
      </span>
    );
  };

  return (
    <div
      className={`flex flex-col justify-between px-1 py-3 transition-colors last:border-0 hover:bg-gray-50 sm:flex-row sm:items-center ${className}`}
    >
      <div className="mb-2 pr-4 sm:mb-0 sm:w-1/3">
        <label htmlFor={id} className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>

      <div className="w-full sm:w-2/3">
        {editing ? renderInput() : renderValue()}
      </div>
    </div>
  );
};