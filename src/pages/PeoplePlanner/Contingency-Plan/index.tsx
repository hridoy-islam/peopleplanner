import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosInstance from '@/lib/axios';
import {
  Loader2,
  Plus,
  Trash2,
  FileText,
  Pencil,
  X,
  ArrowLeft
} from 'lucide-react';

// Shadcn UI Imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { useSelector } from 'react-redux';

// --- Zod Schema ---
const scenarioSchema = z.object({
  triggerFactor: z.string().min(1, 'Trigger factor is required'),
  whatShouldHappen: z.string().min(1, 'Action is required'),
  whoShouldBeContacted: z.string().min(1, 'Contact person is required'),
  role: z.string().min(1, 'Role is required'),
  anticipatoryMedicationsEquipment: z.string().min(1, 'Meds/Equipment required')
});

const formSchema = z.object({
  planName: z.string().min(1, 'Plan name is required'),
  scenarios: z
    .array(scenarioSchema)
    .min(1, 'At least one scenario is required'),
  agreedWithPerson: z.enum(['Service User', 'Legitimate Representative'], {
    required_error: 'Please select who agreed to this plan'
  }),
  nextReview: z.enum(['1 months', '3 months', '6 months', '12 months'], {
    required_error: 'Please select a review period'
  })
});

type FormValues = z.infer<typeof formSchema>;

interface TContingencyPlan extends FormValues {
  _id: string;
  userId: string;
  createdAt: string;
}

