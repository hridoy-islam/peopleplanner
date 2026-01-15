import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  MapPin,
  Briefcase,
  Eye,
  ArrowLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Import Validation Schema
import {
  ServiceUserFormData,
  serviceUserSchema
} from './components/validation';

// Import Steps
import { PersonalInformationStep } from './components/PersonalInformationStep';
import { AddressStep } from './components/AddressStep';
import { EmploymentServiceStep } from './components/EmploymentServiceStep';
import { ReviewStep } from './components/ReviewStep';

// Define the steps structure
const steps = [
  {
    id: 1,
    title: 'Personal & Contact',
    icon: User,
    component: PersonalInformationStep
  },
  {
    id: 2,
    title: 'Address',
    icon: MapPin,
    component: AddressStep
  },
  {
    id: 3,
    title: 'Employment Details',
    icon: Briefcase,
    component: EmploymentServiceStep
  },
  {
    id: 4,
    title: 'Review Application',
    icon: Eye,
    component: ReviewStep
  }
];

const CreateEmployeePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize form with Zod resolver and default values
  const methods = useForm<ServiceUserFormData>({
    resolver: zodResolver(serviceUserSchema),
    mode: 'onChange',
    defaultValues: {
      // Personal & Contact
      title: '',
      firstName: '',
      middleInitial: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      ethnicOrigin: '',

      // Address
      address: '',
      cityOrTown: '',
      stateOrProvince: '',
      postCode: '',
      country: '',

      // Employment
      employmentType: '',
      position: '',
      source: '',
      branch: '',
      applicationDate: '',
      availableFromDate: '',
      startDate: '',
      contractHours: undefined,
      carTravelAllowance: undefined, // Default boolean false
      area: ''
    }
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors }
  } = methods;

  // Validation logic per step
  const getFieldsForStep = (step: number): (keyof ServiceUserFormData)[] => {
    switch (step) {
      case 1: // Personal & Contact
        return [
          'title',
          'firstName',
          'middleInitial',
          'lastName',
          'email',
          'phone',
          'dateOfBirth',
          'gender',
          'maritalStatus',
          'ethnicOrigin'
        ];
      case 2:
        return [
          'address',
          'cityOrTown',
          'stateOrProvince',
          'postCode',
          'country'
        ];
      case 3:
        return [
          'contractHours',
          'position',
          'source',
          'branch',
          'applicationDate',
          'availableFromDate',
          'startDate',
          'contractHours',
          'carTravelAllowance',
          'area'
        ];
      case 4: // Review
        return [];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    // Trigger validation only for the fields in the current step
    const isValid = await trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: ServiceUserFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        role: 'staff',
        email: data.email?.toLowerCase()
      };

      await axiosInstance.post('/auth/signup', payload);

      toast({
        title: 'Success!',
        description: 'Employee profile created successfully.'
      });

      methods.reset();
      navigate('/admin/people-planner/employee');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message ||
          'Failed to create profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen ">
      <div className="mx-auto  space-y-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Employee Profile
              </h1>
              <p className="text-gray-600">
                Complete all steps to create a new employee user profile
              </p>
            </div>

            <Button onClick={()=> navigate(-1)}><ArrowLeft className='h-4 w-4 mr-2'/>Back</Button>
          </div>
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="min-h-[400px] rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center space-x-3 border-b border-gray-100 pb-4">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: 'h-6 w-6 text-blue-600'
                })}
                <h2 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h2>
              </div>

              <div className="duration-300 animate-in fade-in slide-in-from-bottom-2">
                <CurrentStepComponent />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex gap-2">
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 text-white"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="flex min-w-[140px] items-center  space-x-2 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Create Profile</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
