import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Users,
  Filter,
  MoreHorizontal,
  Search,
  Loader2
} from 'lucide-react';
import Select from 'react-select'; // Import react-select
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Import your modals and utilities
import BulkInvoiceModal from './BlukInvoiceModal';
import PaymentModal from './PaymentModal';
import { downloadPayslipPDF } from './PayslipPDF';
import axiosInstance from '@/lib/axios';

// --- Interfaces based on your Mongoose Schema ---

interface User {
  _id: string;
  name: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface ServiceItem {
  _id: string;
  startDate: string;
  endDate: string;
}

interface Payroll {
  _id: string;
  userId: User; // Populated field
  serviceNumber: number;
  period: string;
  amount: number;
  amountPaid: number;
  status: 'due' | 'paid' | 'partial';
  services: ServiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface OptionType {
  value: string;
  label: string;
}

interface PayslipsPageProps {
  onCreatePayslip: () => void;
}

export default function PayslipsPage({ onCreatePayslip }: PayslipsPageProps) {
  // --- State ---
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const [selectedUserFilter, setSelectedUserFilter] = useState<OptionType | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);


  // 1. Fetch Users for the Select Filter
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axiosInstance.get('/users', {
        params: {
          role: 'serviceUser',
          limit: 'all'
        }
      });
      
      const users = response.data.data?.result;
      
      const options = users.map((user: User) => ({
        value: user._id,
        label: user?.firstName + ' ' + user?.lastName
      }));
      setUserOptions(options);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 2. Fetch Payrolls (Triggered on mount and on search click)
  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      // Apply filter if selected
      if (selectedUserFilter) {
        params.userId = selectedUserFilter.value;
      }

      const response = await axiosInstance.get('/payrolls', { params });
      // Adjust strictly to your API response structure
      setPayrolls(response.data.data?.result || response.data); 
    } catch (error) {
      console.error("Error fetching payrolls:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---

  useEffect(() => {
    fetchUsers();
    fetchPayrolls(); // Initial load of all payrolls
  }, []);

  // --- Helpers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'due':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handlePayClick = (payroll: Payroll) => {
    setSelectedUser({
      id: payroll.userId._id,
      name: payroll.userId.name
    });
    setPaymentAmount(payroll.amount - payroll.amountPaid); // Pay remaining balance
    setShowPaymentModal(true);
  };

  // --- PDF Handlers ---
  const handleDownloadPDF = async (payroll: Payroll, detailed: boolean) => {
    try {
      // You might need to map the backend 'payroll' object to the structure your PDF generator expects
      // dependent on how strictly typed downloadPayslipPDF is.
      await downloadPayslipPDF(payroll, detailed);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white shadow-sm">
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            
            {/* Title and Filter Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">Payslips</h1>
              
              <div className="flex w-full sm:w-auto gap-2 items-center">
                {/* React Select for Filtering */}
                <div className="w-full sm:w-64 z-20">
                  <Select
                    options={userOptions}
                    value={selectedUserFilter}
                    onChange={(option) => setSelectedUserFilter(option)}
                    isLoading={loadingUsers}
                    placeholder="Select User..."
                    isClearable
                    className="text-sm"
                    classNames={{
                      control: () => "border-input bg-background border rounded-md shadow-sm h-10 px-1",
                      menu: () => "bg-background  rounded-md shadow-lg mt-1",
                      option: ({ isFocused, isSelected }) => 
                        `px-3 py-2 cursor-pointer ${isSelected ? 'bg-primary text-primary-foreground' : isFocused ? 'bg-accent text-accent-foreground' : 'text-foreground'}`
                    }}
                  />
                </div>
                
                {/* Search Trigger Button */}
                <Button variant="outline" size="icon" onClick={fetchPayrolls} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
                
                
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={() => setShowBulkModal(true)}
                className="bg-supperagent text-white hover:bg-supperagent/90"
              >
                <Users className="mr-2 h-4 w-4" />
                Generate Payslip (Bulk)
              </Button>
              <Button onClick={onCreatePayslip} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Payslip
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total / Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2 text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading data...
                      </div>
                    </TableCell>
                 </TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    No payslips found.
                  </TableCell>
                </TableRow>
              ) : (
                payrolls.map((payroll) => (
                  <TableRow key={payroll._id}>
                    {/* Displaying last 6 chars of ID for brevity, or full ID */}
                    <TableCell className="font-semibold text-gray-600">
                      #{payroll._id.slice(-6).toUpperCase()}
                    </TableCell>

                    <TableCell className="font-medium">
                      {payroll.userId?.name || 'Unknown User'}
                    </TableCell>
                    
                    {/* Using serviceNumber from schema */}
                    <TableCell>
                      {payroll.serviceNumber} Items
                    </TableCell>
                    
                    <TableCell>{payroll.period}</TableCell>
                    
                    <TableCell className="font-bold text-gray-900">
                       {/* Display Amount and Amount Paid */}
                       <div className="flex flex-col">
                        <span>${payroll.amount.toLocaleString()}</span>
                        <span className="text-xs font-normal text-gray-500">
                          Paid: ${payroll.amountPaid.toLocaleString()}
                        </span>
                       </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(payroll.status)}>
                        {getStatusText(payroll.status)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="flex justify-end gap-2">
                      {payroll.status !== 'paid' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => handlePayClick(payroll)}
                        >
                          Pay
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-supperagent text-white hover:bg-supperagent/90"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-gray-300 bg-white text-black"
                        >
                          <DropdownMenuItem onClick={() => handleDownloadPDF(payroll, true)}>
                            Detailed PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPDF(payroll, false)}>
                            Normal PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-gray-300 bg-white text-black"
                        >
                          <DropdownMenuItem className="text-red-600 hover:text-red-600">
                            Delete Payslip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <BulkInvoiceModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoiceAmount={paymentAmount} // Passing calculated remaining amount
        userInfo={selectedUser}
      />
    </div>
  );
}