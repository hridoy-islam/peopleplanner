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
import { Input } from '@/components/ui/input';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { useNavigate } from 'react-router-dom';

// Mock data for devices
const mockDevices = [
  {
    id: '1',
    carerName: 'John Smith',
    deviceName: 'Samsung Galaxy S21',
    deviceType: 'Smartphone',
    status: 'Active'
  },
  {
    id: '2',
    carerName: 'Emily Johnson',
    deviceName: 'iPad Pro 12.9"',
    deviceType: 'Tablet',
    status: 'Active'
  },
  {
    id: '3',
    carerName: 'Michael Brown',
    deviceName: 'Google Pixel 6',
    deviceType: 'Smartphone',
    status: 'Inactive'
  },
  {
    id: '4',
    carerName: 'Sarah Williams',
    deviceName: 'iPhone 13',
    deviceType: 'Smartphone',
    status: 'Active'
  },
  {
    id: '5',
    carerName: 'David Lee',
    deviceName: 'Samsung Galaxy Tab S7',
    deviceType: 'Tablet',
    status: 'Inactive'
  },
  {
    id: '6',
    carerName: 'Jennifer Davis',
    deviceName: 'OnePlus 9 Pro',
    deviceType: 'Smartphone',
    status: 'Active'
  },
  {
    id: '7',
    carerName: 'Robert Wilson',
    deviceName: 'iPad Air',
    deviceType: 'Tablet',
    status: 'Active'
  },
  {
    id: '8',
    carerName: 'Lisa Taylor',
    deviceName: 'iPhone SE',
    deviceType: 'Smartphone',
    status: 'Active'
  },
  {
    id: '9',
    carerName: 'James Anderson',
    deviceName: 'Google Pixel Tablet',
    deviceType: 'Tablet',
    status: 'Inactive'
  },
  {
    id: '10',
    carerName: 'Patricia Martin',
    deviceName: 'Samsung Galaxy Z Flip',
    deviceType: 'Smartphone',
    status: 'Active'
  }
];

export default function DevicePage() {
  const [devices, setDevices] = useState<any>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

  const fetchData = async (page: number, entriesPerPage: number, searchTerm = '') => {
    try {
      setInitialLoading(true);
      // In a real app, you would use the axiosInstance to fetch data
      // const response = await axiosInstance.get(`/devices`, {
      //   params: {
      //     page,
      //     limit: entriesPerPage,
      //     ...(searchTerm ? { searchTerm } : {})
      //   }
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Filter data based on search term
      let filteredData = [...mockDevices];
      if (searchTerm) {
        filteredData = mockDevices.filter(device => 
          device.carerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Paginate the data
      const startIndex = (page - 1) * entriesPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);
      
      setDevices(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / entriesPerPage));
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Failed to fetch devices',
        variant: 'destructive'
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deviceToDelete) {
      try {
        // In a real app, you would use the axiosInstance to delete
        // await axiosInstance.delete(`/devices/${deviceToDelete}`);
        
        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        
        toast({
          title: 'Device deleted successfully',
        });
        fetchData(currentPage, entriesPerPage);
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error('Error deleting device:', error);
        toast({
          title: 'Failed to delete device',
          variant: 'destructive'
        });
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleSearch = () => {
    fetchData(1, entriesPerPage, searchTerm);
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Device Management</h1>
        {/* <Button
          className="bg-supperagent text-white hover:bg-supperagent/90"
          size={'sm'}
          onClick={() => navigate('/admin/devices/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Assign New Device
        </Button> */}
      </div>

      <div className="flex items-center space-x-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by carer or device name"
          className="h-8 max-w-[400px]"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          size="sm"
          className="min-w-[100px] bg-supperagent text-white hover:bg-supperagent/90"
        >
          Search
        </Button>
      </div>

      <div className="rounded-md bg-white p-4 shadow">
        {initialLoading ? (
          <div className="flex justify-center py-6">
            <BlinkingDots size="large" color="bg-primary" />
          </div>
        ) : devices.length === 0 ? (
          <div className="flex justify-center py-6 text-gray-500">
            No devices found.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Carer Name</TableHead>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Device Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device: any) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.carerName}</TableCell>
                    <TableCell>{device.deviceName}</TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={device.status === 'Active'} 
                          onCheckedChange={(checked) => {
                            // In a real app, you would update the status via API
                            const updatedDevices = devices.map(d => 
                              d.id === device.id 
                                ? {...d, status: checked ? 'Active' : 'Inactive'} 
                                : d
                            );
                            setDevices(updatedDevices);
                          }}
                        />
                        <span>{device.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {/* <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary bg-supperagent hover:bg-supperagent/90"
                        onClick={() => navigate(`/admin/devices/edit/${device.id}`)}
                      >
                        <Pen className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white bg-red-600 hover:bg-red-600/90"
                        onClick={() => {
                          setDeviceToDelete(device.id);
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the device assignment.
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