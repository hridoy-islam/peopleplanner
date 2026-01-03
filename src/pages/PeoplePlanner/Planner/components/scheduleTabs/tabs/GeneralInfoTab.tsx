import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import { EditableField } from '../components/EditableField';
import axiosInstance from '@/lib/axios';
import { toast } from '@/components/ui/use-toast';

// Define minimal interfaces based on your API call
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Funder {
  _id: string;
  funderName: string; // Adjust based on your actual API response structure
}

interface GeneralInfoTabProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onDateChange: (field: string, value: string) => void;
  onSelectChange: (field: string, value: string) => void;
  isFieldSaving: Record<string, boolean>;
  getMissingFields: (tab: any, formData: Record<string, any>) => string[];
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  formData,
  onUpdate,
  onDateChange,
  onSelectChange,
  isFieldSaving,
  getMissingFields
}) => {
  // State for data
  const [users, setUsers] = useState<User[]>([]);
  const [funders, setFunders] = useState<Funder[]>([]);
  const [loading, setLoading] = useState(false);

  const missingFields = getMissingFields('general', formData);

  const isFieldMissing = (fieldKey: string) => {
    return missingFields.includes(fieldKey);
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return '';
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    const duration = moment.duration(end.diff(start)).asMinutes();
    return `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`;
  };

  // Fetch Data (Users & Funders) on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Users
        const usersReq = axiosInstance.get('/users', {
          params: {
            limit: 'all',
            role: ['serviceUser', 'staff'],
            fields: 'title firstName lastName middleInitial phone email role departmentId designationId image'
          }
        });

        // 2. Fetch Funders 
        const fundersReq = axiosInstance.get('/service-funder?fields=title,firstName,lastName,middleInitial,phone,email', {
          params: {
            limit: 'all'
          }
        });

        const [usersRes, fundersRes] = await Promise.all([usersReq, fundersReq]);

        const fetchedUsers = usersRes?.data?.data?.result || usersRes?.data?.data || [];
        const fetchedFunders = fundersRes?.data?.data?.result || fundersRes?.data?.data || [];

        setUsers(fetchedUsers);
        setFunders(fetchedFunders);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({ title: 'Failed to load dropdown data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Memoized Options ---

  const serviceUserOptions = useMemo(() => {
    return users
      .filter((u) => u.role === 'serviceUser' || u.role === 'client')
      .map((u) => ({
        value: u._id,
        label: `${u.firstName} ${u.lastName}`
      }));
  }, [users]);

  const employeeOptions = useMemo(() => {
    return users
      .filter((u) => u.role === 'staff' || u.role === 'employee')
      .map((u) => ({
        value: u._id,
        label: `${u.firstName} ${u.lastName}`
      }));
  }, [users]);

  const funderOptions = useMemo(() => {
    return funders.map((f) => ({
      value: f._id,
      label: f.firstName + ' ' + f.lastName // Assuming the API returns 'funderName'
    }));
  }, [funders]);

  return (
    <div className="space-y-3">
      {/* Date & Time Section */}
      <div className="rounded border border-gray-200 bg-white p-2">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">
          Date & Time
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <EditableField
            id="date"
            label="Date"
            value={formData.date}
            type="date"
            onUpdate={(value) => onDateChange('date', value)}
            isSaving={isFieldSaving.date}
            required
            isMissing={isFieldMissing('date')}
            compact
          />
          <EditableField
            id="startTime"
            label="Start"
            value={formData.startTime}
            type="time"
            onUpdate={(value) => onUpdate('startTime', value)}
            isSaving={isFieldSaving.startTime}
            required
            isMissing={isFieldMissing('startTime')}
            compact
          />
          <EditableField
            id="endTime"
            label="End"
            value={formData.endTime}
            type="time"
            onUpdate={(value) => onUpdate('endTime', value)}
            isSaving={isFieldSaving.endTime}
            required
            isMissing={isFieldMissing('endTime')}
            compact
          />
          <EditableField
            id="duration"
            label="Duration"
            value={calculateDuration(formData.startTime, formData.endTime)}
            readOnly
            isSaving={false}
            compact
          />
          <EditableField
            id="timeInMinutes"
            label="Mins"
            value={formData.timeInMinutes}
            type="number"
            onUpdate={(value) => onUpdate('timeInMinutes', value)}
            isSaving={isFieldSaving.timeInMinutes}
            required
            isMissing={isFieldMissing('timeInMinutes')}
            compact
          />
          <EditableField
            id="travelTime"
            label="Travel (mins)"
            value={formData.travelTime}
            type="number"
            onUpdate={(value) => onUpdate('travelTime', value)}
            isSaving={isFieldSaving.travelTime}
            required
            isMissing={isFieldMissing('travelTime')}
            compact
          />
        </div>
      </div>

      {/* Service User & Funder Section */}
      <div className="rounded border border-gray-200 bg-white p-2">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">
          Service User & Funder
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <EditableField
            id="branch"
            label="Branch"
            value={formData.branch}
            type="select"
            options={[
              { value: 'Everycare Romford', label: 'Everycare Romford' }
            ]}
            onUpdate={(value) => onSelectChange('branch', value)}
            isSaving={isFieldSaving.branch}
            required
            isMissing={isFieldMissing('branch')}
            compact
          />
          <EditableField
            id="area"
            label="Area"
            value={formData.area}
            type="select"
            options={[{ value: 'care', label: 'Care' }]}
            onUpdate={(value) => onSelectChange('area', value)}
            isSaving={isFieldSaving.area}
            required
            isMissing={isFieldMissing('area')}
            compact
          />

          {/* Dynamic Service User Dropdown */}
          <EditableField
            id="serviceUser"
            label="Service User"
            // Handle case where formData.serviceUser might be an object (populated) or string (ID)
            value={
              typeof formData.serviceUser === 'object'
                ? formData.serviceUser?._id
                : formData.serviceUser
            }
            type="select"
            options={serviceUserOptions}
            onUpdate={(value) => onSelectChange('serviceUser', value)}
            isSaving={isFieldSaving.serviceUser}
            required
            isMissing={isFieldMissing('serviceUser')}
            compact
          />

          {/* Dynamic Funder Dropdown */}
          <EditableField
            id="serviceFunder"
            label="Funder"
            // Handle case where formData.serviceFunder might be an object (populated) or string (ID)
            value={
              typeof formData.serviceFunder === 'object'
                ? formData.serviceFunder?._id
                : formData.serviceFunder
            }
            type="select"
            options={funderOptions}
            onUpdate={(value) => onSelectChange('serviceFunder', value)}
            isSaving={isFieldSaving.serviceFunder}
            required
            isMissing={isFieldMissing('serviceFunder')}
            compact
          />
        </div>
      </div>

      {/* Employee Section */}
      <div className="rounded border border-gray-200 bg-white p-2">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">Employee</h3>
        <div className="grid grid-cols-3 gap-2">
          <EditableField
            id="employeeBranch"
            label="Branch"
            value={formData.employeeBranch}
            type="select"
            options={[
              { value: 'Everycare Romford', label: 'Everycare Romford' }
            ]}
            onUpdate={(value) => onSelectChange('employeeBranch', value)}
            isSaving={isFieldSaving.employeeBranch}
            required
            isMissing={isFieldMissing('employeeBranch')}
            compact
          />
          <EditableField
            id="employeeArea"
            label="Area"
            value={formData.employeeArea}
            type="select"
            options={[{ value: 'care', label: 'Care' }]}
            onUpdate={(value) => onSelectChange('employeeArea', value)}
            isSaving={isFieldSaving.employeeArea}
            required
            isMissing={isFieldMissing('employeeArea')}
            compact
          />

          {/* Dynamic Employee Dropdown */}
          <EditableField
            id="employee"
            label="Employee"
            // Handle case where formData.employee might be an object (populated) or string (ID)
            value={
              typeof formData.employee === 'object'
                ? formData.employee?._id
                : formData.employee
            }
            type="select"
            options={employeeOptions}
            onUpdate={(value) => onSelectChange('employee', value)}
            isSaving={isFieldSaving.employee}
            required
            isMissing={isFieldMissing('employee')}
            compact
          />
        </div>
      </div>

      {/* Service & Rates Section */}
      <div className="rounded border border-gray-200 bg-white p-2">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">
          Service & Rates
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <EditableField
            id="serviceType"
            label="Service Type"
            value={formData.serviceType}
            type="select"
            options={[{ value: 'care', label: 'Care' }]}
            onUpdate={(value) => onSelectChange('serviceType', value)}
            isSaving={isFieldSaving.serviceType}
            required
            isMissing={isFieldMissing('serviceType')}
            compact
          />
          <EditableField
            id="visitType"
            label="Visit Type"
            value={formData.visitType}
            type="select"
            options={[
              { value: 'other', label: 'Other' },
              { value: 'routine', label: 'Routine' }
            ]}
            onUpdate={(value) => onSelectChange('visitType', value)}
            isSaving={isFieldSaving.visitType}
            required
            isMissing={isFieldMissing('visitType')}
            compact
          />
          <EditableField
            id="payRate"
            label="Pay Rate"
            value={formData.payRate}
            type="number"
            onUpdate={(value) => onUpdate('payRate', value)}
            isSaving={isFieldSaving.payRate}
            required
            isMissing={isFieldMissing('payRate')}
            compact
          />
          <EditableField
            id="invoiceRate"
            label="Invoice Rate"
            value={formData.invoiceRate}
            type="number"
            onUpdate={(value) => onUpdate('invoiceRate', value)}
            isSaving={isFieldSaving.invoiceRate}
            required
            isMissing={isFieldMissing('invoiceRate')}
            compact
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="rounded border border-gray-200 bg-white p-2">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">Summary</h3>
        <div className="grid grid-cols-3 gap-2">
          <EditableField
            id="cancellation"
            label="Cancellation"
            value={formData.cancellation}
            type="select"
            options={[
              { value: '', label: 'None' },
              { value: 'Cancelled by Client', label: 'Cancelled by Client' },
              { value: 'Cancelled by Staff', label: 'Cancelled by Staff' }
            ]}
            onUpdate={(value) => onSelectChange('cancellation', value)}
            isSaving={isFieldSaving.cancellation}
            compact
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;