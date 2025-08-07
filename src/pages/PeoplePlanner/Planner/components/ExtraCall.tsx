import {
  X,

} from 'lucide-react';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditApplicant } from './ExtraCallTabs/hooks/useEditApplicant';
import GeneralInfoTab from './ExtraCallTabs/tabs/GeneralInfoTab';
import EquipmentTab from './ExtraCallTabs/tabs/EquipmentTab';
import ExpenseTab from './ExtraCallTabs/tabs/ExpenseTab';
import TagTab from './ExtraCallTabs/tabs/TagTab';
import DayOnOffTab from './ExtraCallTabs/tabs/DayOnOffTab';
import NoteTab from './ExtraCallTabs/tabs/NoteTab';
import PurchaseOrderTab from './ExtraCallTabs/tabs/PurchaseOrderTab';
import BreakTab from './ExtraCallTabs/tabs/BreakTab';
import { Tabs } from './ExtraCallTabs/components/Tabs';
import { ValidationNotification } from './ExtraCallTabs/components/ValidationNotification';

interface ExtraCallComponentDialogProps {

  isOpen: boolean;
  onClose: () => void;
}


export function ExtraCallComponent({
  isOpen,
  onClose
}: ExtraCallComponentDialogProps) {
  if (!isOpen) return null;
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
                  Please provide a reason for canceling the action.
                </DialogDescription>
              </DialogHeader>
              <textarea
                className="w-full rounded-md border p-2"
                placeholder="Enter cancel reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
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
