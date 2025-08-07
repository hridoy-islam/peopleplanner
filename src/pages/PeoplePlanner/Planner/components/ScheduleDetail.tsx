import { X } from 'lucide-react';
import { ValidationNotification } from './scheduleTabs/components/ValidationNotification';

import { useEditApplicant } from './scheduleTabs/hooks/useEditApplicant';
import type { schedule } from '@/types/planner';
import GeneralInfoTab from './scheduleTabs/tabs/GeneralInfoTab';
import EquipmentTab from './scheduleTabs/tabs/EquipmentTab';
import { Tabs } from './scheduleTabs/components/Tabs';
import TagTab from './scheduleTabs/tabs/TagTab';
import DayOnOffTab from './scheduleTabs/tabs/DayOnOffTab';
import NoteTab from './scheduleTabs/tabs/NoteTab';
import PurchaseOrderTab from './scheduleTabs/tabs/PurchaseOrderTab';
import BreakTab from './scheduleTabs/tabs/BreakTab';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ExpenseTab from './scheduleTabs/tabs/ExpenseTab';
import LogTab from './scheduleTabs/tabs/LogTab';

interface ScheduleDetailDialogProps {
  schedule: schedule | null;
  isOpen: boolean;
  onClose: () => void;
}

const mockUser = {
  id: '12345',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  phone: '123-456-7890',
  role: 'Admin',
  scheduleId: 'schedule-001',
  scheduleTitle: 'Weekly Team Meeting',
  profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg', // Mocked profile picture URL
  createdAt: new Date('2022-06-15T14:48:00Z'),
  updatedAt: new Date('2023-04-25T10:22:00Z')
};

export function ScheduleDetailComponent({
  schedule,
  isOpen,
  onClose
}: ScheduleDetailDialogProps) {
  if (!isOpen || !schedule) return null;
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    loading,
    activeTab,
    setActiveTab,
    formData,
    handleFieldUpdate,
    handleDateChange,
    handleSelectChange,
    handleCheckboxChange,
    isFieldSaving,
    getMissingFields,
    getTabValidation
  } = useEditApplicant();

  const tabValidation = getTabValidation();

  const tabs = [
    {
      id: 'general',
      label: 'General',
      component: (
        <GeneralInfoTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
        />
      )
    },
    {
      id: 'equipment',
      label: 'Equipment',
      component: (
        <EquipmentTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'expense',
      label: 'Expenses',
      component: (
        <ExpenseTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'tag',
      label: 'Tag',
      component: (
        <TagTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'dayOnOff',
      label: 'Day ON/OFF',
      component: (
        <DayOnOffTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
        />
      )
    },
    {
      id: 'note',
      label: 'Note',
      component: (
        <NoteTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
        />
      )
    },
    {
      id: 'po',
      label: 'PO',
      component: (
        <PurchaseOrderTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'break',
      label: 'Break',
      component: (
        <BreakTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'logs',
      label: 'Logs',
      component: <LogTab />
    }
  ];

  const handleTabNavigation = (tabId: string) => {
    setActiveTab(tabId);
  };
  const handleCancel = () => {
    console.log(
      `$${mockUser.firstName} ${mockUser.lastName} canceled the action. Reason: ${cancelReason}`
    );
    setIsCancelDialogOpen(false);
  };

  const handleDelete = () => {
    console.log(
      `${mockUser.firstName} ${mockUser.lastName} deleted the schedule with ID: ${schedule?.id}`
    );
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="animate-scale-in flex h-[90vh] w-[90vw] max-w-6xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-2">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {schedule.title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-2">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              validation={tabValidation}
            />
          </div>

          {/* Validation Sidebar */}
          <div className="w-auto overflow-auto border-l border-gray-200 bg-gray-50 p-2">
            <ValidationNotification
              validation={tabValidation}
              onTabClick={handleTabNavigation}
              userId={schedule.id}
              onCancelClick={() => setIsCancelDialogOpen(true)}
              onDeleteClick={() => setIsDeleteDialogOpen(true)}
            />
          </div>
        </div>

        {/* Cancel Dialog */}
        {isCancelDialogOpen && (
          <Dialog
            open={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Action</DialogTitle>
                <DialogDescription>
                  Please select a reason for canceling the action.
                </DialogDescription>
              </DialogHeader>

              {/* shadcn/ui Select Component */}
              <div className="py-2">
                <Select
                  value={cancelReason}
                  onValueChange={setCancelReason}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cancelled on Arrival">
                      Cancelled on Arrival
                    </SelectItem>
                    <SelectItem value="Coronavirus - Concerns">
                      Coronavirus - Concerns
                    </SelectItem>
                    <SelectItem value="Coronavirus - Financial Reasons">
                      Coronavirus - Financial Reasons
                    </SelectItem>
                    <SelectItem value="Coronavirus - Hospitalised">
                      Coronavirus - Hospitalised
                    </SelectItem>
                    <SelectItem value="Coronavirus - Self Isolating">
                      Coronavirus - Self Isolating
                    </SelectItem>
                    <SelectItem value="Coronavirus - Shielding">
                      Coronavirus - Shielding
                    </SelectItem>
                    <SelectItem value="Less Than 24 Hours Notice (With Pay)">
                      Less Than 24 Hours Notice (With Pay)
                    </SelectItem>
                    <SelectItem value="Less Than 24 Hours Notice (Without Pay)">
                      Less Than 24 Hours Notice (Without Pay)
                    </SelectItem>
                    <SelectItem value="More Than 24 Hours Notice">
                      More Than 24 Hours Notice
                    </SelectItem>
                    <SelectItem value="Zero">Zero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={handleCancel}
                  className="bg-red-500 text-white hover:bg-red-500/80"
                  disabled={!cancelReason} // Prevent confirm if no reason selected
                >
                  Confirm Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Schedule</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this schedule? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-500/80"
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
