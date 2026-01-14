import React from 'react';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';
import { Tabs } from './components/Tabs';
import PersonalInfoTab from './tabs/PersonalInfoTab';
import AddressTab from './tabs/AddressTab';
import MiscellaneousTab from './tabs/MiscellaneousTab';
import NotesTab from './tabs/NotesTab';
import { useEditApplicant } from './hooks/useEditApplicant';
import { BlinkingDots } from '@/components/shared/blinking-dots';

const ApplicantDetailPage = () => {
  const {
    loading,
    activeTab,
    setActiveTab,
    formData,
    handleFieldUpdate,
    handleDateChange,
    handleSelectChange,
    handleCheckboxChange,
    isFieldSaving
  } = useEditApplicant();

  if (loading) {
    return (
      <div className="flex  items-center justify-center bg-gray-50">
        <div className="flex justify-center py-6">
          <BlinkingDots size="large" color="bg-supperagent" />
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      component: (
        <PersonalInfoTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'address',
      label: 'Address & Contact',
      component: (
        <AddressTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'miscellaneous',
      label: 'Application Details',
      component: (
        <MiscellaneousTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          onCheckboxChange={handleCheckboxChange}
          isFieldSaving={isFieldSaving}
        />
      )
    },
    {
      id: 'notes',
      label: 'Notes',
      component: (
        <NotesTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          isFieldSaving={isFieldSaving}
        />
      )
    }
  ];

  return (
    <div className="">
      <div className=" mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applicant</h1>
            <p className="mt-2 text-gray-600">
              {formData.firstName && formData.lastName
                ? `${formData.title || ''} ${formData.firstName} ${formData.lastName}`.trim()
                : 'Manage applicant information'}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-supperagent bg-supperagent text-white hover:border-supperagent hover:bg-supperagent/90"
            onClick={() => window.history.back()}
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
};

export default ApplicantDetailPage;
