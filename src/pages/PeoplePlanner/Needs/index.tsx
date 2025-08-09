import { useEffect, useState } from 'react';
import { Pen, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import moment from 'moment';
import { Input } from '@/components/ui/input';

// Predefined list of need titles (used as dropdown options)
const needTitles = [
  'Medical',
  'Therapy',
  'Companion',
  'Nutrition',
  'Counseling',
  'Housekeeping',
  'Transportation',
  'Other',
];

// Mock Data: Each need uses one of the above titles
const mockNeeds = [
  {
    id: '1',
    title: 'Medical',
    addedAt: '2025-04-01T08:30:00Z',
    notes: 'Patient requires round-the-clock monitoring due to recent surgery.',
  },
  {
    id: '2',
    title: 'Therapy',
    addedAt: '2025-04-02T12:15:00Z',
    notes: 'Assist with physiotherapy sessions twice a week.',
  },
  {
    id: '3',
    title: 'Companion',
    addedAt: '2025-04-03T20:00:00Z',
    notes: 'Needs someone to stay overnight and assist with mobility.',
  },
  {
    id: '4',
    title: 'Nutrition',
    addedAt: '2025-04-04T09:00:00Z',
    notes: 'Special diet for diabetes management. Consult nutritionist.',
  },
  {
    id: '5',
    title: 'Counseling',
    addedAt: '2025-04-05T14:20:00Z',
    notes: 'Weekly sessions recommended for anxiety and depression.',
  },
];

export default function NeedPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [needToDelete, setNeedToDelete] = useState<string | null>(null);

  // Form fields
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Load mock data
  useEffect(() => {
    setInitialLoading(true);
    setTimeout(() => {
      setNeeds(mockNeeds);
      setFilteredNeeds(mockNeeds);
      setInitialLoading(false);
    }, 800);
  }, []);

  // Filter needs by title or notes
  useEffect(() => {
    const filtered = needs.filter(
      (need) =>
        need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        need.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNeeds(filtered);
    setCurrentPage(1);
  }, [searchTerm, needs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddNeed = () => {
    if (!selectedTitle) {
      toast({
        title: 'Missing Title',
        description: 'Please select a need title.',
        variant: 'destructive',
      });
      return;
    }

    const newNeed = {
      id: (needs.length + 1).toString(),
      title: selectedTitle,
      addedAt: new Date().toISOString(),
      notes: notes.trim() || 'No additional notes.',
    };

    setNeeds((prev) => [newNeed, ...prev]);
    setFilteredNeeds((prev) => [newNeed, ...prev]);

    // Reset form
    setSelectedTitle('');
    setNotes('');
    setOpenAddDialog(false);

    toast({
      title: 'Need added successfully',
    });
  };

  const handleDelete = () => {
    if (!needToDelete) return;

    const deletedNeed = filteredNeeds.find((n) => n.id === needToDelete);
    setNeeds((prev) => prev.filter((n) => n.id !== needToDelete));
    setFilteredNeeds((prev) => prev.filter((n) => n.id !== needToDelete));

    setNeedToDelete(null);
    setOpenDeleteDialog(false);

    toast({
      title: 'Need deleted',
    });
  };

  // Pagination
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedNeeds = filteredNeeds.slice(startIndex, startIndex + entriesPerPage);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Needs</h1>
        <Button
          className="bg-supperagent text-white hover:bg-supperagent/90"
          size="sm"
          onClick={() => setOpenAddDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Need
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title or notes"
          className="h-8 max-w-[400px]"
        />
      </div>

      <div className="rounded-md bg-white p-4 shadow">
        {initialLoading ? (
          <div className="flex justify-center py-6">
            <div className="flex items-center space-x-2 text-primary">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse delay-150"></div>
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse delay-300"></div>
            </div>
          </div>
        ) : filteredNeeds.length === 0 ? (
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
                {paginatedNeeds.map((need) => (
                  <TableRow key={need.id}>
                    <TableCell className="font-medium">{need.title}</TableCell>
                    <TableCell>{moment(need.addedAt).format('DD MMM, YYYY')}</TableCell>
                    <TableCell>{need.notes}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary"
                        onClick={() =>
                          toast({
                            title: 'Edit not available',
                            description: 'Editing is not supported yet.',
                          })
                        }
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white bg-red-600 hover:bg-red-600/90"
                        onClick={() => {
                          setNeedToDelete(need.id);
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
              totalPages={Math.ceil(filteredNeeds.length / entriesPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Add New Need Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Need</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Need Title (Dropdown) */}
            <div>
              <label className="text-sm font-medium">Need Title</label>
              <Select onValueChange={setSelectedTitle} value={selectedTitle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a need" />
                </SelectTrigger>
                <SelectContent>
                  {needTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Additional Information (Notes)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any relevant details..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenAddDialog(false);
                setSelectedTitle('');
                setNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNeed}
              className="bg-supperagent text-white"
              disabled={!selectedTitle}
            >
              Add Need
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this need. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}