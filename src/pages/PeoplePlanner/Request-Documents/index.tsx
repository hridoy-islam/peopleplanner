import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  User,
  Clock,
  Search,
  Check,
  X,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import axiosInstance from '@/lib/axios';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';

// Define Interfaces
interface DocumentRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    departmentId: {
      _id: string;
      departmentName: string;
    };
    designationId: {
      _id: string;
      title: string;
    };
  };
  documentType: string;
  reason: string;
  requestDate: string | Date;
  status: RequestStatus;
  approvedPdfUrl?: string;
  startDate?: Date;
  endDate?: Date;
}

// Interface for React Select options
interface StaffOption {
  value: string;
  label: string;
}

type RequestStatus = 'pending' | 'approved' | 'rejected';

const AdminRequestDocumentPage = () => {
  const { user } = useSelector((state: any) => state.auth);

  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  
  // State for the User Filter
  const [selectedStaff, setSelectedStaff] = useState<StaffOption | null>(null);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<DocumentRequest | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // --- 1. Fetch Staff for Dropdown ---
  const fetchStaffUsers = async () => {
    try {
      const response = await axiosInstance.get('/users', {
        params: {
          role: 'staff',
          limit: 'all'
        }
      });
      
      const users = response.data.data?.result || response.data.data || [];
      
      const options = users.map((u: any) => ({
        value: u._id,
        label: `${u.firstName} ${u.lastName} (${u.email || u.employeeId})`
      }));
      
      setStaffOptions(options);
    } catch (error) {
      console.error('Failed to fetch staff users:', error);
    }
  };

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  // --- 2. Fetch Requests ---
  const fetchRequests = async (
    page: number,
    entriesPerPage: number,
    userId = '' // Argument renamed to userId for clarity
  ) => {
    try {
      // Build params object dynamically
      const params: any = {
        status: 'pending',
        page,
        limit: entriesPerPage,
      };

      // Corrected: Send userId key instead of searchTerm
      if (userId) {
        params.userId = userId;
      }

      const response = await axiosInstance.get('/hr/request-document', {
        params
      });
      setTotalPages(response.data.data.meta.totalPage);
      setRequests(response.data.data?.result || []);
    } catch (error) {
      console.error('Failed to fetch document requests:', error);
    }
  };

  // Initial fetch and on pagination change
  useEffect(() => {
    fetchRequests(currentPage, entriesPerPage, selectedStaff?.value || '');
  }, [currentPage, entriesPerPage]); 

  // Handle Dropdown Change
  const handleStaffChange = (newValue: StaffOption | null) => {
    setSelectedStaff(newValue);
    setCurrentPage(1); // Reset to first page
    // Pass the user ID directly
    fetchRequests(1, entriesPerPage, newValue?.value || '');
  };

  const handleApproveClick = (request: DocumentRequest) => {
    setSelectedRequest(request);
    // Reset upload state
    setUploadedFileUrl(null);
    setSelectedFileName(null);
    setUploadError(null);
    setShowApproveDialog(true);
  };

  const handleRejectConfirm = (id: string) => {
    setRejectId(id);
    setShowRejectDialog(true);
  };

  const handleRejectConfirmed = async () => {
    if (!rejectId) return;

    try {
      await axiosInstance.patch(`/hr/request-document/${rejectId}`, {
        status: 'rejected',
        updatedBy: user?._id
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === rejectId ? { ...req, status: 'rejected' } : req
        )
      );

      setShowRejectDialog(false);
      setRejectId(null);
    } catch (error) {
      console.error('Failed to reject document request:', error);
      alert('Failed to reject request. Please try again.');
      setShowRejectDialog(false);
      setRejectId(null);
    }
  };

  // === Upload to /documents ===
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setSelectedFileName(file.name);

    const formData = new FormData();
    formData.append('entityId', user._id);
    formData.append('file_type', 'document');
    formData.append('file', file);

    try {
      const res = await axiosInstance.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data?.data?.fileUrl;
      if (!fileUrl) throw new Error('No file URL returned');
      setUploadedFileUrl(fileUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Failed to upload document. Please try again.');
      setUploadedFileUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileUrl(null);
    setSelectedFileName(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // === Approve with document URL ===
  const handleApproveWithPdf = async () => {
    if (!selectedRequest || !uploadedFileUrl) {
      if (!uploadedFileUrl) {
        setUploadError('Please upload a PDF document.');
      }
      return;
    }

    setLoading(true);

    try {
      const payload = {
        status: 'approved',
        document: uploadedFileUrl,
        updatedBy: user?._id
      };

      const response = await axiosInstance.patch(
        `/hr/request-document/${selectedRequest._id}`,
        payload
      );

      const approvedPdfUrl =
        response.data.data?.approvedPdfUrl || uploadedFileUrl;

      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? { ...req, status: 'approved', approvedPdfUrl }
            : req
        )
      );

      setShowApproveDialog(false);
      setUploadedFileUrl(null);
      setSelectedFileName(null);
    } catch (error: any) {
      console.error('Failed to approve document request:', error);
      const message =
        error.response?.data?.message || 'Approval failed. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Requests Table */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center ">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <FileText className="h-6 w-6" />
              Pending Requests
            </h2>
            
            {/* React Select for Staff Filtering */}
            <div className="w-full max-w-md">
              <Select
                options={staffOptions}
                value={selectedStaff}
                onChange={handleStaffChange}
                isClearable
                isSearchable
                placeholder="Select staff to filter..."
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900">
                No pending requests
              </h3>
              <p className="text-gray-500">
                {selectedStaff 
                  ? "No requests found for this staff member." 
                  : "All document requests have been processed."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {req?.userId?.firstName} {req?.userId?.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{req?.documentType}</span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {req.userId?.departmentId.departmentName ?? '-'}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(req.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600">
                        {req.startDate && req.endDate ? (
                          <span className="text-sm text-muted-foreground">
                            {moment(req.startDate).format('DD MMM, YYYY')} -{' '}
                            {moment(req.endDate).format('DD MMM, YYYY')}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApproveClick(req)}
                          className="bg-supperagent text-white hover:bg-supperagent/90"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleRejectConfirm(req._id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {requests.length > 40 && (
                <>
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
            </>
          )}
        </div>
      </div>

      {/* Approve with PDF Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Document Request</DialogTitle>
            <DialogDescription>
              You are approving a request from{' '}
              <strong>
                {selectedRequest?.userId.firstName}{' '}
                {selectedRequest?.userId.lastName}
              </strong>{' '}
              for a <strong>{selectedRequest?.documentType}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Styled Upload Zone */}
            <div>
              <Label htmlFor="pdfUpload">
                Upload Final Document (PDF - Required)
              </Label>
              <div
                className={cn(
                  'relative mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
                  uploadedFileUrl
                    ? 'border-green-500 bg-green-50'
                    : isUploading
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                )}
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  disabled={isUploading}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm text-blue-600">Uploading...</p>
                  </div>
                ) : uploadedFileUrl ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Uploaded
                        </p>
                        {selectedFileName && (
                          <p className="text-xs text-gray-600">
                            {selectedFileName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <div className="text-sm font-medium text-gray-700">
                      Click to Upload{' '}
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="mt-2 text-sm text-destructive">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false);
                setUploadedFileUrl(null);
                setSelectedFileName(null);
                setUploadError(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveWithPdf}
              disabled={!uploadedFileUrl || loading || isUploading}
              className="bg-supperagent text-white hover:bg-supperagent/90"
            >
              {loading ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this document request? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirmed}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequestDocumentPage;