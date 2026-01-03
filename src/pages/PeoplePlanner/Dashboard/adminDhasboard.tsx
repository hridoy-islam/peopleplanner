import { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  Activity, 
  Briefcase, 
} from 'lucide-react';
import moment from 'moment';
import axiosInstance from '@/lib/axios';

// UI Components
// Added CardHeader and CardTitle to imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BlinkingDots } from '@/components/shared/blinking-dots';

export default function AdminDashboardPage() {
  const [todaysSchedules, setTodaysSchedules] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: any) => state.auth);
  const navigate= useNavigate();
  const currentDate = moment();
  const todayFormatted = currentDate.format('dddd, MMMM Do, YYYY');
  const todayDateString = currentDate.format('YYYY-MM-DD');
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersRes = await axiosInstance.get('/users', {
          params: { limit: 'all', fields: 'firstName lastName role image' }
        });

        const schedulesRes = await axiosInstance.get('/schedules', {
          params: { date: todayDateString, limit: 'all' }
        });

        setUsers(usersRes?.data?.data?.result || usersRes?.data?.data || []);
        setTodaysSchedules(schedulesRes?.data?.data?.result || schedulesRes?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [todayDateString]);

  // --- FILTERING LOGIC ---
  const filteredSchedules = useMemo(() => {
    return todaysSchedules.filter((schedule) => {
      const scheduleDate = moment(schedule.date);
      return scheduleDate.isSame(todayDateString, 'day');
    });
  }, [todaysSchedules, todayDateString]);

  // --- Statistics ---
  const totalServicesCount = filteredSchedules.length;

  const activeCarersCount = useMemo(() => {
     return users.filter(u => u.role === 'staff').length;
  }, [filteredSchedules]);

  const totalServiceUsersCount = useMemo(() => {
    return users.filter(u => u.role === 'serviceUser').length;
  }, [users]);

  // --- Helpers ---
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'unallocated': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'; 
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
       <div className="flex h-[calc(100vh-14vh)] w-full items-center justify-center">
              <BlinkingDots size="large" color="bg-supperagent" />
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 ">
      <div className="mx-auto max-w-[1600px] space-y-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back! {user?.firstName} {user?.lastName}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400" />
              {todayFormatted}
            </p>
          </div>
        </div>

        {/* --- Stats Grid --- */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <StatsCard 
    title="Today's Services" 
    value={totalServicesCount} 
    subtitle="Scheduled visits today"
    icon={Activity}
    color="indigo"
    to="/admin/people-planner/planner"
  />

  <StatsCard 
    title="Active Carers" 
    value={activeCarersCount} 
    subtitle="Currently in the field"
    icon={Briefcase}
    color="emerald"
    to="/admin/people-planner/employee"
  />

  <StatsCard 
    title="Total Service Users" 
    value={totalServiceUsersCount} 
    subtitle="Registered active clients"
    icon={Users}
    color="violet"
    to="/admin/people-planner/service-user"
  />
</div>


        {/* --- Main Schedule Section --- */}
        <div className="grid gap-6">
          <Card className="shadow-sm overflow-hidden">
            {/* ADDED: Card Header with Title */}
            <CardHeader className="px-6 py-4 border-b border-slate-100 bg-white">
               <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                 <Calendar className="h-5 w-5 text-indigo-500" />
                 Today's Schedule
               </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {filteredSchedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="rounded-full bg-slate-50 p-4 mb-4">
                    <Calendar className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No Services Scheduled</h3>
                  <p className="text-slate-500 max-w-md mt-1">There are no visits or services scheduled for today.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b border-slate-100">
                      <TableHead className="w-[180px] font-semibold text-slate-600 pl-6">Time / Duration</TableHead>
                      <TableHead className="font-semibold text-slate-600">Staff Member</TableHead>
                      <TableHead className="font-semibold text-slate-600">Service User</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold text-slate-600">Service Type</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 pr-6">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((service) => {
                      const employee = typeof service.employee === 'object' ? service.employee : users.find(u => u._id === service.employee);
                      const client = typeof service.serviceUser === 'object' ? service.serviceUser : users.find(u => u._id === service.serviceUser);
                      
                      const start = moment(service.startTime, 'HH:mm');
                      const end = moment(service.endTime, 'HH:mm');
                      const durationHrs = moment.duration(end.diff(start)).asHours().toFixed(2);

                      return (
                        <TableRow key={service._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 cursor-pointer" onClick={()=> navigate('/admin/people-planner/planner')}>
                          <TableCell className="align-top py-4 pl-6">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                <span className="font-mono text-sm font-semibold text-slate-700">
                                  {service.startTime}
                                </span> -
                                <span className="font-mono text-sm font-semibold text-slate-700">
                                  {service.endTime}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 pl-5.5 tabular-nums font-medium">
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

                          <TableCell className="hidden md:table-cell align-middle">
                             <div className="flex items-center gap-2">
                                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-100"></span>
                                <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
                                  {service.serviceType || 'General Care'}
                                </span>
                             </div>
                          </TableCell>

                          <TableCell className="text-right align-middle pr-6">
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components (Unchanged) ---


function StatsCard({ title, value, subtitle, icon: Icon, color, to }: any) {
  const navigate = useNavigate();

  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <Card
      onClick={() => to && navigate(to)}
      className="cursor-pointer shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 bg-white"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {value}
            </h3>
          </div>

          <div className={`rounded-xl p-2.5 ${colors[color] || colors.indigo}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserCell({ user, role, fallback, fallbackIcon: Icon, isUnallocated }: any) {
  if (isUnallocated) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 border border-amber-100 border-dashed shrink-0">
          <Icon className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-amber-700 italic">Unallocated</span>
          <span className="text-[10px] text-amber-600/70 font-medium">Assign staff</span>
        </div>
      </div>
    );
  }

  const name = user ? `${user.firstName} ${user.lastName}` : fallback;
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '--';

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 border border-slate-100 shadow-sm shrink-0">
        <AvatarImage src={user?.image} />
        <AvatarFallback className={`text-xs font-bold ${role === 'Carer' ? 'bg-indigo-50 text-indigo-700' : 'bg-violet-50 text-violet-700'}`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900 line-clamp-1">{name}</span>
        <span className="text-xs text-slate-500 font-medium">{role}</span>
      </div>
    </div>
  );
}