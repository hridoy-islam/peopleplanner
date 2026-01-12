import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pen, Plus, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
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
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import PersonalForm from './components/personalForm';
import ProfessionalForm from './components/professionalForm';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { useSelector } from 'react-redux';

type ViewState = 'list' | 'personal' | 'professional';

export default function ImportantPeoplePage() {
  const [importantPeople, setImportantPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('list');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const user = useSelector((state: any) => state.auth?.user) || null;

  // Dialog states for List View
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { toast } = useToast();

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const fetchPeople = async (
    page: number,
    entriesPerPage: number,
    searchTerm = ''
  ) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/important-people', {
        params: {
          userId,
          page,
          limit: entriesPerPage,
          ...(searchTerm ? { searchTerm } : {})
        }
      });

      const res = await axiosInstance.get(`/users/${userId}`);
      setUserData(res.data?.data || res.data);
      setTotalPages(response.data?.data?.meta?.totalPage || 1);
      setImportantPeople(response.data?.data?.result || response.data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch important people',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && view === 'list') {
      fetchPeople(currentPage, entriesPerPage, searchTerm);
    }
  }, [userId, view, currentPage, entriesPerPage]);

  const handleDelete = async () => {
    if (!personToDelete) return;
    try {
      await axiosInstance.delete(`/important-people/${personToDelete}`);
      toast({ title: 'Success', description: 'Contact deleted successfully' });
      setImportantPeople((prev) =>
        prev.filter((p) => p._id !== personToDelete)
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive'
      });
    } finally {
      setOpenDeleteDialog(false);
      setPersonToDelete(null);
    }
  };

  const handleEdit = (person: any) => {
    setSelectedContactId(person._id);
    if (person.type === 'personal') {
      setView('personal');
    } else {
      setView('professional');
    }
  };

  const handleCreate = (type: 'personal' | 'professional') => {
    setOpenAddDialog(false);
    setSelectedContactId(null);
    setView(type);
  };

  const handleFormSuccess = () => {
    setView('list');
    fetchPeople(currentPage, entriesPerPage); // Refresh list
  };

  const handleFormCancel = () => {
    setView('list');
    setSelectedContactId(null);
  };

  // --- Render Logic ---

  if (view === 'personal') {
    return (
      <PersonalForm
        userId={userId}
        contactId={selectedContactId}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  if (view === 'professional') {
    return (
      <ProfessionalForm
        userId={userId}
        contactId={selectedContactId}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  // Default List View
  return (
    <div className="space-y-4">
      {user?.role === 'admin' && (
        <h1 className="text-xl font-medium">
          {userData?.title} {userData?.firstName} {userData?.lastName}
        </h1>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Important People</h1>

        <div className="flex flex-row items-center gap-4">
          <Button className="border-gray-300" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-supperagent text-white hover:bg-supperagent/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Contact Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Button
                  className="w-full py-6 text-lg"
                  onClick={() => handleCreate('personal')}
                >
                  Personal
                </Button>
                <Button
                  className="w-full py-6 text-lg"
                  onClick={() => handleCreate('professional')}
                >
                  Professional
                </Button>
              </div>
              <DialogClose asChild>
                <Button variant="outline" className="mt-2">
                  Cancel
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className=" rounded-md bg-white p-2 shadow-md">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <BlinkingDots size="large" color="bg-supperagent" />
          </div>
        ) : importantPeople.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No contacts found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact Status</TableHead>
                  <TableHead>Role/Relation</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importantPeople.map((person) => (
                  <TableRow key={person._id}>
                    <TableCell className="font-medium">
                      {person.firstName} {person.lastName}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs capitalize text-blue-800">
                        {person.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          person.contactStatus === 'Priority'
                            ? 'bg-green-100 text-green-800'
                            : person.contactStatus === 'Do not contact'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {person.contactStatus || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {person.type === 'personal'
                        ? person.relationshipRole
                        : person.role}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleEdit(person)}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => {
                          setPersonToDelete(person._id);
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

            {importantPeople.length > 30 && (
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

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPersonToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
