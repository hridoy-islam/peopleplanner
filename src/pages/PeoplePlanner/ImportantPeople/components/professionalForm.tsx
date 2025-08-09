import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProfessionalForm() {
  const navigate = useNavigate();
  const form = useForm();

  const onSubmit = (data: any) => {
    console.log('Professional Contact Data:', data);
    // Save logic here
    form.reset();
    navigate(-1);
  };

  return (
    <div className="space-y-4 mx-auto">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-xl font-semibold">Add Professional Contact</h1>
        <Button variant="default" className='bg-supperagent text-white hover:bg-supperagent/90' onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
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
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role" {...field} />
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
                      <Input placeholder="Enter organization" {...field} />
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
                      <Input placeholder="Enter specialty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastingPowerOfAttorney"
                render={() => (
                  <FormItem className="space-y-2">
                    <FormLabel>Lasting Power of Attorney</FormLabel>
                    <div className="space-y-2">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox value="Health and wellbeing" />
                        </FormControl>
                        <FormLabel className="font-normal">Health and wellbeing</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox value="Financial" />
                        </FormControl>
                        <FormLabel className="font-normal">Financial</FormLabel>
                      </FormItem>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observation about this person</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any observations"
                        className="min-h-[100px]"
                        {...field}
                      />
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Postcode</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="Enter postcode" {...field} />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">
                        Type in address manually
                      </span>
                    </div>
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
                      <Input placeholder="Enter telephone number" {...field} />
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
                      <Input placeholder="Enter telephone number" {...field} />
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
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
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
                    <FormLabel>Contact Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-1"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Priority" />
                          </FormControl>
                          <FormLabel className="font-normal">Priority</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Secondary" />
                          </FormControl>
                          <FormLabel className="font-normal">Secondary</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Do not contact" />
                          </FormControl>
                          <FormLabel className="font-normal">Do not contact</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
                      <Input placeholder="Enter contactable times" {...field} />
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
                    <FormLabel>Access</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="No" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-2">
                      This decision should always be in Alma Begum Khan's best interest. If no is selected, you will not be able to send an invite.
                    </p>
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
                      <Textarea
                        placeholder="Enter justification"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className='bg-supperagent text-white hover:bg-supperagent/90'>Save Contact</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}