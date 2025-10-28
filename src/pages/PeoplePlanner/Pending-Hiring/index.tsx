import { useEffect, useState } from 'react';
import { Eye, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { Input } from '@/components/ui/input';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { useNavigate } from 'react-router-dom';

// ✅ Import AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function PendingHiring() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ State to manage confirmation dialog
  const [confirmingEmployeeId, setConfirmingEmployeeId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const params: any = {
        page: currentPage,
        limit: entriesPerPage,
      };

      if (searchTerm) params.searchTerm = searchTerm;

      const response = await axiosInstance.get('/hr/pending-hiring?status=pending', { params });

      setEmployees(response.data.data.result || []);
      setTotalPages(response.data.data.meta?.totalPage || 1);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to load employees.',
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, entriesPerPage, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // ✅ Handle recruit action
  const handleRecruit = async () => {
    if (!confirmingEmployeeId) return;

    try {
      await axiosInstance.patch(`/hr/pending-hiring/${confirmingEmployeeId}`, {
        status: 'approved',
      });

      toast({
        title: 'Success',
        description: 'Employee has been recruited successfully.',
      });

      fetchData(); // Refresh the list
    } catch (error: any) {
      console.error('Recruit error:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to recruit employee.',
        variant: 'destructive',
      });
    } finally {
      setConfirmingEmployeeId(null); // Close dialog
    }
  };

  return (
    <div className="space-y-3">
      {/* Search & Filter Section */}
      <div className="space-y-5 rounded-lg bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Users2 className="h-6 w-6" />
            Pending Employees
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email"
              className="h-10 text-sm"
            />
          </div>
          <div className="flex w-full flex-wrap items-center gap-3">
            <Button
              onClick={handleSearch}
              className="flex h-9 w-20 items-center gap-1 bg-supperagent text-white hover:bg-supperagent/90"
              size="sm"
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              size="sm"
              className="flex h-9 items-center gap-1"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Employee Table */}
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <BlinkingDots size="large" color="bg-supperagent" />
          </div>
        ) : employees.length === 0 ? (
          <div className="flex justify-center py-8 text-gray-500">
            No employees found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      {employee.title} {employee.firstName} {employee.initial}{' '}
                      {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee?.phone}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                     

                      {/* ✅ Recruit Button with Confirmation Dialog */}
                      <AlertDialog
                        open={confirmingEmployeeId === employee._id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setConfirmingEmployeeId(null);
                          }
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className=""
                            onClick={() => setConfirmingEmployeeId(employee._id)}
                          >
                            Recruit
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Recruitment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to recruit{' '}
                              <strong>
                                {employee.firstName} {employee.lastName}
                              </strong>
                              ?This action is irreversible and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleRecruit}
                              className="bg-supperagent text-white hover:bg-supperagent/90"
                            >
                              Yes, Recruit
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                       <Button
                        variant="ghost"
                        size="sm"
                        className="bg-supperagent text-white hover:bg-supperagent/90"
                        onClick={() => navigate(`#`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6">
              <DynamicPagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}