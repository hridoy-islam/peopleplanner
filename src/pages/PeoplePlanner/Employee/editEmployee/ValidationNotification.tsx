import React from 'react';
import { CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

interface TabValidation {
  isValid: boolean;
  missingFields: string[];
}

interface ValidationNotificationProps {
  validation: Record<string, TabValidation>;
  onTabClick: (tabId: string) => void;
  tabLabels: Record<string, string>;
}

export const ValidationNotification: React.FC<ValidationNotificationProps> = ({
  validation,
  onTabClick,
  tabLabels,
}) => {
  const allTabs = Object.entries(validation);
  
  // Calculate total errors to decide if we show the component
  const totalErrors = allTabs.reduce((acc, [_, val]) => acc + val.missingFields.length, 0);

  if (totalErrors === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="bg-red-50 p-3 border-b border-red-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Missing Required Information
        </h3>
        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
          {totalErrors} fields
        </span>
      </div>
      <div className="max-h-96 overflow-y-auto p-2 space-y-1">
        {allTabs.map(([tabId, tabValidation]) => {
          const isInvalid = !tabValidation.isValid;
          const missingCount = tabValidation.missingFields.length;
          
          // Don't show tabs that are valid
          if (!isInvalid) return null;

          return (
            <div
              key={tabId}
              className="group cursor-pointer p-2.5 rounded-md border border-transparent hover:bg-gray-50 hover:border-supperagent transition-all duration-200"
              onClick={() => onTabClick(tabId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isInvalid ? (
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">
                      {missingCount}
                    </span>
                  ) : (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  )}
                  <span className={`text-sm font-medium ${isInvalid ? 'text-gray-900' : 'text-gray-500'}`}>
                    {tabLabels[tabId] || tabId}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-supperagent group-hover:translate-x-1 transition-transform" />
              </div>
              {/* Optional: Show first few missing fields as hint */}
              {isInvalid && (
                <div className="mt-1 pl-9 text-xs text-red-400 truncate">
                   Missing: {tabValidation.missingFields.slice(0, 3).join(', ')}
                   {tabValidation.missingFields.length > 3 && '...'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};