import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Select, { StylesConfig } from 'react-select';
import axiosInstance from '@/lib/axios';

interface TopControlsProps {
  filterBy: string;
  setFilterBy: (value: string) => void;
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  onScheduleClick: () => void;
  designation: string;
  setDesignation: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
}

// --- Option Type ---
interface OptionType {
  value: string;
  label: string;
}

// --- React Select Custom Styles ---
const customSelectStyles: StylesConfig<OptionType, false> = {
  control: (provided) => ({
    ...provided,
    minHeight: '36px',
    height: '36px',
    fontSize: '12px',
    borderColor: '#e5e7eb', // tailwind gray-200
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#d1d5db', // tailwind gray-300
    },
    minWidth: '130px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '36px',
    padding: '0 8px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '36px',
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: '12px',
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0f172a' : state.isFocused ? '#f1f5f9' : 'white',
    color: state.isSelected ? 'white' : '#334155',
    cursor: 'pointer',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
};

export function TopControls({
  filterBy,
  setFilterBy,
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  designation,
  setDesignation,
  department,
  setDepartment,
  status,
  setStatus,
  searchTerm,
  setSearchTerm,
  handleSearch,
  onScheduleClick
}: TopControlsProps) {
  
  // --- State for Dynamic Options ---
  const [departmentOptions, setDepartmentOptions] = useState<OptionType[]>([
    { value: 'all', label: 'All' }
  ]);
  const [designationOptions, setDesignationOptions] = useState<OptionType[]>([
    { value: 'all', label: 'All' }
  ]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- Static Options ---
  const filterByOptions: OptionType[] = [
    { value: 'serviceUser', label: 'Service User' },
    { value: 'staff', label: 'Employee' },
  ];

  const statusOptions: OptionType[] = [
    { value: 'all', label: 'All' },
    { value: 'allocated', label: 'Allocated' },
    { value: 'unallocated', label: 'Unallocated' },
  ];

  // --- Fetch Data ---
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoadingData(true);
      try {
        const deptReq = axiosInstance.get('/hr/department', { params: { limit: 'all' } });
        const desigReq = axiosInstance.get('/hr/designation', { params: { limit: 'all' } });

        const [deptRes, desigRes] = await Promise.all([deptReq, desigReq]);

        // Process Departments
        const fetchedDepts = deptRes.data?.data?.result || deptRes.data?.data || [];
        const formattedDepts = fetchedDepts.map((d: any) => ({
          value: d._id, 
          label: d.departmentName
        }));
        setDepartmentOptions([{ value: 'all', label: 'All' }, ...formattedDepts]);

        // Process Designations
        const fetchedDesigs = desigRes.data?.data?.result || desigRes.data?.data || [];
        const formattedDesigs = fetchedDesigs.map((d: any) => ({
          value: d._id,
          label: d.title
        }));
        setDesignationOptions([{ value: 'all', label: 'All' }, ...formattedDesigs]);

      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDropdownData();
  }, []);

  // --- Helpers ---
  const getValueObj = (options: OptionType[], value: string) => 
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative z-40 w-full bg-white py-2 shadow-sm">
     
      <div className="flex w-full flex-wrap items-end justify-between gap-y-3 gap-x-4 ">
        
        {/* Left Side: Filters */}
        <div className="flex flex-wrap items-end gap-3">
          
          {/* Filter By */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Filter View</span>
            <Select
              value={getValueObj(filterByOptions, filterBy)}
              onChange={(opt) => setFilterBy(opt?.value || 'serviceUser')}
              options={filterByOptions}
              styles={customSelectStyles}
              isSearchable={false}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Designation</span>
            <Select
              value={getValueObj(designationOptions, designation)}
              onChange={(opt) => setDesignation(opt?.value || 'all')}
              options={designationOptions}
              styles={customSelectStyles}
              isLoading={isLoadingData}
              placeholder="Select..."
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Department</span>
            <Select
              value={getValueObj(departmentOptions, department)}
              onChange={(opt) => setDepartment(opt?.value || 'all')}
              options={departmentOptions}
              styles={customSelectStyles}
              isLoading={isLoadingData}
              placeholder="Select..."
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Status</span>
            <Select
              value={getValueObj(statusOptions, status)}
              onChange={(opt) => setStatus(opt?.value || 'all')}
              options={statusOptions}
              styles={customSelectStyles}
              isSearchable={false}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          </div>

          {/* Search Input */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Search</span>
            <Input
              id="search"
              type="text"
              placeholder="Search User..."
              className="h-[36px] w-48 text-xs border-gray-200 focus-visible:ring-1 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
               <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Zoom</span>
            <div className="flex h-[36px] flex-row items-center gap-1 bg-gray-50 px-2 rounded-md border border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-6 w-6 p-0 hover:bg-white hover:shadow-sm"
              >
                <Minus className="h-3 w-3 text-gray-600" />
              </Button>
              <div className="relative h-1.5 w-16 rounded bg-gray-200 mx-1">
                <div
                  className="h-1.5 rounded bg-teal-600 transition-all duration-200"
                  style={{ width: `${((zoomLevel - 2) / 6) * 100}%` }}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-6 w-6 p-0 hover:bg-white hover:shadow-sm"
              >
                <Plus className="h-3 w-3 text-gray-600" />
              </Button>
              <span className="text-[10px] font-medium text-gray-500 w-6 text-center">{zoomLevel}x</span>
            </div>
          </div>

          {/* Add Button */}
          <div>
             <div className="h-[21px]" /> 
            <Button
              variant="default"
              className="flex h-[36px] items-center gap-1 bg-supperagent px-6 text-xs font-medium text-white hover:bg-supperagent/90 shadow-sm"
              onClick={() => onScheduleClick()}
            >
              Add Schedule
            </Button>
          </div>
        </div>

    
     

      </div>
    </div>
  );
}