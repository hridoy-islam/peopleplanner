import React from 'react';

// Define the structure for validation data
interface TabValidation {
  isValid: boolean;
  missingFields: string[];
}

interface Tab {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  validationErrors?: Record<string, TabValidation>;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, validationErrors }) => {
  return (
    <div className="mb-8">
      <div className="mb-4 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px overflow-x-auto">
          {tabs.map((tab) => {
            // Calculate number of errors for this specific tab
            const errorCount = validationErrors?.[tab.id]?.missingFields?.length || 0;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'border-supperagent text-supperagent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
                {/* Show badge if there are errors */}
                {errorCount > 0 && (
                  <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-in zoom-in-50 duration-200">
                    {errorCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};