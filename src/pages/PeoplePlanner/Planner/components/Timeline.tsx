import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { useDrag, useDrop } from 'react-dnd'; 
import {
  ContextMenu,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User as UserIcon,
  Briefcase,
  MapPin,
} from 'lucide-react';
import moment from 'moment';
import { cn } from '@/lib/utils'; 

// --- Constants ---
const HEADER_HEIGHT_CLASS = "h-12"; 
const ROW_HEIGHT_CLASS = "h-16";
const ITEM_TYPE = 'SCHEDULE'; 

// --- Types ---
interface TimelineProps {
  currentData: any[]; 
  filterBy: string;
  schedules: any[];
  zoomLevel: number;
  selectedDate: string;
  contentRef: React.RefObject<HTMLDivElement>;
  onScheduleClick: (schedule: any) => void;
  onScheduleUpdate: (id: string, newStart: string, newEnd: string, newResourceId: string) => void;
  viewMode?: 'day' | 'week';
}

interface DragItem {
  id: string;
  originalStartTime: string;
  originalEndTime: string;
  durationMinutes: number;
  type: string;
  resourceId: string; // Added to track the original user/row
}

// --- Helper Components ---
const UserAvatar = ({ name, image, size = 'sm' }: { name: string; image?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };

  return (
    <Avatar className={cn(sizeClasses[size], "border border-gray-200")}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">{initials}</AvatarFallback>
    </Avatar>
  );
};

// --- Helper: Time Calculation ---
const minutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);
  const roundedMins = Math.round(mins / 5) * 5;
  const h = hours.toString().padStart(2, '0');
  const m = roundedMins.toString().padStart(2, '0');
  return `${h}:${m}`;
};

