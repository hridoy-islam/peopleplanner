import React from 'react';
import { MoveLeft } from 'lucide-react';
import { Tabs } from './components/Tabs';
import PersonalInfoTab from './tabs/PersonalInfoTab';
import AddressTab from './tabs/ContactTab';
import MiscellaneousTab from './tabs/MiscellaneousTab';
import EqualityTab from './tabs/EqualityTab';
import { useEditApplicant } from './hooks/useEditApplicant';
import { Button } from '@/components/ui/button';
import EmergencyContactTab from './tabs/EmergencyContacTab';
import CriticalInfoTab from './tabs/CriticalInformation';
import EquipmentTab from './tabs/EquipmentTab';
import NoteTab from './tabs/NoteTab';
import PrimaryBranchTab from './tabs/PrimaryBranchTab';
import ContactTab from './tabs/ContactTab';
import { useNavigate, useParams } from 'react-router-dom';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { useSelector } from 'react-redux';

const ServiceUserProfilePage = () => {
  const user = useSelector((state:any) => state.auth?.user) || null;
  const {id} = useParams();
  const navigate = useNavigate()
  const effectiveUserId = user?.role === 'admin' && id ? id : user?._id;

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
    // getTabValidation removed as not needed for UI anymore
  } = useEditApplicant(effectiveUserId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
           <BlinkingDots size="large" color="bg-supperagent" />
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'general',
      label: 'General',
      component: (
        <PersonalInfoTab
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
      id: 'contact',
      label: 'Contact',
      component: (
        <ContactTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
        />
      )
    },
    {
      id: 'equality',
      label: 'Equality',
      component: (
        <EqualityTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
        />
      )
    },
    {
      id: 'other',
      label: 'Other',
      component: (
        <MiscellaneousTab
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
      id: 'emergency',
      label: 'Emergency Contact',
      component: (
        <EmergencyContactTab
          formData={formData}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
        />
      )
    }
    
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto py-8">
        <div className="-mt-8 mb-4 flex items-center justify-between">
          <p className="mt-2 text-3xl font-semibold">
            {formData.firstName && formData.lastName
              ? `${formData.title || ''} ${formData.firstName} ${formData.lastName}`.trim()
              : 'Service User'}
          </p>

          <Button
            variant="outline"
            className="border-none bg-supperagent text-white hover:bg-supperagent/90"
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Updated Layout: Single Column, Tabs at Top, No Side Validation */}
        <div className="w-full">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
        </div>
      </div>
    </div>
  );
};

export default ServiceUserProfilePage;