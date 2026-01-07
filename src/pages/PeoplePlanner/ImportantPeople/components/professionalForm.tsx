import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';

// Validation Schema
const professionalSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.string().min(1, 'Role is required'),
  organization: z.string().optional(),
  specialty: z.string().optional(),
  lastingPowerOfAttorney: z.array(z.string()).default([]),
  observation: z.string().optional(),
  postcode: z.string().optional(),
  telephone1: z.string().optional(),
  telephone2: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  // Select field explicitly required
  contactStatus: z.enum(['Priority', 'Secondary', 'Do not contact'], {
    required_error: 'Contact status is required'
  }),
  contactableTimes: z.string().optional(),
  // Boolean field explicitly required (cannot be undefined on submit)
  access: z.boolean({ required_error: 'Please select Yes or No' }),
  justification: z.string().optional()
});

type ProfessionalFormProps = {
  userId?: string;
  contactId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ProfessionalForm({
  userId,
  contactId,
  onSuccess,
  onCancel
}: ProfessionalFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      role: '',
      organization: '',
      specialty: '',
      lastingPowerOfAttorney: [],
      observation: '',
      postcode: '',
      telephone1: '',
      telephone2: '',
      email: '',
      contactStatus: undefined, // Explicitly undefined to show placeholder
      contactableTimes: '',
      access: undefined, // Explicitly undefined so neither checkbox is checked
      justification: ''
    }
  });

  useEffect(() => {
    if (contactId) {
      const fetchData = async () => {
        try {
          const res = await axiosInstance.get(`/important-people/${contactId}`);
          const data = res.data?.data || res.data;

          form.reset({
            ...data,
            lastingPowerOfAttorney: data.lastingPowerOfAttorney || [],
            access: data.access // Ensure boolean remains boolean
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load contact data',
            variant: 'destructive'
          });
        }
      };
      fetchData();
    }
  }, [contactId, form, toast]);

  const onSubmit = async (values: z.infer<typeof professionalSchema>) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        userId,
        type: 'professional'
      };

      if (contactId) {
        await axiosInstance.patch(`/important-people/${contactId}`, payload);
        toast({
          title: 'Success',
          description: 'Contact updated successfully'
        });
      } else {
        await axiosInstance.post('/important-people', payload);
        toast({
          title: 'Success',
          description: 'Contact created successfully'
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">
          {contactId ? 'Edit' : 'Add'} Professional Contact
        </h1>
        <Button
          variant="default"
          className="bg-supperagent text-white hover:bg-supperagent/90"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* General Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Doctor, Solicitor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. NHS, Law Firm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cardiology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastingPowerOfAttorney"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lasting Power of Attorney</FormLabel>
                    <div className="space-y-2">
                      {['Health and wellbeing', 'Financial'].map((item) => (
                        <FormItem
                          key={item}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observation</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone 2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactStatus"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      Contact Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Priority">Priority</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Do not contact">
                          Do not contact
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactableTimes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contactable Times</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Family Portal Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Family Portal Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="access"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      Access <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="access-yes"
                          checked={field.value === true}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange(true);
                          }}
                        />
                        <label
                          htmlFor="access-yes"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="access-no"
                          checked={field.value === false}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange(false);
                          }}
                        />
                        <label
                          htmlFor="access-no"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justification of Decision</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="bg-supperagent text-white hover:bg-supperagent/90"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Contact'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
