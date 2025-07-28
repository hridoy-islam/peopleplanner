import { useEffect, useState } from 'react';
import { Pen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
// import { InstitutionDialog } from './components/institution-dialog';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { BlinkingDots } from '@/components/shared/blinking-dots';
// import { DataTablePagination } from '../students/view/components/data-table-pagination';
import { Input } from '@/components/ui/input';
import moment from 'moment';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { useNavigate } from 'react-router-dom';


export default function TrainingPage() {
  const [training, setTraining] = useState<any>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any>();
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (page, entriesPerPage, searchTerm = '') => {
    try {
      if (initialLoading) setInitialLoading(true);
      const response = await axiosInstance.get(`/hr/training`, {
        params: {
          page,
          limit: entriesPerPage,
          ...(searchTerm ? { searchTerm } : {})
        }
      });
      setTraining(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error) {
      console.error('Error fetching Training:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (editingTraining) {
        // Update training
        response = await axiosInstance.patch(
          `/hr/training/${editingTraining?._id}`,
          data
        );
      } else {

        // Create new training

        response = await axiosInstance.post(`/hr/training`, data);
      }

      // Check if the API response indicates success
      if (response.data && response.data.success === true) {
        toast({
          title: response.data.message || 'Record Updated successfully',
          className: 'bg-supperagent border-none text-white'
        });
      } else if (response.data && response.data.success === false) {
        toast({
          title: response.data.message || 'Operation failed',
          className: 'bg-red-500 border-none text-white'
        });
      } else {
        toast({
          title: 'Unexpected response. Please try again.',
          className: 'bg-red-500 border-none text-white'
        });
      }

      // Refresh data
      fetchData(currentPage, entriesPerPage);
      setEditingTraining(undefined); // Reset editing state
    } catch (error) {
      toast({
        title: 'An error occurred. Please try again.',
        className: 'bg-red-500 border-none text-white'
      });
    }
  };

    const handleStatusChange = async (id, status) => {
      try {
        const updatedStatus = status ? 'active' : 'inactive';
        await axiosInstance.patch(`/hr/training/${id}`, {
          status: updatedStatus
        });
        toast({
          title: 'Record updated successfully',
          className: 'bg-supperagent border-none text-white'
        });
        fetchData(currentPage, entriesPerPage);
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

  const handleEdit = (training) => {
    setEditingTraining(training);
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchData(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleSearch = () => {
    fetchData(currentPage, entriesPerPage, searchTerm);
  };

  const navigate = useNavigate()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Training</h1>
        <Button
          className="bg-supperagent text-white hover:bg-supperagent/90"
          size={'sm'}
          onClick={()=>{navigate(`/admin/hr/create-training`)}}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Training
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Training Type"
          className="h-8 max-w-[400px]"
        />
        <Button
          onClick={handleSearch}
          size="sm"
          className="min-w-[100px] border-none bg-supperagent text-white hover:bg-supperagent/90"
        >
          Search
        </Button>
      </div>

      <div className="rounded-md bg-white p-4 shadow-lg">
        {initialLoading ? (
          <div className="flex justify-center py-6">
            <BlinkingDots size="large" color="bg-supperagent" />
          </div>
        ) : training.length === 0 ? (
          <div className="flex justify-center py-6 text-gray-500">
            No records found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training Name</TableHead>
                <TableHead>Training Description</TableHead>
                <TableHead>Is Recurring</TableHead>            
                <TableHead>Validity Days</TableHead>            
                <TableHead>Expiry Days</TableHead>            
                <TableHead className=" text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {training.map((training) => (
                <TableRow key={training._id}>
                  <TableCell>{training.name}</TableCell>
                  <TableCell>{training.description}</TableCell>
                  
                  <TableCell >
                    {training.isRecurring === true ? "Yes" : "No"}
                    {/* {moment(training.isRecurring).format('MMMM Do YYYY')} */}
                  </TableCell>
                
                  <TableCell >{training.validityDays}</TableCell>
                  <TableCell >{training.reminderBeforeDays}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="border-none bg-supperagent text-white hover:bg-supperagent/90"
                      size="icon"
                      onClick={()=>{navigate(`/admin/hr/edit-training/${training._id}`)}}
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <DynamicPagination
          pageSize={entriesPerPage}
          setPageSize={setEntriesPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      
    </div>
  );
}