export function Timeline({
  currentData,
  filterBy,
  schedules,
  zoomLevel,
  contentRef,
  selectedDate,
  onScheduleClick,
  onScheduleUpdate,
  viewMode = 'day'
}: TimelineProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const SLOT_WIDTH = viewMode === 'week' ? 14 : zoomLevel * 2.5; 
  
  const userListRef = useRef<HTMLDivElement>(null);
  const isUserScroll = useRef(false);
  const isContentScroll = useRef(false);

  // --- Data Preparation ---
  const timeSlots = useMemo(() => {
    if (viewMode === 'week') {
      const startOfWeek = moment(selectedDate).startOf('isoWeek');
      return Array.from({ length: 7 }, (_, i) => {
        const d = startOfWeek.clone().add(i, 'days');
        return { 
          label: d.format('ddd DD'),
          fullDate: d.format('YYYY-MM-DD'),
          isToday: d.isSame(moment(), 'day')
        };
      });
    }
    // Day Mode: 24 Hours
    return Array.from({ length: 24 }, (_, i) => ({ 
      label: `${i.toString().padStart(2, '0')}:00`,
      val: i 
    }));
  }, [selectedDate, viewMode]);

  const past7Days = useMemo(() => {
    const days = [];
    const baseDate = selectedDate ? moment(selectedDate) : moment();
    for (let i = 6; i >= 0; i--) {
      const date = baseDate.clone().subtract(i, 'days');
      days.push({
        date: date.format('YYYY-MM-DD'),
        displayDate: date.format('ddd, MMM DD'),
        isToday: date.isSame(moment(), 'day')
      });
    }
    return days;
  }, [selectedDate]);

  // --- Scroll Sync Logic ---
  useEffect(() => {
    const userList = userListRef.current;
    const content = contentRef.current;
    if (!userList || !content) return;

    const handleUserListScroll = () => {
      if (!isContentScroll.current) {
        isUserScroll.current = true;
        content.scrollTop = userList.scrollTop;
        setTimeout(() => (isUserScroll.current = false), 50);
      }
    };
    const handleContentScroll = () => {
      if (!isUserScroll.current) {
        isContentScroll.current = true;
        userList.scrollTop = content.scrollTop;
        setTimeout(() => (isContentScroll.current = false), 50);
      }
    };

    userList.addEventListener('scroll', handleUserListScroll);
    content.addEventListener('scroll', handleContentScroll);

    return () => {
      userList.removeEventListener('scroll', handleUserListScroll);
      content.removeEventListener('scroll', handleContentScroll);
    };
  }, [contentRef]);

  // --- Logic Helpers ---
  const getSchedulePosition = (schedule: any) => {
    if (viewMode === 'week') {
        const startOfWeek = moment(selectedDate).startOf('isoWeek');
        const schedDate = moment(schedule.date);
        const dayIndex = schedDate.diff(startOfWeek, 'days');
        
        if (dayIndex < 0 || dayIndex > 6) return { display: 'none' };

        return { 
            left: `${dayIndex * SLOT_WIDTH}rem`, 
            width: `${SLOT_WIDTH - 0.5}rem`
        };
    }

    // DAY VIEW: Position based on time
    const { startTime, endTime } = schedule;
    if (!startTime || !endTime) return { left: '0', width: '0' };
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const startPos = (startMins / 60) * SLOT_WIDTH;
    const duration = ((endMins - startMins) / 60) * SLOT_WIDTH;
    return { left: `${startPos}rem`, width: `${duration}rem` };
  };

  const isScheduleForUser = (schedule: any, userId: string) => {
    const sId = typeof schedule.serviceUser === 'object' ? schedule.serviceUser?._id : schedule.serviceUser;
    const eId = typeof schedule.employee === 'object' ? schedule.employee?._id : schedule.employee;
    return filterBy === 'serviceUser' ? sId === userId : eId === userId;
  };

  const relevantSchedules = useMemo(() => {
    if (selectedUser) {
      const sevenDaysAgo = moment(selectedDate).subtract(7, 'days').startOf('day');
      const today = moment(selectedDate).endOf('day');
      return schedules.filter(s => {
        const sDate = moment(s.date);
        return isScheduleForUser(s, selectedUser._id || selectedUser.id) && 
               sDate.isBetween(sevenDaysAgo, today, null, '[]');
      });
    }
    return schedules;
  }, [schedules, selectedUser, selectedDate, filterBy]);

  const displayDate = selectedDate ? moment(selectedDate).format('MMMM Do, YYYY') : moment().format('MMMM Do, YYYY');

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 shadow-sm relative z-0">
      
      {/* 1. Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200  px-4 py-3 z-30 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          {selectedUser && (
            <Button
              size="sm"
              onClick={() => setSelectedUser(null)}
              className="h-8 gap-1 rounded-md px-3 text-xs font-medium text-white hover:bg-supperagent bg-supperagent"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Button>
          )}
          <div className="flex flex-col">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              {selectedUser ? (
                <>
                  <UserIcon className="h-4 w-4 text-slate-500" />
                  {selectedUser.firstName} {selectedUser.lastName}
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {displayDate}
                </>
              )}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div><span className="text-slate-600">Allocated</span></div>
          <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div><span className="text-slate-600">Unallocated</span></div>
        </div>
      </div>

      {/* 2. Body */}
      <div className="flex flex-1 overflow-hidden relative isolate">
        
        {/* Left Sidebar */}
        <div className="flex w-64 flex-shrink-0 flex-col border-r border-slate-200  z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] relative">
          <div className={cn("flex flex-shrink-0 items-center border-b border-slate-200 bg-slate-50 px-4", HEADER_HEIGHT_CLASS)}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {selectedUser ? 'Date' : (filterBy === 'serviceUser' ? 'Service Users' : 'Staff')}
            </span>
          </div>

          <div ref={userListRef} className="overflow-y-auto scrollbar-hide">
            {!selectedUser ? (
              currentData.map((item) => {
                const uId = item._id || item.id;
                const fullName = `${item.firstName} ${item.lastName}`;
                return (
                  <div
                    key={uId}
                    onClick={() => setSelectedUser(item)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-3 border-b border-slate-200 px-4 transition-all hover:bg-slate-50",
                      ROW_HEIGHT_CLASS
                    )}
                  >
                    <UserAvatar name={fullName} image={item.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.title} {fullName}</p>
                      {/* <p className="truncate text-[10px] text-slate-400">{item.departmentId?.departmentName || 'No Dept'}</p> */}
                    </div>
                  </div>
                );
              })
            ) : (
              past7Days.map((day) => (
                <div key={day.date} className={cn("flex items-center px-4 border-b border-slate-200",  ROW_HEIGHT_CLASS)}>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-medium", day.isToday ? "text-supperagent" : "text-slate-700")}>{day.displayDate}</span>
                    {day.isToday && <span className="text-[10px] text-supperagent font-medium">Today</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Content (Timeline Grid) */}
        <div className="flex-1 overflow-auto bg-slate-50/50 z-0" ref={contentRef}>
          
          <div 
            className={cn("sticky top-0 z-30 flex border-b border-slate-200 bg-white shadow-sm", HEADER_HEIGHT_CLASS)}
            style={{ width: `${timeSlots.length * SLOT_WIDTH}rem` }}
          >
            {timeSlots.map((slot: any, index) => (
              <div key={index} 
                className={cn(
                    "flex-shrink-0 flex items-center justify-center border-r border-slate-200 text-xs font-medium text-slate-500",
                    viewMode === 'week' && slot.isToday ? "bg-blue-50 text-blue-700" : ""
                )}
                style={{ width: `${SLOT_WIDTH}rem` }}>
                {slot.label}
              </div>
            ))}
          </div>

          <div className="relative" style={{ width: `${timeSlots.length * SLOT_WIDTH}rem` }}>
            <div className="absolute inset-0 flex pointer-events-none z-0">
                {timeSlots.map((_, i) => (
                  <div key={i} className="h-full border-r border-slate-200 border-dashed" style={{ width: `${SLOT_WIDTH}rem` }} />
                ))}
            </div>

            <div className="relative z-0">
            {!selectedUser ? (
              // View: All Users
              currentData.map((item, index) => {
                const uId = item._id || item.id;
                
                const userSchedules = schedules.filter(s => {
                    const isUser = isScheduleForUser(s, uId);
                    if (!isUser) return false;

                    const schedDate = moment(s.date).format('YYYY-MM-DD');
                    
                    if (viewMode === 'day') {
                        return schedDate === moment(selectedDate).format('YYYY-MM-DD');
                    } else {
                        const startOfWeek = moment(selectedDate).startOf('isoWeek');
                        const endOfWeek = moment(selectedDate).endOf('isoWeek');
                        return moment(s.date).isBetween(startOfWeek, endOfWeek, 'day', '[]');
                    }
                });
                
                return (
                  <DroppableRow 
                    key={uId}
                    userId={uId}
                    index={index}
                    schedules={userSchedules}
                    slotWidth={SLOT_WIDTH}
                    filterBy={filterBy}
                    onScheduleUpdate={onScheduleUpdate}
                    onScheduleClick={onScheduleClick}
                    getSchedulePosition={getSchedulePosition}
                    viewMode={viewMode}
                  />
                );
              })
            ) : (
              // View: Single User (7 Days)
              past7Days.map((day) => (
                <div key={day.date} className={cn("relative border-b border-slate-200", ROW_HEIGHT_CLASS)}>
                  {relevantSchedules.filter(s => moment(s.date).format('YYYY-MM-DD') === day.date).map((schedule) => (
                      <DraggableScheduleBlock
                        key={schedule._id}
                        schedule={schedule}
                        position={getSchedulePosition(schedule)} 
                        filterBy={filterBy}
                        onClick={onScheduleClick}
                        canDrag={false} 
                        viewMode={viewMode}
                      />
                    ))}
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Droppable Row ---
const DroppableRow = ({ 
  userId, 
  schedules, 
  slotWidth, 
  filterBy, 
  onScheduleUpdate, 
  onScheduleClick,
  getSchedulePosition,
  viewMode
}: any) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const canDrop = viewMode === 'day';

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    // MODIFIED: Only allow drop if the item originated from this same row
    canDrop: (item: DragItem) => canDrop && item.resourceId === userId,
    drop: (item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      const rowRect = rowRef.current?.getBoundingClientRect();
      
      if (rowRect && offset) {
        const xPos = offset.x - rowRect.left; 
        const PIXELS_PER_REM = 16;
        const pixelsPerHour = (slotWidth * PIXELS_PER_REM);
        
        const delta = monitor.getDifferenceFromInitialOffset();
        if(!delta) return;

        const minutesDelta = (delta.x / pixelsPerHour) * 60;
        const [startH, startM] = item.originalStartTime.split(':').map(Number);
        const originalStartMins = startH * 60 + startM;
        
        let newStartMins = originalStartMins + minutesDelta;
        let newEndMins = newStartMins + item.durationMinutes;

        if(newStartMins < 0) { newStartMins = 0; newEndMins = item.durationMinutes; }
        if(newEndMins > 1440) { newEndMins = 1440; newStartMins = 1440 - item.durationMinutes; }

        const newStartStr = minutesToTime(newStartMins);
        const newEndStr = minutesToTime(newEndMins);

        onScheduleUpdate(item.id, newStartStr, newEndStr, userId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(rowRef);

  return (
    <div 
      ref={rowRef}
      className={cn(
        "relative border-b border-slate-200 transition-colors",
        ROW_HEIGHT_CLASS,
        (isOver && canDrop) && "bg-blue-50/80 ring-2 ring-inset ring-blue-200"
      )}
    >
      {schedules.map((schedule: any) => {
        const posStyle = getSchedulePosition(schedule);
        if (posStyle.display === 'none') return null;

        return (
          <DraggableScheduleBlock
            key={schedule._id}
            schedule={schedule}
            position={posStyle}
            filterBy={filterBy}
            onClick={onScheduleClick}
            canDrag={canDrop}
            viewMode={viewMode}
            resourceId={userId} // MODIFIED: Pass current userId to tracking
          />
        );
      })}
    </div>
  );
}

// --- SUB-COMPONENT: Draggable Schedule Block ---
const DraggableScheduleBlock = ({ schedule, position, filterBy, onClick, canDrag, viewMode, resourceId }: any) => {
  const startTime = moment(schedule.startTime, 'HH:mm');
  const endTime = moment(schedule.endTime, 'HH:mm');
  const duration = moment.duration(endTime.diff(startTime));
  const durationString = `${Math.floor(duration.asHours())}h ${duration.minutes()}m`;
  const formattedDate = moment(schedule.date).format('DD-MM-yyyy');
  
  const employeeName = schedule.employee ? `${schedule.employee.firstName} ${schedule.employee.lastName}` : 'Unallocated';
  const clientName = schedule.serviceUser ? `${schedule.serviceUser.firstName} ${schedule.serviceUser.lastName}` : 'Unknown Client';
  const title = filterBy === 'serviceUser' ? employeeName : clientName;
  const isAllocated = !!schedule.employee;
  const isWeekView = viewMode === 'week';

  let statusStyle = 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 shadow-sm';
  if (schedule.cancellation) statusStyle = 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200';
  else if (schedule.employee) statusStyle = 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200 shadow-sm';

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { 
      id: schedule._id, 
      originalStartTime: schedule.startTime,
      originalEndTime: schedule.endTime,
      durationMinutes: duration.asMinutes(),
      type: ITEM_TYPE,
      resourceId: resourceId // MODIFIED: Track origin user
    },
    canDrag: canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [schedule._id, schedule.startTime, schedule.endTime, canDrag, resourceId]);

  if (isDragging) {
    return <div ref={drag} style={position} className="absolute top-3 h-10 opacity-50 bg-gray-300 rounded-md border-dashed border-2 border-gray-400" />;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          ref={drag}
          className={cn(
            "absolute top-3 h-10 rounded-md border-l-4 text-xs font-medium transition-all hover:scale-[1.02] hover:shadow-md z-10 hover:z-20",
            statusStyle,
            canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
          )}
          style={position}
        >
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div 
                  className="w-full h-full px-2 py-1 flex flex-col justify-center overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onClick(schedule);
                  }}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="truncate font-bold">{title}</span>
                  </div>
                  {!isWeekView && (
                    <div className="flex items-center gap-1 opacity-80 w-full">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate text-[10px]">{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              
              <TooltipPrimitive.Portal>
                <TooltipContent 
                  side="top" 
                  align="center" 
                  className="z-[99999] w-80 p-0 border-slate-200 shadow-xl rounded-xl overflow-hidden "
                  avoidCollisions={true} 
                  sideOffset={8}
                >
                  <div className="flex flex-col">
                    <div className={cn("px-4 py-3 flex items-start justify-between border-b border-slate-100", 
                      isAllocated ? "bg-emerald-50/50" : "bg-amber-50/50"
                    )}>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {schedule.serviceType || 'General Visit'}
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>{formattedDate}</span>
                        </div>

                        <span className="text-xs text-slate-500 font-medium">
                          {durationString} ({schedule.startTime} - {schedule.endTime})
                        </span>
                      </div>
                      <Badge variant={isAllocated ? "default" : "secondary"} className={cn(
                        "mt-1",
                        isAllocated ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-amber-400 hover:bg-amber-500 text-amber-900"
                      )}>
                        {isAllocated ? 'Allocated' : 'Unallocated'}
                      </Badge>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Service User</p>
                          <p className="text-sm font-medium text-slate-900">{clientName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", 
                          isAllocated ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-400"
                        )}>
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Assigned Staff</p>
                          <p className={cn("text-sm font-medium", isAllocated ? "text-slate-900" : "text-slate-400 italic")}>
                            {employeeName}
                          </p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-slate-100"></div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Location Details</p>
                          <div className="flex flex-col">
                             <span className="text-sm font-medium text-slate-900">
                               {schedule.branch || 'No Branch'}
                             </span>
                             <span className="text-xs text-slate-500">
                               {schedule.area || 'No Area'}
                             </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </TooltipContent>
              </TooltipPrimitive.Portal>
            </Tooltip>
          </TooltipProvider>
        </div>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};