export default function ContingencyPlan() {
  const { id } = useParams<{ id: string }>();
  const [plans, setPlans] = useState<TContingencyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: any) => state.auth?.user) || null;

  // State for Create/Edit Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TContingencyPlan | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  // State for View Details Dialog
  const [viewPlan, setViewPlan] = useState<TContingencyPlan | null>(null);

  // --- Form Setup ---
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: '',
      scenarios: [],
      agreedWithPerson: undefined,
      nextReview: undefined
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'scenarios'
  });

  // --- Fetch Data ---
  const fetchPlans = async (
    page: number,
    entriesPerPage: number,
    searchTerm = ''
  ) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/contingency-plan`, {
        params: {
          userId: id,
          page,
          limit: entriesPerPage,
          ...(searchTerm ? { searchTerm } : {})
        }
      });

      const userRes = await axiosInstance.get(`/users/${id}`);
      setUserData(userRes.data?.data || userRes.data);
      setTotalPages(res.data?.data?.meta?.totalPage || 1);
      setPlans(res.data?.data?.result || []);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans(currentPage, entriesPerPage, searchTerm);
  }, [id]);

  // --- Handlers ---

  const handleCreate = () => {
    setEditingPlan(null);
    form.reset({
      planName: '',
      scenarios: [],
      agreedWithPerson: undefined,
      nextReview: undefined
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: TContingencyPlan) => {
    setEditingPlan(plan);
    form.reset({
      planName: plan.planName,
      scenarios: plan.scenarios,
      agreedWithPerson: plan.agreedWithPerson,
      nextReview: plan.nextReview
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        // --- UPDATE Existing Plan ---
        const payload = { ...data, userId: id };
        // Assuming your API uses PATCH or PUT with the plan ID
        const res = await axiosInstance.patch(
          `/contingency-plan/${editingPlan._id}`,
          payload
        );

        const updatedPlan = res.data?.data || { ...editingPlan, ...data };

        setPlans((prev) =>
          prev.map((p) => (p._id === editingPlan._id ? updatedPlan : p))
        );
      } else {
        // --- CREATE New Plan ---
        const payload = { ...data, userId: id };
        const res = await axiosInstance.post('/contingency-plan', payload);

        const newPlan = res.data?.data;
        if (newPlan) {
          setPlans((prev) => [newPlan, ...prev]);
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
        {user?.role === 'admin' && (
        <h1 className="text-xl font-medium">
          {userData?.title} {userData?.firstName} {userData?.lastName}
        </h1>
      )}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Contingency Plans
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-supperagent text-white hover:bg-supperagent/90"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-supperagent text-white shadow-sm hover:bg-supperagent/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Plan
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[94vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan
                ? 'Edit Contingency Plan'
                : 'Create Contingency Plan'}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? 'Update the details below.'
                : 'Fill in the details for a new plan.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Plan Name */}
              <FormField
                control={form.control}
                name="planName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Epilepsy Management Plan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scenarios Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Scenarios
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        triggerFactor: '',
                        whatShouldHappen: '',
                        whoShouldBeContacted: '',
                        role: '',
                        anticipatoryMedicationsEquipment: ''
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Scenario
                  </Button>
                </div>

                {form.formState.errors.scenarios && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.scenarios.message}
                  </p>
                )}

                {fields.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed bg-gray-50 p-8 text-center text-gray-400">
                    No scenarios added yet. Click "Add Scenario" to begin.
                  </div>
                )}

                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="relative border-slate-200 bg-slate-50"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="grid gap-4 p-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        Scenario {index + 1}
                      </h4>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`scenarios.${index}.triggerFactor`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trigger Factor</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Seizure > 5 mins"
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`scenarios.${index}.whatShouldHappen`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What Should Happen</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Administer Buccal"
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`scenarios.${index}.whoShouldBeContacted`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Who to Contact</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Ambulance / GP"
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`scenarios.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. Support Worker"
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`scenarios.${index}.anticipatoryMedicationsEquipment`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Meds / Equipment</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g. First aid kit, PRN Meds"
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Configuration: Checkboxes as Radios */}
              <div className="grid grid-cols-1 gap-8 border-t pt-4 md:grid-cols-2">
                {/* Agreed With */}
                <FormField
                  control={form.control}
                  name="agreedWithPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Agreed With</FormLabel>
                      <div className="mt-2 flex flex-col gap-3">
                        {['Service User', 'Legitimate Representative'].map(
                          (option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`agreed-${option}`}
                                checked={field.value === option}
                                onCheckedChange={(checked) => {
                                  if (checked) field.onChange(option);
                                  else field.onChange(undefined);
                                }}
                              />
                              <label
                                htmlFor={`agreed-${option}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Next Review */}
                <FormField
                  control={form.control}
                  name="nextReview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Next Review</FormLabel>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {['1 months', '3 months', '6 months', '12 months'].map(
                          (option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`review-${option}`}
                                checked={field.value === option}
                                onCheckedChange={(checked) => {
                                  if (checked) field.onChange(option);
                                  else field.onChange(undefined);
                                }}
                              />
                              <label
                                htmlFor={`review-${option}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : editingPlan ? (
                    'Update Plan'
                  ) : (
                    'Save Plan'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!viewPlan}
        onOpenChange={(open) => !open && setViewPlan(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewPlan?.planName}</DialogTitle>
            <DialogDescription>
              Full details of the contingency plan.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Badge className="px-3 py-1 text-sm">
                  Agreed: {viewPlan?.agreedWithPerson}
                </Badge>
                <Badge className="px-3 py-1 text-sm">
                  Review: {viewPlan?.nextReview}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-gray-300 pb-2 text-lg font-semibold">
                  Scenarios
                </h3>
                {viewPlan?.scenarios.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-300 bg-slate-50 p-4"
                  >
                    <h4 className="mb-2 font-medium text-primary">
                      Scenario {i + 1}
                    </h4>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm md:grid-cols-2">
                      <div>
                        <span className="block font-semibold text-gray-500">
                          Trigger:
                        </span>
                        {s.triggerFactor}
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-500">
                          Action:
                        </span>
                        {s.whatShouldHappen}
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-500">
                          Contact:
                        </span>
                        {s.whoShouldBeContacted}
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-500">
                          Role:
                        </span>
                        {s.role}
                      </div>
                      <div className="mt-2 rounded border border-gray-300 bg-white p-2 md:col-span-2">
                        <span className="block font-semibold text-gray-500">
                          Meds/Equipment:
                        </span>
                        {s.anticipatoryMedicationsEquipment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setViewPlan(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- TABLE --- */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <BlinkingDots size="large" color="bg-supperagent" />
        </div>
      ) : plans.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50">
          <FileText className="mb-2 h-10 w-10 text-gray-400" />
          <p className="font-medium text-gray-500">
            No contingency plans found.
          </p>
        </div>
      ) : (
        <div className=" rounded-md bg-white p-4 shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Plan Name</TableHead>
                <TableHead>Scenarios</TableHead>
                <TableHead className="w-[150px]">Agreed With</TableHead>
                <TableHead className="w-[120px]">Next Review</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow
                  key={plan._id}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => setViewPlan(plan)}
                >
                  <TableCell className="align-top font-semibold text-gray-900">
                    {plan.planName}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-3">
                      {plan.scenarios.map((s, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm"
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium">
                              {s.triggerFactor}
                            </span>
                          </div>
                          <div className="border-primary/20 text-gray-600">
                            <p>
                              <strong>Action:</strong> {s.whatShouldHappen}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Contact: {s.whoShouldBeContacted} ({s.role})
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge>{plan.agreedWithPerson}</Badge>
                  </TableCell>
                  <TableCell className="align-top text-gray-600">
                    {plan.nextReview}
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <Button
                      size="icon"
                      className="h-8 w-8 "
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleEdit(plan);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {plans.length > 30 && (
            <div className="pt-4">
              <DynamicPagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
