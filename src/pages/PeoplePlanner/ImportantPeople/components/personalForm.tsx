import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  ShieldCheck, 
  Save
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { Separator } from '@/components/ui/separator';

// --- Validation Schema ---
const personalSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  relationshipRole: z.string().min(1, 'Relationship role is required'),
  nextOfKin: z.boolean({ required_error: 'Please select Yes or No' }),
  lastingPowerOfAttorney: z.array(z.string()).default([]),
  observation: z.string().optional(),
  postcode: z.string().optional(),
  telephone1: z.string().optional(),
  telephone2: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  contactStatus: z.enum(['Priority', 'Secondary', 'Do not contact'], {
    required_error: 'Contact status is required'
  }),
  contactableTimes: z.string().optional(),
  access: z.boolean({ required_error: 'Please select Yes or No' }),
  justification: z.string().optional()
});

type PersonalFormProps = {
  userId?: string;
  contactId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function PersonalForm({
  userId,
  contactId,
  onSuccess,
  onCancel
}: PersonalFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof personalSchema>>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      relationshipRole: undefined,
      nextOfKin: undefined,
      lastingPowerOfAttorney: [],
      observation: '',
      postcode: '',
      telephone1: '',
      telephone2: '',
      email: '',
      contactStatus: undefined,
      contactableTimes: '',
      access: undefined,
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
            nextOfKin: data.nextOfKin,
            access: data.access
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

  const onSubmit = async (values: z.infer<typeof personalSchema>) => {
    setLoading(true);
    try {
      const payload = { ...values, userId, type: 'personal' };
      if (contactId) {
        await axiosInstance.patch(`/important-people/${contactId}`, payload);
        toast({ title: 'Success', description: 'Contact updated successfully' });
      } else {
        await axiosInstance.post('/important-people', payload);
        toast({ title: 'Success', description: 'Contact created successfully' });
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
    <div className="mx-auto  pb-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {contactId ? 'Edit Personal Contact' : 'Add Personal Contact'}
          </h1>
         
        </div>
        <div className="flex gap-3">
          <Button  className="border-gray-300" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
             className="bg-supperagent hover:bg-supperagent/90 text-white min-w-[140px]" 
             onClick={form.handleSubmit(onSubmit)}
             disabled={loading}
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Contact
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Single Main Form Container */}
      <div className="rounded-xl border border-gray-300 bg-white shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            
            {/* --- Section 1: General Information --- */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} className="border-gray-300 focus:border-supperagent" />
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
                      <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} className="border-gray-300 focus:border-supperagent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationshipRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship / Role <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:ring-supperagent/20">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Family Member">Family Member</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Yes/No Toggle */}
                <FormField
                  control={form.control}
                  name="nextOfKin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next of Kin <span className="text-red-500">*</span></FormLabel>
                      <div className="flex h-10 w-full items-center gap-6 rounded-md border border-gray-300 px-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="nok-yes"
                            className="border-gray-400 data-[state=checked]:bg-supperagent data-[state=checked]:border-supperagent"
                            checked={field.value === true}
                            onCheckedChange={(c) => c && field.onChange(true)}
                          />
                          <label htmlFor="nok-yes" className="text-sm font-medium cursor-pointer text-gray-700">Yes</label>
                        </div>
                        <div className="h-4 w-px bg-gray-300" />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="nok-no"
                            className="border-gray-400 data-[state=checked]:bg-supperagent data-[state=checked]:border-supperagent"
                            checked={field.value === false}
                            onCheckedChange={(c) => c && field.onChange(false)}
                          />
                          <label htmlFor="nok-no" className="text-sm font-medium cursor-pointer text-gray-700">No</label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Width Fields */}
                <div className="md:col-span-2">
                   <FormField
                    control={form.control}
                    name="lastingPowerOfAttorney"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block">Lasting Power of Attorney</FormLabel>
                        <div className="flex flex-wrap gap-4 rounded-lg border border-gray-300 bg-gray-50/50 p-4">
                          {['Health and wellbeing', 'Financial'].map((item) => (
                            <FormItem key={item} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  className="border-gray-400 data-[state=checked]:bg-supperagent"
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(field.value?.filter((val) => val !== item));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-gray-700">{item}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observation / Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add specific observations..." 
                            className="min-h-[100px] resize-none border-gray-300 focus:border-supperagent" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-gray-200" />

            {/* --- Section 2: Contact Details --- */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="telephone1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone 1</FormLabel>
                      <FormControl>
                        <Input placeholder="+123..." {...field} className="border-gray-300 focus:border-supperagent" />
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
                        <Input placeholder="+123..." {...field} className="border-gray-300 focus:border-supperagent" />
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
                        <Input type="email" placeholder="example@email.com" {...field} className="border-gray-300 focus:border-supperagent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Postcode" {...field} className="border-gray-300 focus:border-supperagent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Status <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:ring-supperagent/20">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Priority">Priority</SelectItem>
                          <SelectItem value="Secondary">Secondary</SelectItem>
                          <SelectItem value="Do not contact">Do not contact</SelectItem>
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
                        <Input placeholder="e.g. 9am - 5pm" {...field} className="border-gray-300 focus:border-supperagent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-8 bg-gray-200" />

            {/* --- Section 3: Family Portal --- */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Family Portal Status</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="access"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portal Access <span className="text-red-500">*</span></FormLabel>
                        <div className="flex h-10 items-center gap-6 rounded-md border border-gray-300 px-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="access-yes"
                              className="border-gray-400 data-[state=checked]:bg-supperagent"
                              checked={field.value === true}
                              onCheckedChange={(c) => c && field.onChange(true)}
                            />
                            <label htmlFor="access-yes" className="text-sm font-medium cursor-pointer text-gray-700">Yes</label>
                          </div>
                          <div className="h-4 w-px bg-gray-300" />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="access-no"
                              className="border-gray-400 data-[state=checked]:bg-supperagent"
                              checked={field.value === false}
                              onCheckedChange={(c) => c && field.onChange(false)}
                            />
                            <label htmlFor="access-no" className="text-sm font-medium cursor-pointer text-gray-700">No</label>
                          </div>
                        </div>
                        <FormDescription className="text-xs mt-1 text-gray-500">
                           Allow access to the online portal?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                   <FormField
                    control={form.control}
                    name="justification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justification of Decision</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[100px] resize-none border-gray-300 focus:border-supperagent" 
                            placeholder="Reason for decision..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}