import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '@/lib/axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';

// ========================
// ZOD VALIDATION SCHEMAS
// ========================

const Step1Schema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  employee: z.string().min(1, 'Employee is required'),
  serviceUser: z.string().min(1, 'Service user is required'),
  branch: z.string().min(1, 'Branch is required'),
  area: z.string().min(1, 'Area is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  visitType: z.string().min(1, 'Visit type is required'),
  payRate: z.string().min(1, 'Pay rate is required'),
  invoiceRate: z.string().min(1, 'Invoice rate is required'),
  timeInMinutes: z.string().min(1, 'Time in minutes is required'),
  travelTime: z.string().min(1, 'Travel time is required')
});

const Step2Schema = z.object({
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  glovesAprons: z.boolean().default(false),
  uniform: z.boolean().default(false),
  idBadge: z.boolean().default(false)
});

const FormSchema = z.object({
  // Step 1
  ...Step1Schema.shape,
  // Step 2
  ...Step2Schema.shape
});

type FormData = z.infer<typeof FormSchema>;

// ========================
// OPTIONS INTERFACES
// ========================

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Option {
  value: string;
  label: string;
}

export function ScheduleForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  
  // State for dynamic options
  const [employeeOptions, setEmployeeOptions] = useState<Option[]>([]);
  const [serviceUserOptions, setServiceUserOptions] = useState<Option[]>([]);
  const [branchOptions, setBranchOptions] = useState<Option[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: undefined,
      startTime: '',
      endTime: '',
      employee: '',
      serviceUser: '',
      branch: '',
      area: '',
      serviceType: '',
      visitType: '',
      payRate: '',
      invoiceRate: '',
      timeInMinutes: '',
      travelTime: '',
      notes: '',
      tags: [],
      glovesAprons: false,
      uniform: false,
      idBadge: false
    }
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const response = await axiosInstance.get('/users?role=serviceUser&role=staff&limit=all');
      const users: User[] = response.data.data.result;

      // Separate users by role
      const staffUsers = users.filter(user => user.role === 'staff');
      const serviceUsers = users.filter(user => user.role === 'serviceUser');

      // Transform to options format
      const staffOptions: Option[] = staffUsers.map(user => ({
        value: user._id,
        label: user.name
      }));

      const serviceUserOptions: Option[] = serviceUsers.map(user => ({
        value: user._id,
        label: user.name
      }));

      setEmployeeOptions(staffOptions);
      setServiceUserOptions(serviceUserOptions);

      // You can also fetch branches and areas here if needed
      // For now, using static options as placeholder
      setBranchOptions([{ value: 'branch1', label: 'Everycare Romford' }]);
      setAreaOptions([{ value: 'area1', label: 'Care' }]);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch users data'
      });
      console.error('Error fetching users:', error);
    } finally {
      setFetchingUsers(false);
    }
  };

  // Static options (you can make these dynamic too if needed)
  const serviceTypeOptions = [
    { value: 'care', label: 'Care' },
    { value: 'support', label: 'Support' }
  ];

  const visitTypeOptions = [
    { value: 'other', label: 'Other' },
    { value: 'routine', label: 'Routine' }
  ];

  const tagOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'fragile', label: 'Fragile' },
    { value: 'call_office', label: 'Please call office' }
  ];

  // Time input handler function
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const previous = form.getValues(field) || '';

    // Allow clearing the field
    if (value === '') {
      form.setValue(field, '');
      return;
    }

    // Detect backspacing — allow free form typing
    if (value.length < previous.length) {
      form.setValue(field, value);
      return;
    }

    // Clean input (keep digits only for auto-format)
    const sanitized = value.replace(/[^0-9]/g, '');

    let formatted = value;

    if (value.includes(':')) {
      // Manual typing with colon
      const [h, m] = value.split(':');
      const hours = h?.slice(0, 2) ?? '';
      const minutes = m?.slice(0, 2) ?? '';
      formatted = minutes ? `${hours}:${minutes}` : hours;
    } else {
      // Auto-format from digits
      if (sanitized.length <= 2) {
        formatted = sanitized; // '2' or '19'
      } else if (sanitized.length === 3) {
        formatted = `${sanitized.slice(0, 2)}:${sanitized.slice(2)}`;
      } else if (sanitized.length >= 4) {
        formatted = `${sanitized.slice(0, 2)}:${sanitized.slice(2, 4)}`;
      } else {
        formatted = previous; // fallback
      }
    }

    // Prevent invalid times like 25:00
    const [hh, mm] = formatted.split(':').map(Number);
    if (!isNaN(hh) && (hh < 0 || hh > 23)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Hour',
        description: 'Hour must be between 00 and 23.'
      });
      return;
    }
    if (!isNaN(mm) && (mm < 0 || mm > 59)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Minute',
        description: 'Minute must be between 00 and 59.'
      });
      return;
    }

    form.setValue(field, formatted);
  };

  const handleNext = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields as any);

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const payload = {
        date: data.date?.toISOString().split('T')[0],
        startTime: data.startTime,
        endTime: data.endTime,
        employee: data.employee,
        serviceUser: data.serviceUser,
        branch: data.branch,
        area: data.area,
        serviceType: data.serviceType,
        visitType: data.visitType,
        payRate: Number.parseFloat(data.payRate),
        invoiceRate: Number.parseFloat(data.invoiceRate),
        timeInMinutes: Number.parseInt(data.timeInMinutes),
        travelTime: Number.parseInt(data.travelTime),
        notes: data.notes,
        tags: data.tags,
        glovesAprons: data.glovesAprons,
        uniform: data.uniform,
        idBadge: data.idBadge
      };

      await axiosInstance.post('/schedules', payload);
      form.reset();
      setCurrentStep(1);
      
      toast({
        title: 'Success',
        description: 'Schedule created successfully!',
        variant: 'default'
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create schedule'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepFields = (step: number): (keyof FormData)[] => {
    if (step === 1) {
      return [
        'date',
        'startTime',
        'endTime',
        'employee',
        'serviceUser',
        'branch',
        'area',
        'serviceType',
        'visitType',
        'payRate',
        'invoiceRate',
        'timeInMinutes',
        'travelTime'
      ];
    }
    return ['notes', 'tags', 'glovesAprons', 'uniform', 'idBadge'];
  };

  // Show loading state while fetching users
  if (fetchingUsers) {
    return (
      <div className="mx-auto w-full bg-white p-8 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading form data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full bg-white p-2">
      <Form {...form}>
        <div>
          {/* Step 1: Basic + Service Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Schedule Details</h2>

              {/* Row 1: Date, Branch, Start Time */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="yyyy-MM-dd"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholderText="Select date"
                          wrapperClassName="w-full"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch *</FormLabel>
                      <FormControl>
                        <Select
                          options={branchOptions}
                          value={branchOptions.find(option => option.value === field.value)}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          placeholder="Select branch"
                          isLoading={fetchingUsers}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            handleTimeChange('startTime', e.target.value)
                          }
                          placeholder="HH:MM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: End Time, Area, Employee */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            handleTimeChange('endTime', e.target.value)
                          }
                          placeholder="HH:MM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area *</FormLabel>
                      <FormControl>
                        <Select
                          options={areaOptions}
                          value={areaOptions.find(option => option.value === field.value)}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          placeholder="Select area"
                          isLoading={fetchingUsers}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee *</FormLabel>
                      <FormControl>
                        <Select
                          options={employeeOptions}
                          value={employeeOptions.find(option => option.value === field.value)}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          placeholder="Select employee"
                          isLoading={fetchingUsers}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3: Service User, Service Type, Visit Type */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="serviceUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service User *</FormLabel>
                      <FormControl>
                        <Select
                          options={serviceUserOptions}
                          value={serviceUserOptions.find(option => option.value === field.value)}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          placeholder="Select service user"
                          isLoading={fetchingUsers}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <FormControl>
                        <Select
                          options={serviceTypeOptions}
                          value={serviceTypeOptions.find(option => option.value === field.value)}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          placeholder="Select service type"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Type *</FormLabel>
                      <FormControl>
                        <Select
                          options={visitTypeOptions}
                          value={visitTypeOptions.find(option => option.value === field.value)}
                          onChange={(selected) => field.onChange(selected?.value || '')}
                          placeholder="Select visit type"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 4: Pay Rate, Invoice Rate, Time in Minutes, Travel Time */}
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="payRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pay Rate *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Rate *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeInMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time in Minutes *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travelTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Time (mins) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 2: Additional Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="mb-4 text-xl font-semibold">
                Additional Information
              </h2>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add any additional notes..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        options={tagOptions}
                        value={tagOptions.filter((opt) =>
                          field.value?.includes(opt.value)
                        )}
                        onChange={(selectedOptions) => {
                          field.onChange(
                            selectedOptions
                              ? selectedOptions.map((opt) => opt.value)
                              : []
                          );
                        }}
                        placeholder="Select tags..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Equipment Checkboxes */}
              <div className="border-t pt-4">
                <h3 className="mb-4 font-medium">Equipment Required</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="glovesAprons"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Gloves and Aprons
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uniform"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Uniform
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idBadge"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            ID Badge
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between pt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </Button>

            {currentStep < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-supperagent text-white hover:bg-supperagent/90"
              >
                Next
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="flex items-center gap-2 bg-supperagent text-white hover:bg-supperagent/90"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Schedule'
                )}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}