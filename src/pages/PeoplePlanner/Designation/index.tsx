import { useEffect, useState } from 'react';
import { Eye, Pen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { useNavigate } from 'react-router-dom';

type Permission = {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
};

type Designation = {
  _id: string;
  title: string;
  description?: string;
  permissions: Permission;
};

export default function Designation() {
  const [designation, setDesignation] = useState<Designation[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (page: number, limit: number, search = '') => {
    try {
      setInitialLoading(true);
      const response = await axiosInstance.get(`/hr/designation`, {
        params: {
          page,
          limit,
          ...(search ? { searchTerm: search } : {})
        }
      });
      setDesignation(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error) {
      console.error('Error fetching designations:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, entriesPerPage, searchTerm);
  };

  const navigate = useNavigate();

  const handleNewDesignationClick = () => {
    navigate('/admin/people-planner/designations/create');
  };

  const handleEdit = (item: Designation) => {
    navigate(`/admin/people-planner/designations/edit/${item._id}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Designations</h1>
        <Button
          className="bg-supperagent text-white hover:bg-supperagent/90"
          size="sm"
          onClick={handleNewDesignationClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Designation
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Designation Title"
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
        ) : designation.length === 0 ? (
          <div className="flex justify-center py-6 text-gray-500">
            No records found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designation.map((d) => (
                <TableRow key={d._id}>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>{d.description || '—'}</TableCell>
                 
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="border-none bg-supperagent text-white hover:bg-supperagent/90"
                      size="icon"
                      onClick={() => handleEdit(d)}
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
