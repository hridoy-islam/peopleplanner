import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

// ... (Keep FormData interface)
interface FormData {
  [key: string]: any; // Simplified for brevity, keep your full interface
}

export const useEditApplicant = (userId?: string) => {
  const { id: routeId } = useParams();
  
  // Use passed userId if available, otherwise fall back to route param
  const serviceUserId = userId || routeId;

  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [isFieldSaving, setIsFieldSaving] = useState<Record<string, boolean>>({});

  // ... (keep updateFieldOnServer, handlers, etc.)

  const updateFieldOnServer = async (field: string, value: any) => {
    if (!serviceUserId) return;
    setIsFieldSaving((prev) => ({ ...prev, [field]: true }));
    // ... (rest of logic)
     try {
      await axiosInstance.patch(`/users/${serviceUserId}`, { [field]: value });
      toast.success('Field updated successfully');
    } catch (error) {
      toast.error('Failed to update field');
    } finally {
      setIsFieldSaving((prev) => ({ ...prev, [field]: false }));
    }
  };
  
   const handleFieldUpdate = async (field: string, value: any) => updateFieldOnServer(field, value);
   const handleDateChange = async (field: string, value: string) => updateFieldOnServer(field, value);
   const handleSelectChange = async (field: string, value: string) => updateFieldOnServer(field, value);
   const handleCheckboxChange = async (field: string, value: boolean) => updateFieldOnServer(field, value);

  const handleBulkUpdate = async (updates: Partial<FormData>) => {
    if (!serviceUserId) return;
    try {
        await axiosInstance.patch(`/users/${serviceUserId}`, updates);
        setFormData((prev) => ({ ...prev, ...updates }));
        toast.success('Information updated successfully');
    } catch (error) {
        console.error('Failed to update information:', error);
        toast.error('Failed to update information');
        throw error;
    }
  };

  // getMissingFields helper stub
  const getMissingFields = () => [];

  useEffect(() => {
    // FIX: If no ID is present, stop loading immediately so we don't show infinite spinner
    if (!serviceUserId) {
        setLoading(false);
        return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/users/${serviceUserId}`);
        if (res.data?.data) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load applicant data:', error);
        toast.error("Could not load user data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [serviceUserId]);

  return {
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
    handleBulkUpdate,
    setFormData
  };
};