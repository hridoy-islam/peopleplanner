import React, { useEffect, useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  UserCheck,
  Loader2,
  Search,
  CalendarSearch // Added for the empty state
} from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

import axiosInstance from '@/lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { DynamicPagination } from '@/components/shared/DynamicPagination';

// --- Helper: Status Badge Styles ---
const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'unallocated':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

// --- Helper: User Cell Component ---
const UserCell = ({
  user,
  role,
  fallback,
  fallbackIcon: Icon,
  isUnallocated
}: any) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
        isUnallocated
          ? 'border-amber-100 bg-amber-50 text-amber-600'
          : 'border-slate-200 bg-slate-100 text-slate-600'
      }`}
    >
      {user?.firstName ? (
        <span className="text-xs font-bold">{user.firstName[0]}</span>
      ) : (
        <Icon className="h-4 w-4" />
      )}
    </div>
    <div className="flex flex-col">
      <span
        className={`text-sm font-medium ${isUnallocated ? 'italic text-amber-700' : 'text-slate-700'}`}
      >
        {user ? `${user.firstName} ${user.lastName}` : fallback}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-400">
        {role}
      </span>
    </div>
  </div>
);

// --- Custom Input for DatePicker ---
const CustomDateInput = forwardRef(
  ({ value, onClick, placeholder }: any, ref: any) => (
    <button
      className={`flex items-center gap-2 rounded-md border px-4 py-2 font-bold transition-colors ${
        !value
          ? 'border-supperagent bg-supperagent text-white hover:bg-supperagent/90'
          : 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100'
      }`}
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon
        className={`h-5 w-5 ${!value ? 'text-white' : 'text-supperagent'}`}
      />
      <span className="text-lg">
        {value ? moment(value).format('DD MMM YYYY') : placeholder}
      </span>
    </button>
  )
);

export default function SchedulePage() {
  // 1. Initialize as null so nothing shows initially
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);

  const user = useSelector((state: any) => state.auth.user);

  // --- Handlers ---
  const handlePrevDay = () => {
    if (selectedDate)
      setSelectedDate((d) => moment(d).subtract(1, 'days').toDate());
  };

  const handleNextDay = () => {
    if (selectedDate) setSelectedDate((d) => moment(d).add(1, 'days').toDate());
  };

  const handleDateChange = (date: Date) => {
    if (date) setSelectedDate(date);
  };

  // --- Fetch Logic ---
  useEffect(() => {
    // 2. Do not fetch if no date is selected
    if (!selectedDate) return;

    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

        const params: any = {
          dateFilter: formattedDate,
          page: currentPage,
          limit: entriesPerPage
        };

        if (user?.role === 'serviceUser') {
          params.serviceUser = user._id;
        } else if (user?.role === 'employee') {
          params.employee = user._id;
        }

        const response = await axiosInstance.get('/schedules', { params });

        setSchedules(response.data?.data?.result || []);

        if (response.data?.data?.meta) {
          setTotalPages(response.data.data.meta.totalPage || 1);
        }
      } catch (error) {
        console.error('Failed to fetch schedules', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedDate, currentPage, entriesPerPage, user]);

  return (
    // SINGLE CONTAINER START
    <div className="mx-auto flex flex-col overflow-hidden rounded-lg border border-slate-200  bg-white shadow-sm">
      {/* --- Unified Header Section --- */}
      <div className="flex flex-col items-center justify-between gap-4  p-5 md:flex-row">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Search Schedule</h1>
          <div className="flex items-center rounded-lg  bg-slate-50 p-1">
            {/* 3. Conditional Render: Left Button */}
            {selectedDate && (
              <button
                onClick={handlePrevDay}
                className="rounded-md p-2 text-slate-500 transition-all hover:bg-supperagent hover:text-white hover:shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="relative z-20 mx-1">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                customInput={<CustomDateInput placeholder="Select Date" />}
                dateFormat="dd MMM yyyy"
                todayButton="Jump to Today"
                popperClassName="react-datepicker-left"
                placeholderText="Select a date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                portalId="root"
              />
            </div>

            {/* 3. Conditional Render: Right Button */}
            {selectedDate && (
              <button
                onClick={handleNextDay}
                className="rounded-md p-2 text-slate-500 transition-all hover:bg-supperagent hover:text-white hover:shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="flex-1 p-0">
        {!selectedDate ? (
          // 4. Initial Empty State (Before Selection)
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center bg-slate-50/30 text-slate-400">
            <div className="mb-4 rounded-full bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <CalendarSearch className="h-12 w-12 text-supperagent/60" />
            </div>
            <p className="mt-2 max-w-xs text-center text-sm text-slate-500">
              Please select a date from the picker above to view the schedule
              for that day.
            </p>
          </div>
        ) : loading ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <BlinkingDots size="large" color="bg-supperagent" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-400">
            <div className="mb-3 rounded-full bg-slate-50 p-4">
              <CalendarIcon className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-600">
              No schedules found
            </p>
            <p className="text-sm">
              There are no visits for{' '}
              {moment(selectedDate).format('DD MMM YYYY')}
            </p>
          </div>
        ) : (
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="h-12 font-semibold text-slate-600">
                    Date
                  </TableHead>
                  <TableHead className="h-12 w-[180px] font-semibold text-slate-600">
                    Time / Duration
                  </TableHead>
                  <TableHead className="h-12 font-semibold text-slate-600">
                    Staff Member
                  </TableHead>
                  <TableHead className="h-12 font-semibold text-slate-600">
                    Service User
                  </TableHead>
                  <TableHead className="hidden h-12 font-semibold text-slate-600 md:table-cell">
                    Service Type
                  </TableHead>
                  <TableHead className="h-12 pr-6 text-right font-semibold text-slate-600">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((service) => {
                  const start = moment(service.startTime, 'HH:mm');
                  const end = moment(service.endTime, 'HH:mm');
                  const durationHrs = moment
                    .duration(end.diff(start))
                    .asHours()
                    .toFixed(2);

                  return (
                    <TableRow
                      key={service._id}
                      className="cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className=" font-medium text-slate-600">
                        {moment(service.date).format('DD MMM YYYY')}
                      </TableCell>

                      <TableCell className="py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-mono text-sm font-semibold text-slate-700">
                              {service.startTime}
                            </span>
                            <span className="text-slate-400">-</span>
                            <span className="font-mono text-sm font-semibold text-slate-700">
                              {service.endTime}
                            </span>
                          </div>
                          <span className="pl-5.5 text-xs font-medium tabular-nums text-slate-400">
                            {durationHrs} hrs
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-middle">
                        <UserCell
                          user={service.employee}
                          role="Carer"
                          fallback="Unallocated"
                          fallbackIcon={UserCheck}
                          isUnallocated={!service.employee}
                        />
                      </TableCell>

                      <TableCell className="align-middle">
                        <UserCell
                          user={service.serviceUser}
                          role="Service User"
                          fallback="Unknown"
                          fallbackIcon={Users}
                        />
                      </TableCell>

                      <TableCell className="hidden align-middle md:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-500/20"></span>
                          <span className="max-w-[150px] truncate text-sm font-medium text-slate-700">
                            {service.serviceType || 'General Care'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="pr-6 text-right align-middle">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${getStatusStyles(service.employee ? 'scheduled' : 'unallocated')}`}
                        >
                          {service.employee ? 'Scheduled' : 'Unallocated'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {schedules.length > 40 && (
              <div className="pt-4">
                <DynamicPagination
                  pageSize={entriesPerPage}
                  setPageSize={setEntriesPerPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Footer / Pagination Section --- */}
    </div>
    // SINGLE CONTAINER END
  );
}
