import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ChevronRight } from 'lucide-react';
import { RightSidebar } from './components/RightSidebar';
import { TopControls } from './components/TopControls';
import { Timeline } from './components/Timeline';
import { schedules } from '@/data/plannerData';
import type { SidebarState, schedule } from '@/types/planner';
import moment from 'moment';
import { ScheduleDetailComponent } from './components/ScheduleDetail';
import axiosInstance from '@/lib/axios';
import { toast } from '@/components/ui/use-toast';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { ExtraCallComponent } from './components/ExtraCall';

// 👇 Define User type for better type safety
interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  department?: string;
  [key: string]: any; // for any extra fields
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [filterBy, setFilterBy] = useState('serviceUser');
  const [designation, setDesignation] = useState('all');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(2);
  const [sidebarOpen, setSidebarOpen] = useState<SidebarState>({
    left: true,
    right: true
  });
  const [selectedSchedule, setSelectedSchedule] = useState<schedule | null>(
    null
  );
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isExtraCallOpen, setIsExtraCallOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]); // ✅ Typed as User[]

  // ✅ Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/users', {
          params: { limit: 'all', fields:"title firstName lastName middleInitial phone email role" }
        });

        let fetchedUsers= res?.data?.data.result

       

        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: 'Failed to load users',
          variant: 'destructive'
        });
        setUsers([]); // ✅ Always fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

const { serviceUsers, employees } = useMemo(() => {
  if (!Array.isArray(users)) return { serviceUsers: [], employees: [] };

  const serviceUsers: User[] = [];
  const employees: User[] = [];

  users.forEach((user) => {
    const role = user.role?.toLowerCase();
    if (role === 'serviceuser') {
      serviceUsers.push(user);
    } else if ( role === 'staff') {
      employees.push(user);
    }
    // Optionally handle other roles or log unexpected values
  });

  return { serviceUsers, employees };
}, [users]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 2));
  const handleSearch = () => {};

  const handleScheduleClick = (schedule: schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleExtraScheduleClick = () => {
    setIsExtraCallOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
  };

  const filteredSchedules = useMemo(() => {
    if (!isDateSelected) {
      const startOfWeek = moment().startOf('week');
      const endOfWeek = moment().endOf('week');
      return schedules.filter((schedule) =>
        moment(schedule.date).isBetween(startOfWeek, endOfWeek, 'day', '[]')
      );
    } else {
      return schedules.filter((schedule) =>
        moment(schedule.date).isSame(moment(selectedDate), 'day')
      );
    }
  }, [selectedDate, isDateSelected]);

  const currentData = useMemo(() => {
    let result = [...serviceUsers, ...employees];

    if (filterBy === 'serviceUser') result = serviceUsers;
    else if (filterBy === 'staff') result = employees;

    if (designation !== 'all') {
      result = result.filter((user) =>
        'role' in user ? user.role === designation : false
      );
    }

    if (department !== 'all') {
      result = result.filter((user) =>
        'department' in user ? user.department === department : false
      );
    }

    if (searchTerm) {
  const term = searchTerm.toLowerCase();

  result = result.filter((user) => {
    const fullName = `${user.title || ''} ${user.firstName || ''} ${
      user.middleInitial ? user.middleInitial + ' ' : ''
    }${user.lastName || ''}`.trim().toLowerCase();

    return (
      fullName.includes(term) ||
      (user.email && user.email.toLowerCase().includes(term))
    );
  });
}


    return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [filterBy, designation, department, searchTerm, serviceUsers, employees]);

  const selectedDateString = useMemo(() => {
    return moment(selectedDate).format('YYYY-MM-DD');
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsDateSelected(true);
  };

  const dayStats = useMemo(() => {
    const selectedMoment = moment(selectedDate);
    const startOfWeek = selectedMoment.clone().startOf('week');

    return Array.from({ length: 7 }).map((_, i) => {
      const currentDay = startOfWeek.clone().add(i, 'days');
      const dayString = currentDay.format('YYYY-MM-DD');
      const daySchedules = schedules.filter(
        (schedule) => schedule.date === dayString
      );

      return {
        date: currentDay.format('DD/MM'),
        day: currentDay.format('dddd'),
        allocated: daySchedules.filter((t) => t.status === 'allocated').length,
        unallocated: daySchedules.filter((t) => t.status === 'unallocated')
          .length,
        total: daySchedules.length
      };
    });
  }, [selectedDate]);

  // ✅ Show loader while fetching initial data
  if (loading && users.length === 0) {
    return (
      <div className="flex h-[calc(100vh-14vh)] w-full items-center justify-center">
        <BlinkingDots size="large" color="bg-supperagent" />
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm">
      <div className="px-4 py-2">
        <h1 className="text-3xl font-semibold">Planner</h1>
      </div>
      <TooltipProvider>
        <div className="flex flex-col justify-between p-2 lg:flex-row">
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

            <Timeline
              currentData={currentData}
              filterBy={filterBy}
              schedules={filteredSchedules}
              zoomLevel={zoomLevel}
              selectedDate={selectedDateString}
              contentRef={contentRef}
              onScheduleClick={handleScheduleClick}
            />
          </div>

          <RightSidebar
            isOpen={sidebarOpen.right}
            selectedDate={selectedDate}
            setSelectedDate={handleDateChange}
            currentData={currentData}
            dayStats={dayStats}
          />

          {/* Schedule Detail Modal */}
          <ScheduleDetailComponent
            schedule={selectedSchedule}
            isOpen={!!selectedSchedule}
            onClose={handleCloseScheduleModal}
          />

          <ExtraCallComponent
            isOpen={isExtraCallOpen}
            onClose={() => setIsExtraCallOpen(false)}
          />
        </div>
      </TooltipProvider>
    </div>
  );
}