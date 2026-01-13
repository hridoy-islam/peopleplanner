import React from 'react';

interface Tab {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  const getTabStyles = (tabId: string) => {
    const isActive = activeTab === tabId;

    if (isActive) {
      return 'border-supperagent text-supperagent bg-blue-50/50';
    }

    return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="w-full">
      {/* Tab Header Grid */}
      <div className="mb-6 border-b border-gray-200 bg-white rounded-t-lg">
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-0
          "
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                inline-flex items-center justify-center gap-2
                px-4 py-4 text-sm font-medium
                border-b-2 transition-all duration-200 ease-in-out
                ${getTabStyles(tab.id)}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className="text-center">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content w-full">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};
