import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axiosInstance from '@/lib/axios';
import { useEffect } from 'react';
import { MoveLeft } from 'lucide-react';

const trainingFormSchema = z.object({
  name: z.string().nonempty('Name is required'),
  description: z.string().optional(),
  isRecurring: z.boolean({ required_error: 'Recurring status is required' }),
  validityDays: z
    .number()
    .int('Must be an integer')
    .positive('Must be positive')
    .optional()
    .refine((val) => typeof val === 'number' && !isNaN(val), {
      message: 'Validity days must be a number'
    }),
  reminderBeforeDays: z
    .number()
    .int('Must be an integer')
    .positive('Must be positive')
    .optional()
    .refine((val) => typeof val === 'number' && !isNaN(val), {
      message: 'Reminder days must be a number'
    })
});

type TrainingFormData = z.infer<typeof trainingFormSchema>;

export default function EditTraining() {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      name: '',
      description: '',
      isRecurring: false,
      validityDays: undefined,
      reminderBeforeDays: undefined
    }
  });

  const { setValue, watch } = form;
  const isRecurring = watch('isRecurring');

  // Fetch the training data and set it in the form
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await axiosInstance.get(`/hr/training/${id}`);
        const data = response.data.data;

        // Prefill the form with existing data
        setValue('name', data.name);
        setValue('description', data.description || '');
        setValue('isRecurring', data.isRecurring);
        setValue('validityDays', data.validityDays || undefined);
        setValue('reminderBeforeDays', data.reminderBeforeDays || undefined);
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    if (id) fetchTraining();
  }, [id, setValue]);

  const onSubmit = async (data: TrainingFormData) => {
    console.log('Form Submitted:', data);

    try {
      const response = await axiosInstance.put(`/hr/training/${id}`, data);
      if (response) {
        navigate(`/admin/hr/training`);
      }
      console.log(response);
    } catch (error) {
      console.log('Error Submitting Training Data:', error);
    }
  };

  return (
    <div >
      <div className='flex w-full items-center justify-between pb-2'>

      <h1 className="mb-2 text-2xl font-semibold">Edit Training Module</h1>
      <Button className='bg-supperagent text-white hover:bg-supperagent/90' onClick={()=> navigate(-1)}><MoveLeft/> Back</Button>
      </div>
      <Card>
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Training Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter training name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter training description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Recurring */}
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      />
                    </FormControl>
                    <FormLabel>Is this training recurring?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Validity Days - conditional */}
              <div className="flex w-full flex-row items-center justify-between gap-4">
                {isRecurring && (
                  <FormField
                    control={form.control}
                    name="validityDays"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Validity Days</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 90"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === '' ? undefined : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Reminder Before Days - conditional */}
                {isRecurring && (
                  <FormField
                    control={form.control}
                    name="reminderBeforeDays"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Remind how many days before expiry?</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === '' ? undefined : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="flex w-full items-center justify-end gap-4">
                <Button type="submit" className="border-none bg-supperagent text-white hover:bg-supperagent/90">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
