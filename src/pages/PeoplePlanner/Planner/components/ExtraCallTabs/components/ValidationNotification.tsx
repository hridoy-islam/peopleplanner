import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface ValidationNotificationProps {
  validation: { [key: string]: { isValid: boolean; missingFields: string[] } };
  onTabClick: (tabId: string) => void;
  userId: string;
  onDeleteClick: () => void; // New prop for delete
  onCancelClick: () => void; // New prop for cancel
}

const tabLabels: { [key: string]: string } = {
  general: 'General',
  equipment: 'Equipment',
  expense: 'Expenses',
  tag: 'Tag',
  dayOnOff: 'Day ON/OFF',
  note: 'Note',
  po: 'PO',
  break: 'Break'
};

export const ValidationNotification: React.FC<ValidationNotificationProps> = ({
  validation,
  onTabClick,
  onDeleteClick, // Handling delete
  onCancelClick, // Handling cancel
}) => {
  const allTabs = Object.entries(validation).filter(([tabId]) =>
    Object.keys(tabLabels).includes(tabId)
  );

  if (allTabs.length === 0) return null;

  return (
    <div className="w-72 self-center rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="space-y-2 p-2">
        {allTabs.map(([tabId, tabValidation]) => {
          const isInvalid = !tabValidation.isValid;

          return (
            <div
              key={tabId}
              className="group cursor-pointer rounded-md border border-gray-300 px-2 py-1 transition-all duration-200 hover:border-supperagent"
              onClick={() => onTabClick(tabId)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">{tabLabels[tabId]}</span>
                <ChevronRight className="h-4 w-4 text-supperagent transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
        
        {/* Delete Button */}
        {/* <div
          className="group cursor-pointer rounded-md border border-gray-300 px-2 py-1 transition-all duration-200 hover:border-destructive"
          onClick={onDeleteClick} 
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-destructive transition-transform group-hover:translate-x-1 group-hover:text-destructive">Delete</span>
          </div>
        </div> */}

        {/* Cancel Button */}
        {/* <div
          className="group cursor-pointer rounded-md border border-gray-300 px-2 py-1 transition-all duration-200 hover:border-destructive"
          onClick={onCancelClick} 
        >
          <div className="flex items-center justify-start gap-2">
            <X className="h-4 w-4 text-destructive transition-transform group-hover:translate-x-1" />
            <span className="text-sm font-medium text-destructive transition-transform group-hover:translate-x-1">Cancel</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};
