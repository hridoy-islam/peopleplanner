import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RightSidebar } from './components/RightSidebar';
import { TopControls } from './components/TopControls';
import { Timeline } from './components/Timeline';
import type { SidebarState } from '@/types/planner';
import moment from 'moment';
import { ScheduleDetailComponent } from './components/ScheduleDetail';
import axiosInstance from '@/lib/axios';
import { toast } from '@/components/ui/use-toast';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { ExtraCallComponent } from './components/ExtraCall';

// --- DnD Imports ---
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 👇 Interfaces based on your Mongoose Schema & Frontend needs
interface User {
  _id: string; // Mongoose ID
  id?: string; // Fallback
  firstName: string;
  lastName: string;
  middleInitial?: string;
  email?: string;
  role: string;
  departmentId?: string | { _id: string; departmentName: string }; 
  designationId?: string | { _id: string; title: string }; 
  title?: string;
  image?: string;
  [key: string]: any;
}

export interface TSchedule {
  _id: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  serviceUser: User | string; 
  employee?: User | string; 
  serviceType?: string;
  status?: string; 
  [key: string]: any;
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterBy, setFilterBy] = useState('serviceUser');
  const [designation, setDesignation] = useState('all');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(2);
  
  // Default to 'day' view, or 'week' if you prefer. 
  // Even in 'day' mode, we now fetch enough data for the drill-down.
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day'); 
  
  const [sidebarOpen, setSidebarOpen] = useState<SidebarState>({
    left: true,
    right: true
  });

  // State for Real Data
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<TSchedule[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState<TSchedule | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isExtraCallOpen, setIsExtraCallOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(1000); 

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await axiosInstance.get('/users', {
          params: {
            limit: 'all',
            fields: 'title firstName lastName middleInitial phone email role departmentId designationId image'
          }
        });
        const fetchedUsers = res?.data?.data?.result || res?.data?.data || [];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({ title: 'Failed to load users', variant: 'destructive' });
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. Fetch Schedules (FIXED: Always fetch range to support "Past 7 Days")
  const fetchSchedules = async (
    page: number,
    entriesPerPage: number,
    searchTerm = ''
  ) => {
    try {
      setLoadingSchedules(true);

      let apiParams: any = {
        page,
        limit: entriesPerPage,
        ...(searchTerm ? { searchTerm } : {})
      };

      // CRITICAL FIX: Always fetch a wider range (Past 7 days -> End of Week)
      // This ensures that when you click a user, the "Past 7 Days" data is ALREADY in the state.
      // We use ISO string format without time to ensure backend matches dates correctly.
      
      const startRange = moment(selectedDate).subtract(7, 'days').startOf('day').toISOString();
      const endRange = moment(selectedDate).endOf('isoWeek').endOf('day').toISOString();

      apiParams.startDate = startRange;
      apiParams.endDate = endRange;

      const res = await axiosInstance.get('/schedules', {
        params: apiParams
      });

      const fetchedSchedules = res?.data?.data?.result || res?.data?.data || [];
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      toast({ title: 'Failed to load schedules', variant: 'destructive' });
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Trigger fetch when Date changes
  useEffect(() => {
    fetchSchedules(currentPage, entriesPerPage);
  }, [selectedDate, currentPage, entriesPerPage]); 

  // 3. Separate Users into Lists
  const { serviceUsers, employees } = useMemo(() => {
    const sUsers: User[] = [];
    const staff: User[] = [];

    users.forEach((user) => {
      const role = user.role?.toLowerCase();
      if (role === 'serviceuser') {
        sUsers.push(user);
      } else if (role === 'staff') {
        staff.push(user);
      }
    });
    return { serviceUsers: sUsers, employees: staff };
  }, [users]);

  // Handle Drag and Drop Updates
  const handleScheduleUpdate = useCallback(
    async (
      scheduleId: string,
      newStartTime: string,
      newEndTime: string,
      newResourceId: string
    ) => {
      // 1. Optimistic Update
      setSchedules((prevSchedules) =>
        prevSchedules.map((sched) => {
          if (sched._id === scheduleId) {
            const fieldToUpdate = filterBy === 'serviceUser' ? 'serviceUser' : 'employee';
            const existingValue = sched[fieldToUpdate];
            const newValue = typeof existingValue === 'object' && existingValue !== null
                ? { ...existingValue, _id: newResourceId }
                : newResourceId;

            return {
              ...sched,
              startTime: newStartTime,
              endTime: newEndTime,
              [fieldToUpdate]: newValue
            };
          }
          return sched;
        })
      );

      // 2. API Update
      try {
        const payload: any = { startTime: newStartTime, endTime: newEndTime };
        if (filterBy === 'serviceUser') {
          payload.serviceUser = newResourceId;
        } else {
          payload.employee = newResourceId;
        }

        await axiosInstance.patch(`/schedules/${scheduleId}`, payload);
        toast({ title: 'Schedule Updated', description: 'Time and allocation updated.' });
      } catch (error) {
        console.error('Failed to update schedule:', error);
        toast({ title: 'Update Failed', description: 'Reverting changes...', variant: 'destructive' });
        fetchSchedules(currentPage, entriesPerPage);
      }
    },
    [filterBy, currentPage, entriesPerPage, selectedDate]
  );

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 2));
  const handleSearch = () => {};

  const handleScheduleClick = (schedule: TSchedule) => {
    setSelectedSchedule(schedule);
  };

  const handleExtraScheduleClick = () => {
    setIsExtraCallOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
  };

  // 4. Filter Schedules Client-Side
  // We fetched a large range, now we filter specifically for the VIEW (Main Timeline)
  // The Timeline component itself will handle filtering for the "Single User" view internally using the raw 'schedules' prop.
  const filteredSchedules = useMemo(() => {

    return schedules; 

  }, [schedules]);

  // 5. Filter Users (Rows)
  const currentData = useMemo(() => {
    let result = filterBy === 'serviceUser' ? serviceUsers : employees;
    const getId = (field: any) => (field?._id || field?.id || field); // Helper

    if (designation !== 'all') {
      result = result.filter((u) => getId(u.designationId) === designation);
    }
    if (department !== 'all') {
      result = result.filter((u) => getId(u.departmentId) === department);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((user) => {
        const fullName = `${user.title || ''} ${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        return fullName.includes(term) || user.email?.toLowerCase().includes(term);
      });
    }
    return result.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
  }, [filterBy, designation, department, status, searchTerm, serviceUsers, employees]);

  const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // 6. Calculate Stats
  const dayStats = useMemo(() => {
     const startDay = moment(selectedDate).subtract(6, 'days');
    return Array.from({ length: 7 }).map((_, i) => {
      const currentDay = startDay.clone().add(i, 'days');
      const dayString = currentDay.format('YYYY-MM-DD');
      const daySchedules = schedules.filter(
        (s) => moment(s.date).format('YYYY-MM-DD') === dayString
      );
      const allocatedCount = daySchedules.filter((t) => t.employee).length;

      return {
        date: currentDay.format('DD/MM'),
        day: currentDay.format('dddd'),
        allocated: allocatedCount,
        unallocated: daySchedules.length - allocatedCount,
        total: daySchedules.length
      };
    });
  }, [selectedDate, schedules]);

  const handleNewSchedule = () => fetchSchedules(currentPage, entriesPerPage);
  const handleLocalScheduleUpdate = () => fetchSchedules(currentPage, entriesPerPage);

  if (loadingUsers && users.length === 0) {
    return (
      <div className="flex h-[calc(100vh-14vh)] w-full items-center justify-center">
        <BlinkingDots size="large" color="bg-supperagent" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full rounded-lg bg-white shadow-sm">
        <div className="p-2">
          <h1 className="text-3xl font-semibold">Planner</h1>
        </div>
        <TooltipProvider>
          <div className="flex flex-col justify-between p-2 -mt-5 lg:flex-row">
            <div className="flex h-[calc(100vh-14vh)] w-full flex-col overflow-hidden lg:w-[86%]">
              <TopControls
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                zoomLevel={zoomLevel}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                designation={designation}
                setDesignation={setDesignation}
                department={department}
                setDepartment={setDepartment}
                status={status}
                setStatus={setStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                onScheduleClick={handleExtraScheduleClick}
              />

              {/* Toggle Buttons Removed Here */}

              <Timeline
                currentData={currentData}
                filterBy={filterBy}
                schedules={filteredSchedules} // Passing full range so drill-down works
                viewMode={viewMode}
                zoomLevel={zoomLevel}
                selectedDate={selectedDateString}
                contentRef={contentRef}
                onScheduleClick={handleScheduleClick}
                onScheduleUpdate={handleScheduleUpdate}
              />
            </div>

            <RightSidebar
              isOpen={sidebarOpen.right}
              selectedDate={selectedDate}
              setSelectedDate={handleDateChange}
              currentData={currentData}
              dayStats={dayStats}
            />

            <ScheduleDetailComponent
              schedule={selectedSchedule as any}
              isOpen={!!selectedSchedule}
              onClose={handleCloseScheduleModal}
              onScheduleUpdate={handleLocalScheduleUpdate}
            />

            <ExtraCallComponent
              isOpen={isExtraCallOpen}
              onClose={() => setIsExtraCallOpen(false)}
              onScheduleCreated={handleNewSchedule}
            />
          </div>
        </TooltipProvider>
      </div>
    </DndProvider>
  );
}