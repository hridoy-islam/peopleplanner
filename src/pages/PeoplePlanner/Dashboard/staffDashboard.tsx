import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  BookOpen,
  Bell,
  ArrowRight,
  Sparkles,
  User as UserIcon,
  Loader2,
  Pin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { link } from 'fs';

// --- Interfaces ---

interface Training {
  _id: string;
  trainingId: {
    _id: string;
    name: string;
    description?: string;
    validityDays?: number;
  };
  status: string;
  assignedDate: string;
  expireDate: string;
  completedAt?: string;
}

interface Shift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  branch: string;
  area: string;
  serviceUser?: {
    firstName: string;
    lastName: string;
  };
  visitType?: string;
}

interface DocRequest {
  _id: string;
  documentType: string;
  status: string;
  createdAt: string;
}

interface Notice {
  _id: string;
  noticeType: string;
  noticeDescription: string;
  noticeDate: string;
  noticeBy?: {
    firstName: string;
    lastName: string;
  };
  status: string;
  noticeSetting: 'all' | 'department' | 'designation' | 'individual';
}

// --- Main Page Component ---

const StaffDashboardPage = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();

  // State
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [scheduleData, setScheduleData] = useState<Shift[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [requests, setRequests] = useState<DocRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalShifts, setTotalShifts] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);

  // --- Fetch Data ---
  useEffect(() => {
    if (!user?._id) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [userRes, upcomingRes, schedulesRes, requestRes, noticeRes] =
          await Promise.all([
            axiosInstance.get(`/users/${user._id}`),
            axiosInstance.get(
              `/schedules/upcoming?employee=${user._id}&date=${moment().format('YYYY-MM-DD')}&limit=all`
            ),
            axiosInstance.get(`/schedules`, {
              params: {
                employee: user._id,
                date: moment().format('YYYY-MM-DD')
              }
            }),
            axiosInstance.get(`/hr/request-document`, {
              params: { userId: user._id, limit: 3 }
            }),
            axiosInstance.get('/hr/notice', {
              params: {
                status: 'active',
                limit: 3,
                userId: user._id,
                sort: '-createdAt'
              }
            })
          ]);

        setTrainings(userRes.data?.data?.training || []);
        setShifts(upcomingRes.data?.data?.result || []);
        setScheduleData(schedulesRes.data?.data?.result || []);
        setRequests(
          Array.isArray(requestRes.data?.data?.result)
            ? requestRes.data?.data?.result
            : []
        );
        setNotices(noticeRes.data?.data?.result || []);
        setTotalShifts(upcomingRes.data?.data?.meta?.total | 0);
        setTotalRequests(requestRes.data?.data?.meta?.total | 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  // --- Filter Today's Tasks ---
  const todaysTasks = useMemo(() => {
    if (!scheduleData.length) return [];
    return scheduleData.filter((task) =>
      moment(task.date).isSame(moment(), 'day')
    );
  }, [scheduleData]);

  // --- Helpers ---

  const getShiftTime = (start: string, end: string) => `${start} - ${end}`;

  const getDueStatus = (date: string) => {
    if (!date)
      return {
        text: 'No due date',
        color: 'text-slate-500',
        bg: 'bg-slate-100'
      };
    const daysLeft = Math.ceil(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );

    if (daysLeft < 0)
      return {
        text: `Overdue (${Math.abs(daysLeft)}d)`,
        color: 'text-red-700',
        bg: 'bg-red-50'
      };
    if (daysLeft < 3)
      return {
        text: `Due: ${daysLeft} days`,
        color: 'text-amber-700',
        bg: 'bg-amber-50'
      };
    return {
      text: `${daysLeft} days left`,
      color: 'text-supperagent',
      bg: 'bg-supperagent/10'
    };
  };

  const getNoticeStyles = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('urgent')) return 'bg-red-50 text-red-700 border-red-200';
    if (t.includes('announcement'))
      return 'bg-supperagent/10 text-supperagent border-supperagent/20';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getRequestStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-supperagent/10 text-supperagent';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  // --- Stats Calculation ---
  const pendingTraining = trainings.filter(
    (t) => t.status !== 'completed'
  ).length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BlinkingDots size="large" color="bg-supperagent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-50/50 duration-500 animate-in fade-in ">
      {/* --- Header Section --- */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 flex items-center gap-2 text-slate-500">
            <Calendar className="h-4 w-4 text-supperagent" />
            {moment().format('dddd, Do MMMM YYYY')}
          </p>
        </div>
      </div>

      {/* --- Key Metrics --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Today's Tasks",
            value: todaysTasks.length,
            icon: CheckCircle2,
            color: 'text-supperagent',
            bg: 'bg-supperagent/10',
            link: 'schedule'
          },
          {
            title: 'Upcoming Shifts',
            value: totalShifts,
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50/50',
            link: 'upcoming-schedule'
          },
          {
            title: 'Training Actions',
            value: pendingTraining,
            icon: BookOpen,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/50',
            link: '#'
          },
          {
            title: 'Pending Requests',
            value: totalRequests,
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50/50',
            link: 'request/document'
          }
        ].map((stat, idx) => (
          <Card
            key={idx}
            onClick={()=> navigate(stat.link)}
            className="group cursor-pointer border-none bg-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </h3>
                </div>
              </div>
              <div className={cn('rounded-2xl p-4 transition-colors', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Main Dashboard Grid --- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* === Left Column (Feed) - Spans 8 cols === */}
        <div className="space-y-6 xl:col-span-8">
          {/* Today's Tasks Section (Supperagent Theme) */}
          <Card className="overflow-hidden border-supperagent/20 bg-white shadow-sm ">
            <CardHeader className="border-b border-supperagent/10 pb-4 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-supperagent" />
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      Today's Focus
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Scheduled activities for {moment().format('MMMM Do')}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {todaysTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                  <div className="mb-3 rounded-full bg-supperagent/10 p-3">
                    <CheckCircle2 className="h-6 w-6 text-supperagent" />
                  </div>
                  <p className="font-medium text-slate-900">
                    All clear for today!
                  </p>
                  <p className="text-sm text-slate-500">No tasks scheduled.</p>
                </div>
              ) : (
                <div className="divide-y divide-supperagent/10">
                  {todaysTasks.map((task, i) => (
                    <div
                      key={i}
                      className="group flex cursor-pointer flex-col gap-4 p-5 transition-colors hover:bg-slate-50/50 md:flex-row md:items-center"
                      onClick={() => navigate('schedule')}
                    >
                      {/* Time Block */}
                      <div className="flex h-16 w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100/50 transition-colors group-hover:border-supperagent/30 sm:h-20 sm:w-20 sm:flex-col sm:gap-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {moment(task.date).format('MMM')}
                        </span>
                        <span className="text-2xl font-bold leading-none text-slate-900 transition-colors group-hover:text-supperagent">
                          {moment(task.date).format('D')}
                        </span>
                        <span className="text-[10px] font-medium uppercase text-slate-400">
                          {moment(task.date).format('ddd')}
                        </span>
                      </div>

                      {/* Shift Details */}
                      <div className="flex flex-1 flex-col justify-center space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-supperagent">
                              {task.serviceUser
                                ? `${task.serviceUser.firstName} ${task.serviceUser.lastName}`
                                : 'Unassigned Client'}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {task.branch} • {task.area}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-gray-300 bg-white font-normal text-slate-600 shadow-sm group-hover:border-supperagent/30"
                          >
                            {task.visitType || 'Regular Visit'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-2 py-1 transition-colors group-hover:border-supperagent/20 group-hover:bg-supperagent/5">
                            <Clock className="h-3.5 w-3.5 text-supperagent" />
                            <span className="font-medium text-slate-700">
                              {getShiftTime(task.startTime, task.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Shifts Timeline */}
          <Card className="overflow-hidden border-slate-200/60 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 rounded-full bg-supperagent" />
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      Upcoming Schedule
                    </CardTitle>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={()=> navigate('upcoming-schedule')}
                  className="text-supperagent hover:bg-supperagent/10 hover:text-supperagent"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {shifts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  <div className="mb-3 rounded-full bg-slate-50 p-4">
                    <Sparkles className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="font-medium">No upcoming shifts</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {shifts.map((shift, i) => (
                    <div
                      key={i}
                      onClick={()=> navigate('upcoming-schedule')}
                      className="group flex flex-col gap-5 p-5 transition-colors cursor-pointer hover:bg-slate-50/50 sm:flex-row"
                    >
                      {/* Date Visual */}
                      <div className="flex h-16 w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100/50 transition-colors group-hover:border-supperagent/30 sm:h-20 sm:w-20 sm:flex-col sm:gap-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {moment(shift.date).format('MMM')}
                        </span>
                        <span className="text-2xl font-bold leading-none text-slate-900 transition-colors group-hover:text-supperagent">
                          {moment(shift.date).format('D')}
                        </span>
                        <span className="text-[10px] font-medium uppercase text-slate-400">
                          {moment(shift.date).format('ddd')}
                        </span>
                      </div>

                      {/* Shift Details */}
                      <div className="flex flex-1 flex-col justify-center space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-supperagent">
                              {shift.serviceUser
                                ? `${shift.serviceUser.firstName} ${shift.serviceUser.lastName}`
                                : 'Unassigned Client'}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {shift.branch} • {shift.area}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-gray-300 bg-white font-normal  text-slate-600 shadow-sm group-hover:border-supperagent/30"
                          >
                            {shift.visitType || 'Regular Visit'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-2 py-1 transition-colors group-hover:border-supperagent/20 group-hover:bg-supperagent/5">
                            <Clock className="h-3.5 w-3.5 text-supperagent" />
                            <span className="font-medium text-slate-700">
                              {getShiftTime(shift.startTime, shift.endTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Section */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-supperagent" />
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    Compliance & Training
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <p className="px-4 py-4 text-sm text-slate-500">
                  You are fully compliant. Good job!
                </p>
              ) : (
                <div className="mt-2 grid gap-3 px-4 pb-4">
                  {trainings.map((t, i) => {
                    const due = getDueStatus(t.expireDate);
                    return (
                      <div
                        key={i}
                        className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-supperagent/30 hover:shadow-sm sm:flex-row sm:items-center"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 rounded-lg bg-supperagent/5 p-2 transition-colors group-hover:bg-supperagent/10">
                            <BookOpen className="h-4 w-4 text-supperagent" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">
                              {t.trainingId?.name}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-xs font-medium',
                                  due.bg,
                                  due.color
                                )}
                              >
                                {due.text}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            t.status === 'completed' ? 'secondary' : 'default'
                          }
                          className={cn(
                            'w-full border-0 sm:w-auto',
                            t.status !== 'completed' &&
                              'bg-supperagent text-white hover:bg-supperagent/90'
                          )}
                          disabled={t.status === 'completed'}
                        >
                          {t.status === 'completed'
                            ? 'Completed'
                            : 'Start Module'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* === Right Column (Sidebar) - Spans 4 cols === */}
        <div className="space-y-6 xl:col-span-4">
          {/* Notice Board */}
          <Card className="h-fit border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-900">Notice</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notices.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No new notices to display.
                </div>
              ) : (
                <div className="custom-scrollbar max-h-[500px] overflow-y-auto">
                  {notices.map((notice) => (
                    <div
                      key={notice._id}
                      className="group border-b border-slate-50 p-5 transition-colors last:border-0 hover:bg-slate-50/50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-md border text-[10px] font-bold uppercase tracking-wider',
                            getNoticeStyles(notice.noticeType)
                          )}
                        >
                          {notice.noticeType}
                        </Badge>
                        {notice.noticeSetting !== 'all' && (
                          <Pin className="h-3 w-3 rotate-45 text-slate-400" />
                        )}
                      </div>

                      <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-slate-700">
                        {notice.noticeDescription}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-slate-200 text-[9px] text-slate-600">
                              {notice.noticeBy?.firstName?.charAt(0) || 'H'}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {notice.noticeBy?.firstName || 'HR Admin'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {moment(notice.noticeDate).fromNow()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="border-t border-slate-100 bg-slate-50 p-3">
              <Button
                onClick={() => navigate('notice')}
                variant="ghost"
                className="h-8 w-full text-xs text-slate-800 hover:bg-transparent hover:text-supperagent hover:underline"
              >
                View All Notices
              </Button>
            </div>
          </Card>

          {/* Quick Requests */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Document Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.length === 0 ? (
                  <p className="text-xs italic text-slate-500">
                    No history available.
                  </p>
                ) : (
                  requests.slice(0, 3).map((req, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {req.documentType}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {moment(req.createdAt).format('DD MMM YYYY')}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          'pointer-events-none shadow-none',
                          getRequestStatusStyles(req.status)
                        )}
                      >
                        {req.status}
                      </Badge>
                    </div>
                  ))
                )}
                <Button
                  variant="ghost"
                  className="h-8 w-full text-xs text-slate-800 hover:bg-transparent hover:text-supperagent hover:underline"
                  onClick={() => navigate('request/document')}
                >
                  View All Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
