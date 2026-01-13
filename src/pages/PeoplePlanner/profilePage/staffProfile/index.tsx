import React from 'react';
import { MoveLeft } from 'lucide-react';
import { Tabs } from './components/Tabs';
import PersonalInfoTab from './tabs/PersonalInfoTab';
import ContactTab from './tabs/ContactTab';
import MiscellaneousTab from './tabs/DisabilityTab';
import EqualityTab from './tabs/EqualityTab';
import { useEditApplicant } from './hooks/useEditApplicant';
import { Button } from '@/components/ui/button';
import EmergencyContactTab from './tabs/BeneficiaryTab';
import CriticalInfoTab from './tabs/CriticalInformation';
import EquipmentTab from './tabs/EquipmentTab';
import NoteTab from './tabs/NoteTab';
import PrimaryBranchTab from './tabs/PrimaryBranchTab';
import { useNavigate, useParams } from 'react-router-dom';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { useSelector } from 'react-redux';
import IdentificationTab from './tabs/IdentificationTab';
import DisabilityTab from './tabs/DisabilityTab';
import BeneficiaryTab from './tabs/BeneficiaryTab';
import PayrollTab from './tabs/PayrollTab';

const StaffProfilePage = () => {
  const user = useSelector((state:any) => state.auth?.user) || null;
  const {id} = useParams();
  const navigate = useNavigate()
  // Calculate effective ID
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
    handleBulkUpdate
  } = useEditApplicant(effectiveUserId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BlinkingDots size="large" color="bg-supperagent" />
      </div>
    );
  }

  const tabs = [
    {
      id: 'general',
      label: 'General',
      component: (
        <PersonalInfoTab
          formData={formData || {}} 
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
          onSave={handleBulkUpdate}
        />
      )
    },
    {
      id: 'contact',
      label: 'Contact',
      component: (
        <ContactTab
          formData={formData || {}}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
          onSave={handleBulkUpdate}
        />
      )
    },
    {
      id: 'identification',
      label: 'Identification',
      component: (
        <IdentificationTab
          formData={formData || {}}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
          onSave={handleBulkUpdate}
        />
      )
    },
    {
      id: 'equality',
      label: 'Equality',
      component: (
        <EqualityTab
          formData={formData || {}}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
          onSave={handleBulkUpdate}
        />
      )
    },
    {
      id: 'disability',
      label: 'Disability',
      component: (
        <DisabilityTab
          formData={formData || {}}
          onUpdate={handleFieldUpdate}
          onDateChange={handleDateChange}
          onSelectChange={handleSelectChange}
          isFieldSaving={isFieldSaving}
          getMissingFields={getMissingFields}
          onSave={handleBulkUpdate}
        />
      )
    },
    {
        id: 'beneficiary',
        label: 'Beneficiary',
        component: (
          <BeneficiaryTab
            formData={formData || {}}
            onUpdate={handleFieldUpdate}
            onDateChange={handleDateChange}
            onSelectChange={handleSelectChange}
            isFieldSaving={isFieldSaving}
            getMissingFields={getMissingFields}
            onSave={handleBulkUpdate}
          />
        )
    },
    {
        id: 'payroll',
        label: 'Payroll',
        component: (
          <PayrollTab
            formData={formData || {}}
            onUpdate={handleFieldUpdate}
            onDateChange={handleDateChange}
            onSelectChange={handleSelectChange}
            isFieldSaving={isFieldSaving}
            getMissingFields={getMissingFields}
            onSave={handleBulkUpdate}
          />
        )
    },
 
 
  ];

  return (
    <div className="">
      <div className="mx-auto ">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
               {formData.firstName && formData.lastName
                ? `${formData.title || ''} ${formData.firstName} ${formData.lastName}`.trim()
                : 'Service User Profile'}
            </h1>
           
          </div>

          <Button
           
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="space-y-6">
            {/* Render Tabs Headers */}
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

export default StaffProfilePage;