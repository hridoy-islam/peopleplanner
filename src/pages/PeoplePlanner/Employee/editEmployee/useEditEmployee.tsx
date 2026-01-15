import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import moment from 'moment';
import { useToast } from '@/components/ui/use-toast';

// Define the validation structure
export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    missingFields: string[];
  };
}

export const useEditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isFieldSaving, setIsFieldSaving] = useState<Record<string, boolean>>({});
  
  // Validation State
  const [validationErrors, setValidationErrors] = useState<ValidationState>({});

  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    title: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    ethnicOrigin: '',

    // Contact Information
    email: '',
    homePhone: '',
    mobilePhone: '',
    otherPhone: '',
    address: '',
    cityOrTown: '',
    stateOrProvince: '',
    postCode: '',
    country: '',

    // Employment Details
    employmentType: '',
    position: '',
    source: '',
    branch: '',
    applicationDate: null as moment.Moment | null,
    availableFromDate: null as moment.Moment | null,
    startDate: null as moment.Moment | null,
    contractHours: 0,
    carTravelAllowance: false,
    recruitmentEmploymentType: '',
    area: '',

    // Identification
    nationalInsuranceNumber: '',
    nhsNumber: '',

    // Right to Work
    rightToWork: {
      hasExpiry: false,
      expiryDate: null as moment.Moment | null
    },

    // Payroll
    payroll: {
      payrollNumber: '',
      paymentMethod: '',
      bankName: '',
      accountNumber: '',
      sortCode: '',
      beneficiary: ''
    },

    // Equality Information
    equalityInformation: {
      nationality: '',
      religion: '',
    },

    // Disability Information
    hasDisability: undefined as boolean | undefined,
    disabilityDetails: '',
    needsReasonableAdjustment: undefined as boolean | undefined,
    reasonableAdjustmentDetails: '',

    // Beneficiary
    beneficiary: {
      fullName: '',
      relationship: '',
      email: '',
      mobile: '',
      sameAddress: undefined,
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postCode: '',
        country: ''
      }
    },

    // Bank Details
    accountNo: '',
    sortCode: '',

    // Department, Designation, Training
    designationId: '',
    departmentId: '',
    trainingId: [] as string[],
    passportNo: '',
    passportExpiry: '',

    // Notes
    notes: ''
  });

  // --- Validation Logic ---
  const validateForm = useCallback(() => {
    const errors: ValidationState = {};
    const check = (val: any) => val !== null && val !== undefined && val !== '';

    // 1. Personal Tab Validation
    const personalMissing: string[] = [];
    if (!check(formData.title)) personalMissing.push('title');
    if (!check(formData.firstName)) personalMissing.push('firstName');
    if (!check(formData.middleInitial)) personalMissing.push('middleInitial');
    if (!check(formData.lastName)) personalMissing.push('lastName');
    if (!check(formData.email)) personalMissing.push('email');
    if (!check(formData.mobilePhone)) personalMissing.push('mobilePhone'); // Mapped 'phone' to 'mobilePhone'
    if (!check(formData.dateOfBirth)) personalMissing.push('dateOfBirth');
    if (!check(formData.gender)) personalMissing.push('gender');
    if (!check(formData.maritalStatus)) personalMissing.push('maritalStatus');
    if (!check(formData.ethnicOrigin)) personalMissing.push('ethnicOrigin');

    errors['personal'] = { 
      isValid: personalMissing.length === 0, 
      missingFields: personalMissing 
    };

    // 2. Contact Tab Validation
    const contactMissing: string[] = [];
    if (!check(formData.address)) contactMissing.push('address');
    if (!check(formData.cityOrTown)) contactMissing.push('cityOrTown');
    if (!check(formData.stateOrProvince)) contactMissing.push('stateOrProvince');
    if (!check(formData.postCode)) contactMissing.push('postCode');
    if (!check(formData.country)) contactMissing.push('country');
    // Note: Email is also listed in contact requirements, but handled in personal. 
    // If it's editable in Contact tab too, add it here:
    // if (!check(formData.email)) contactMissing.push('email');

    errors['contact'] = { 
      isValid: contactMissing.length === 0, 
      missingFields: contactMissing 
    };

    // 3. Employment Tab Validation
    const employmentMissing: string[] = [];
    if (!check(formData.position)) employmentMissing.push('position');
    if (!check(formData.branch)) employmentMissing.push('branch');
    if (!check(formData.applicationDate)) employmentMissing.push('applicationDate');
    if (!check(formData.availableFromDate)) employmentMissing.push('availableFromDate');
    if (!check(formData.contractHours) || formData.contractHours === 0) employmentMissing.push('contractHours');
    if (formData.carTravelAllowance === undefined || formData.carTravelAllowance === null) employmentMissing.push('carTravelAllowance');
    
    errors['employment'] = { 
      isValid: employmentMissing.length === 0, 
      missingFields: employmentMissing 
    };

    // 4. Disability/Equality Tab Validation (Assuming Disability is its own tab)
    const disabilityMissing: string[] = [];
    if (formData.hasDisability === undefined) disabilityMissing.push('hasDisability');
    if (formData.needsReasonableAdjustment === undefined) disabilityMissing.push('needsReasonableAdjustment');

    errors['disability'] = { 
      isValid: disabilityMissing.length === 0, 
      missingFields: disabilityMissing 
    };

    // 5. Beneficiary Tab Validation
    const beneficiaryMissing: string[] = [];
    if (!check(formData.beneficiary.fullName)) beneficiaryMissing.push('fullName');
    if (!check(formData.beneficiary.relationship)) beneficiaryMissing.push('relationship');
    if (!check(formData.beneficiary.email)) beneficiaryMissing.push('email');
    if (!check(formData.beneficiary.mobile)) beneficiaryMissing.push('mobile');

    errors['beneficiary'] = { 
      isValid: beneficiaryMissing.length === 0, 
      missingFields: beneficiaryMissing 
    };

    // 6. Settings Tab Validation
    const settingsMissing: string[] = [];
    if (!check(formData.designationId)) settingsMissing.push('designationId');
    if (!check(formData.departmentId)) settingsMissing.push('departmentId');

    errors['settings'] = { 
      isValid: settingsMissing.length === 0, 
      missingFields: settingsMissing 
    };

    setValidationErrors(errors);
    return errors;
  }, [formData]);

  // Run validation whenever formData changes
  useEffect(() => {
    if (!loading) {
      validateForm();
    }
  }, [formData, loading, validateForm]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/${id}`);
        const data = response.data.data;

        // Set form data
        setFormData({
          // Personal Information
          title: data.title || '',
          firstName: data.firstName || '',
          middleInitial: data.middleInitial || '',
          lastName: data.lastName || '',
          dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth) : '',
          gender: data.gender || '',
          maritalStatus: data.maritalStatus || '',
          ethnicOrigin: data.ethnicOrigin || '',

          // Contact Information
          email: data.email || '',
          homePhone: data.homePhone || '',
          mobilePhone: data.mobilePhone || '',
          otherPhone: data.otherPhone || '',
          address: data.address || '',
          cityOrTown: data.cityOrTown || '',
          stateOrProvince: data.stateOrProvince || '',
          postCode: data.postCode || '',
          country: data.country || '',

          // Employment Details
          employmentType: data.employmentType || '',
          position: data.position || '',
          source: data.source || '',
          branch: data.branch || '',
          applicationDate: data.applicationDate
            ? moment(data.applicationDate)
            : null,
          availableFromDate: data.availableFromDate
            ? moment(data.availableFromDate)
            : null,
          startDate: data.startDate ? moment(data.startDate) : null,
          contractHours: data.contractHours || 0,
          carTravelAllowance: data.carTravelAllowance ?? false, // Use ?? to preserve false
          recruitmentEmploymentType: data.recruitmentEmploymentType || '',
          area: data.area || '',

          // Identification
          nationalInsuranceNumber: data.nationalInsuranceNumber || '',
          nhsNumber: data.nhsNumber || '',

          // Right to Work
          rightToWork: {
            hasExpiry: data.rightToWork?.hasExpiry || false,
            expiryDate: data.rightToWork?.expiryDate
              ? moment(data.rightToWork.expiryDate)
              : null
          },

          // Payroll
          payroll: {
            payrollNumber: data.payroll?.payrollNumber || '',
            paymentMethod: data.payroll?.paymentMethod || '',
            bankName: data?.payroll?.bankName || '',
            accountNumber: data?.payroll?.accountNumber || '',
            sortCode: data?.payroll?.sortCode || '',
            beneficiary: data?.payroll?.beneficiary || ''
          },

          // Equality Information
          equalityInformation: {
            nationality: data.equalityInformation?.nationality || '',
            religion: data.equalityInformation?.religion || '',
          },

          // Disability Information
          hasDisability: data.hasDisability, // Don't default to false, keep undefined if missing
          disabilityDetails: data.disabilityDetails || '',
          needsReasonableAdjustment: data.needsReasonableAdjustment, // Don't default to false
          reasonableAdjustmentDetails: data.reasonableAdjustmentDetails || '',

          // Beneficiary
          beneficiary: {
            fullName: data.beneficiary?.fullName || '',
            relationship: data.beneficiary?.relationship || '',
            email: data.beneficiary?.email || '',
            mobile: data.beneficiary?.mobile || '',
            sameAddress: data.beneficiary?.sameAddress || false,
            address: {
              line1: data.beneficiary?.address?.line1 || '',
              line2: data.beneficiary?.address?.line2 || '',
              city: data.beneficiary?.address?.city || '',
              state: data.beneficiary?.address?.state || '',
              postCode: data.beneficiary?.address?.postCode || '',
              country: data.beneficiary?.address?.country || ''
            }
          },

          // Bank Details
          accountNo: data.accountNo || '',
          sortCode: data.sortCode || '',

          // Department, Designation, Training
          designationId: data.designationId || '',
          departmentId: data.departmentId || '',
          trainingId: Array.isArray(data.training) ? data.training : [],
          passportNo: data.passportNo || '',
          passportExpiry: data.passportExpiry
            ? moment(data.passportExpiry)
            : '',
          // Notes
          notes: data.notes || ''
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch employee data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, toast]);

  const serializeMoments = (obj: any): any => {
    if (moment.isMoment(obj)) {
      return obj.toISOString();
    }

    if (Array.isArray(obj)) {
      return obj.map(serializeMoments);
    }

    if (obj && typeof obj === 'object') {
      const result: Record<string, any> = {};
      for (const [key, val] of Object.entries(obj)) {
        // Skip null or undefined values
        if (val !== null && val !== undefined) {
          result[key] = serializeMoments(val);
        }
      }
      return result;
    }

    return obj;
  };

  const updateField = useCallback(
    async (fieldName: string, value: any) => {
      try {
        setIsFieldSaving((prev) => ({ ...prev, [fieldName]: true }));
        if (fieldName === 'contractHours') {
          value = Number(value);
        }
        // Special handling for nested objects
        let updateData;
        if (fieldName.includes('.')) {
          // Handle nested fields (e.g., 'rightToWork.expiryDate')
          const [parentField, childField] = fieldName.split('.');
          updateData = {
            [parentField]: {
              ...formData[parentField as keyof typeof formData],
              [childField]: serializeMoments(value)
            }
          };
        } else {
          updateData = { [fieldName]: serializeMoments(value) };
        }

        await axiosInstance.patch(`/users/${id}`, updateData);

        setFormData((prev) => ({
          ...prev,
          ...(fieldName.includes('.')
            ? {
                [fieldName.split('.')[0]]: {
                  ...prev[fieldName.split('.')[0] as keyof typeof prev],
                  [fieldName.split('.')[1]]: value
                }
              }
            : { [fieldName]: value })
        }));

        toast({
          title: 'Data updated successfully'
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: 'Could not save changes'
        });
      } finally {
        setIsFieldSaving((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [id, toast, formData]
  );

  const handleFieldUpdate = useCallback(
    (fieldName: string, value: any) => {
      updateField(fieldName, value);
    },
    [updateField]
  );

  const handleNestedFieldUpdate = useCallback(
    (parentField: string, fieldName: string, value: any) => {
      const currentParentData =
        formData[parentField as keyof typeof formData] || {};
      const updatedData = {
        ...currentParentData,
        [fieldName]: value
      };

      updateField(parentField, updatedData);
    },
    [formData, updateField]
  );

  const handleDateChange = useCallback(
    (fieldName: string, dateStr: string) => {
      const parsedDate = dateStr ? moment(dateStr, 'YYYY-MM-DD') : null;
      updateField(fieldName, parsedDate);
    },
    [updateField]
  );

  const handleSelectChange = useCallback(
    (fieldName: string, value: string) => {
      updateField(fieldName, value);
    },
    [updateField]
  );

  const handleCheckboxChange = useCallback(
    (fieldName: string, checked: boolean) => {
      updateField(fieldName, checked);
    },
    [updateField]
  );

  return {
    loading,
    activeTab,
    setActiveTab,
    formData,
    handleFieldUpdate,
    handleNestedFieldUpdate,
    handleDateChange,
    handleSelectChange,
    handleCheckboxChange,
    isFieldSaving,
    validationErrors // Export validation state
  };
};