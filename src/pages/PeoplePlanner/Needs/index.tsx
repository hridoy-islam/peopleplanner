import { useEffect, useState } from 'react';
import { Pen, Plus, Trash, Search } from 'lucide-react';
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
  DialogHeader,
  DialogTitle
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
import { useParams } from 'react-router-dom';
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

// Predefined list of need titles
const needTitles = [
  'Medical',
  'Therapy',
  'Companion',
  'Nutrition',
  'Counseling',
  'Housekeeping',
  'Transportation',
  'Other'
];

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

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false); // Used for both Add and Edit
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State to track which item is being edited (null = creating new)
  const [selectedNeed, setSelectedNeed] = useState<any | null>(null);
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
          limit,
          searchTerm: search // Pass search term to backend
        }
      });

      // Adjust these based on your actual API response structure
      // Example: { data: { result: [], meta: { totalPage: 5 } } }
      const data = response.data?.data?.result || response.data?.data || [];
      const meta = response.data?.data?.meta || {};

      setNeeds(data);
      if (meta.totalPage) {
        setTotalPages(meta.totalPage);
      }
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
    if (id) {
      fetchNeeds(currentPage, entriesPerPage, searchTerm);
    }
  }, [currentPage, entriesPerPage]);

  // --- Handlers ---

  // Trigger search on button click
  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to page 1 on new search
    fetchNeeds(1, entriesPerPage, searchTerm);
  };

  const handleOpenAdd = () => {
    setSelectedNeed(null);
    form.reset({
      title: '',
      description: ''
    });
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

  // Handle Create (POST) or Update (PATCH)
  const onSubmit = async (values: NeedFormValues) => {
    if (!id) {
      toast({
        title: 'Error',
        description: 'User ID missing',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        userId: id,
        title: values.title,
        description: values.description
      };

      if (selectedNeed) {
        // --- PATCH (Update) ---
        const response = await axiosInstance.patch(
          `/needs/${selectedNeed._id}`,
          payload
        );
        const updatedNeed = response.data?.data || response.data;

        // Update local state
        setNeeds((prev) =>
          prev.map((n) => (n._id === selectedNeed._id ? updatedNeed : n))
        );
        toast({ title: 'Success', description: 'Need updated successfully.' });
      } else {
        // --- POST (Create) ---
        const response = await axiosInstance.post('/needs', payload);
        const newNeed = response.data?.data || response.data;

        // Add to local state (or refetch)
        setNeeds((prev) => [newNeed, ...prev]);
        toast({ title: 'Success', description: 'Need added successfully.' });
      }

      setOpenDialog(false);
      form.reset();
    } catch (error: any) {
      console.error('Error saving need:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to save need.',
        variant: 'destructive'
      });
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!needToDelete) return;

    try {
      await axiosInstance.delete(`/needs/${needToDelete}`);
      setNeeds((prev) => prev.filter((n) => n._id !== needToDelete));
      toast({ title: 'Deleted', description: 'Need removed successfully.' });
    } catch (error: any) {
      console.error('Error deleting need:', error);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Needs</h1>
        <Button
          className="bg-supperagent text-white hover:bg-supperagent/90"
          size="sm"
          onClick={handleOpenAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Need
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          placeholder="Search by title"
          className="h-9 max-w-[400px]"
        />
        <Button
          size="sm"
          onClick={handleSearchClick}
          className="h-9"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
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
                  <TableRow key={need._id}>
                    <TableCell className="font-medium">{need.title}</TableCell>
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
                      <Button
                        className="h-8 w-8 text-white p-0"
                        onClick={() => handleOpenEdit(need)}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 bg-red-600 p-0 text-white hover:bg-red-600/90"
                        onClick={() => {
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

            <DynamicPagination
              pageSize={entriesPerPage}
              setPageSize={setEntriesPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
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
              {/* Need Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Need Title</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value} // Controlled value needed for reset to work visually
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a need title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {needTitles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
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
                        className="resize-none"
                        rows={4}
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
                <Button type="submit" className="bg-supperagent text-white hover:bg-supperagent/90">
                  {selectedNeed ? 'Save Changes' : 'Add Need'}
                </Button>
              </div>
            </form>
          </Form>
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
