import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import {
  Calendar,
  Clock,
  UserCheck,
  Users,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Shared Components
import { DynamicPagination } from '@/components/shared/DynamicPagination';

// Utils
import axiosInstance from '@/lib/axios';
import { BlinkingDots } from '@/components/shared/blinking-dots';

// --- Helper Components & Functions ---

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'unallocated':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'completed':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const UserCell = ({
  user,
  role,
  fallback,
  fallbackIcon: Icon,
  isUnallocated
}: any) => {
  if (isUnallocated || !user) {
    return (
      <div className="flex items-center gap-3 opacity-60">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium italic text-slate-500">
            {fallback}
          </span>
          <span className="text-xs text-slate-400">No {role} assigned</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
        <AvatarImage src={user.profilePicture} alt={user.firstName} />
        <AvatarFallback className="bg-supperagent/10 text-xs font-bold text-supperagent">
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-700">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-xs text-slate-500">{role}</span>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function TodaysSchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);

  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();

  // Fetch Logic
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        // Base params - We request today's date from API as well for efficiency
        const params: any = {
          today: true,
          page: currentPage,
          limit: entriesPerPage
        };

        // Role-based params
        if (user.role === 'serviceUser') {
          params.serviceUser = user._id;
        } else {
          params.employee = user._id;
        }

        const response = await axiosInstance.get('/schedules', {
          params
        });

        const result = response.data?.data?.result || [];
        const meta = response.data?.data?.meta;

        setSchedules(result);
        if (meta) {
          setTotalPages(meta.totalPage);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user?._id, user?.role, currentPage, entriesPerPage]);



  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex bg-white pb-4">
          <CardTitle className="flex flex-row justify-between items-center gap-2 text-lg font-bold text-slate-800">
            <div className="flex flex-row items-center gap-2">
              <Calendar className="h-5 w-5 text-supperagent" />
              Today's Schedule
            </div>
            <Button
              onClick={() => navigate(-1)}
              className="bg-supperagent text-white hover:bg-supperagent/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <BlinkingDots size='large' color='bg-supperagent'/>
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-4">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              
              <p className="mt-1  text-slate-500">
                There are no visits or services scheduled for today ({moment().format('DD MMM')}).
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-600">
                      Date
                    </TableHead>
                    <TableHead className="w-[180px] pl-6 font-semibold text-slate-600">
                      Time / Duration
                    </TableHead>
                    <TableHead className="font-semibold text-slate-600">
                      Staff Member
                    </TableHead>
                    <TableHead className="font-semibold text-slate-600">
                      Service User
                    </TableHead>
                    <TableHead className="hidden font-semibold text-slate-600 md:table-cell">
                      Service Type
                    </TableHead>
                    <TableHead className="pr-6 text-right font-semibold text-slate-600">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Using the filtered todaysSchedules instead of raw schedules */}
                  {schedules.map((service) => {
                    const employee =
                      typeof service.employee === 'object'
                        ? service.employee
                        : users.find((u) => u._id === service.employee);
                    const client =
                      typeof service.serviceUser === 'object'
                        ? service.serviceUser
                        : users.find((u) => u._id === service.serviceUser);

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
                        // onClick={() =>
                        //   navigate('/admin/people-planner/planner')
                        // }
                      >
                        <TableCell>{moment(service.date).format("DD MMM YYYY")}</TableCell>
                        <TableCell className="py-4 pl-6 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span className="font-mono text-sm font-semibold text-slate-700">
                                {service.startTime}
                              </span>{' '}
                              -
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
                            user={employee}
                            role="Carer"
                            fallback="Unallocated"
                            fallbackIcon={UserCheck}
                            isUnallocated={!employee}
                          />
                        </TableCell>

                        <TableCell className="align-middle">
                          <UserCell
                            user={client}
                            role="Service User"
                            fallback="Unknown"
                            fallbackIcon={Users}
                          />
                        </TableCell>

                        <TableCell className="hidden align-middle md:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-supperagent ring-2 ring-supperagent/20"></span>
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

              {totalPages > 1 && (
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}