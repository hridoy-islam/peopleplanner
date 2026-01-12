import { useEffect, useState } from 'react';
import {
  Pen,
  Plus,
  Trash,
  Search,
  Stethoscope,
  HeartHandshake,
  Users,
  Apple,
  Brain,
  Home,
  Car,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/lib/axios';

// Form & Validation Imports
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import axios from 'axios';
import { useSelector } from 'react-redux';

// --- CONFIG: Icon Mapping ---
const needOptions = [
  { value: 'Medical', icon: Stethoscope },
  { value: 'Therapy', icon: HeartHandshake },
  { value: 'Companion', icon: Users },
  { value: 'Nutrition', icon: Apple },
  { value: 'Counseling', icon: Brain },
  { value: 'Housekeeping', icon: Home },
  { value: 'Transportation', icon: Car },
  { value: 'Other', icon: HelpCircle }
];

// Helper to get icon component
const getIcon = (value: string) => {
  const option = needOptions.find((o) => o.value === value);
  const Icon = option ? option.icon : HelpCircle;
  return <Icon className="h-4 w-4 text-muted-foreground" />;
};

// Zod Schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
});

type NeedFormValues = z.infer<typeof formSchema>;

export default function NeedPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth?.user) || null;
  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>(null);
  // Dialog States
  const [openDialog, setOpenDialog] = useState(false); // Add/Edit
  const [openViewDialog, setOpenViewDialog] = useState(false); // View Details
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Selection States
  const [selectedNeed, setSelectedNeed] = useState<any | null>(null); // For Edit
  const [viewNeed, setViewNeed] = useState<any | null>(null); // For View
  const [needToDelete, setNeedToDelete] = useState<string | null>(null);

  // Setup React Hook Form
  const form = useForm<NeedFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  // --- Fetch Data ---
  const fetchNeeds = async (page: number, limit: number, search: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/needs`, {
        params: {
          userId: id,
          page,
          limit: entriesPerPage,
          searchTerm: search
        }
      });

      const data = response.data?.data?.result || response.data?.data || [];
      const meta = response.data?.data?.meta || {};
      const res = await axiosInstance.get(`/users/${id}`);
      setUserData(res.data?.data || res.data);
      setNeeds(data);
      if (meta.totalPage) setTotalPages(meta.totalPage);
    } catch (error: any) {
      console.error('Error fetching needs:', error);
      toast({
        title: error?.response?.data?.message || 'Error fetching needs',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchNeeds(currentPage, entriesPerPage, searchTerm);
  }, [currentPage, entriesPerPage]);

  // --- Handlers ---
  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchNeeds(1, entriesPerPage, searchTerm);
  };

  const handleOpenAdd = () => {
    setSelectedNeed(null);
    form.reset({ title: '', description: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (need: any) => {
    setSelectedNeed(need);
    form.reset({
      title: need.title,
      description: need.description || ''
    });
    setOpenDialog(true);
  };

  const handleOpenView = (need: any) => {
    setViewNeed(need);
    setOpenViewDialog(true);
  };

  const onSubmit = async (values: NeedFormValues) => {
    if (!id) return;
    try {
      const payload = {
        userId: id,
        title: values.title,
        description: values.description
      };

      if (selectedNeed) {
        const response = await axiosInstance.patch(
          `/needs/${selectedNeed._id}`,
          payload
        );
        const updatedNeed = response.data?.data || response.data;
        setNeeds((prev) =>
          prev.map((n) => (n._id === selectedNeed._id ? updatedNeed : n))
        );
        toast({ title: 'Success', description: 'Need updated successfully.' });
      } else {
        const response = await axiosInstance.post('/needs', payload);
        const newNeed = response.data?.data || response.data;
        setNeeds((prev) => [newNeed, ...prev]);
        toast({ title: 'Success', description: 'Need added successfully.' });
      }
      setOpenDialog(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to save need.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!needToDelete) return;
    try {
      await axiosInstance.delete(`/needs/${needToDelete}`);
      setNeeds((prev) => prev.filter((n) => n._id !== needToDelete));
      toast({ title: 'Deleted', description: 'Need removed successfully.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete need.',
        variant: 'destructive'
      });
    } finally {
      setNeedToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-3">
      {user?.role === 'admin' && (
        <h1 className="text-xl font-medium">
          {userData?.title} {userData?.firstName} {userData?.lastName}
        </h1>
      )}
      <div className="flex items-center justify-between">
        <div className='flex items-center gap-4'>
          <h1 className="text-2xl font-semibold">All Needs</h1>
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              placeholder="Search by title"
              className="h-9 min-w-[300px]"
            />
            <Button size="sm" onClick={handleSearchClick} className="h-9">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            className="bg-supperagent text-white hover:bg-supperagent/90"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="bg-supperagent text-white hover:bg-supperagent/90"
            size="sm"
            onClick={handleOpenAdd}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Need
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md bg-white p-4 shadow">
        {loading ? (
          <div className="flex justify-center py-6">
            <BlinkingDots size="large" color="bg-supperagent" />
          </div>
        ) : needs.length === 0 ? (
          <div className="flex justify-center py-6 text-gray-500">
            No needs found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Need Title</TableHead>
                  <TableHead>Added Time</TableHead>
                  <TableHead>Additional Information</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needs.map((need) => (
                  <TableRow
                    key={need._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleOpenView(need)} // Opens Details Dialog on row click
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getIcon(need.title)}
                        {need.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {need.createdAt
                        ? moment(need.createdAt).format('DD MMM, YYYY')
                        : '-'}
                    </TableCell>
                    <TableCell
                      className="max-w-xs truncate"
                      title={need.description}
                    >
                      {need.description || 'N/A'}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      {/* Edit Button */}
                      <Button
                        className="h-8 w-8 p-0 text-white"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleOpenEdit(need);
                        }}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      {/* Delete Button */}
                      <Button
                        size="icon"
                        className=" h-8 w-8 bg-destructive text-white hover:bg-destructive/90"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          setNeedToDelete(need._id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {needs.length > 30 && (
              <DynamicPagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Add / Edit Dialog (Larger) */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>
              {selectedNeed ? 'Edit Need' : 'Add New Need'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Need Title</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a need title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-gray-300">
                        {needOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className=" cursor-pointer hover:bg-supperagent hover:text-white "
                          >
                            <div className="flex items-center gap-3 rounded p-2">
                              <option.icon className="h-4 w-4 text-supperagent" />
                              <span>{option.value}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Description)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant details..."
                        className="min-h-[40vh] resize-none border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenDialog(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-supperagent text-white hover:bg-supperagent/90"
                >
                  {selectedNeed ? 'Save Changes' : 'Add Need'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>Need Details</DialogTitle>
          </DialogHeader>

          {viewNeed && (
            <div className="space-y-6 py-4 ">
              {/* Title & Icon Section */}
              <div className="flex items-center gap-4 rounded-lg border border-gray-300 bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-supperagent shadow-sm">
                  {(() => {
                    const Icon =
                      needOptions.find((o) => o.value === viewNeed.title)
                        ?.icon || HelpCircle;
                    return <Icon className="h-6 w-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {viewNeed.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Created: {moment(viewNeed.createdAt).format('DD MMM, YYYY')}
                  </p>
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                  Description
                </h4>
                <div className="min-h-[40vh] whitespace-pre-wrap rounded-lg border  border-gray-300 bg-white p-4 text-gray-700">
                  {viewNeed.description || 'No description provided.'}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this need. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNeedToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-700 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
