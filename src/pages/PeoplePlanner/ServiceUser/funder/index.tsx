import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
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
import { Eye, Plus, Search } from 'lucide-react';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/lib/axios'; // ✅ Import axiosInstance

export default function ServiceUserFunder() {
  const [fundUsers, setFundUsers] = useState<any[]>([]); // ✅ Initialize as empty array
  const [serviceUser, setServiceUser] = useState<any>(null); // ✅ Store service user info
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams<{ id: string }>(); // ✅ Type safety

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const navigate = useNavigate();

  // ✅ Fetch Service User and their Funders
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 1. Fetch Service User (to display name in heading)
        const userRes = await axiosInstance.get(`/users/${id}`);
        setServiceUser(userRes.data.data);

        // 2. Fetch Funders for this Service User
        const fundersRes = await axiosInstance.get(`/hr/service-funder`, {
          params: { serviceUser: id }
        });
        setFundUsers(fundersRes.data.data.result || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setFundUsers([]);
        setServiceUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Handle view action
  const handleView = (funderId: string) => {
    navigate(`${funderId}`);
  };

  // Filtering logic
  const filteredFundUsers = useMemo(() => {
    if (!fundUsers.length) return [];

    return fundUsers.filter((user) => {
      const fullName = [user.title, user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const search = searchTerm.toLowerCase();

      if (
        search &&
        !fullName.includes(search) &&
        !user.organization?.toLowerCase().includes(search) &&
        !user.phone?.includes(search) &&
        !user.email?.toLowerCase().includes(search)
      ) {
        return false;
      }

      return true;
    });
  }, [fundUsers, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredFundUsers.length / entriesPerPage);
  const paginatedFundUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredFundUsers.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredFundUsers, currentPage, entriesPerPage]);

  // Reset currentPage if filtered list shrinks below current page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // ✅ Helper to format full name for heading
  const getUserName = () => {
    if (!serviceUser) return 'Loading...';
    return [serviceUser.title, serviceUser.firstName, serviceUser.lastName]
      .filter(Boolean)
      .join(' ');
  };

  if (loading && !serviceUser) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md bg-white p-6 shadow-md">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-md bg-white p-6 shadow-md">
      <div className="flex flex-row justify-between">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-semibold">{getUserName()} Funders</h1>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              className="min-w-[300px] rounded border px-3 py-1"
              placeholder="Search by Name, Org, Email or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="bg-supperagent text-white hover:bg-supperagent/90">
              <Search className="mr-1 h-4 w-4" /> Search
            </Button>
          </div>
        </div>

        <Button
          className="flex gap-2 bg-supperagent text-white hover:bg-supperagent/90"
          onClick={() => navigate('create')}
        >
          <Plus className="h-4 w-4" /> Add Funder
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedFundUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                No matching funders found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedFundUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  {[user.title, user.firstName, user.lastName]
                    .filter(Boolean)
                    .join(' ')}
                </TableCell>
                <TableCell>
                  {user.type
                    ? user.type.charAt(0).toUpperCase() + user.type.slice(1)
                    : '-'}
                </TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(user._id)}
                    className="bg-supperagent text-white hover:bg-supperagent/90"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <DynamicPagination
        pageSize={entriesPerPage}
        setPageSize={setEntriesPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
