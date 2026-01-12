import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BlinkingDots } from '@/components/shared/blinking-dots';

// --- Types ---
interface SectionData {
  description: string;
  supportedBy: string;
}

interface ProfileData {
  _id?: string; // Optional because a new profile won't have an ID yet
  userId: string;
  importantToMe: SectionData;
  importantPeople: SectionData;
  dailyRoutine: SectionData;
  communication: SectionData;
}

// --- Configuration ---
const SECTION_CONFIG = [
  {
    key: 'importantToMe' as keyof ProfileData,
    title: 'What is important to me',
    emoji: '😊'
  },
  {
    key: 'importantPeople' as keyof ProfileData,
    title: 'People who are important to me',
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    key: 'dailyRoutine' as keyof ProfileData,
    title: 'My daily routine',
    emoji: '⏰'
  },
  {
    key: 'communication' as keyof ProfileData,
    title: 'How I communicate best',
    emoji: '💬'
  }
];

// --- Default Empty State (Prevents "Edit" button from failing if no data exists) ---
const DEFAULT_PROFILE: ProfileData = {
  userId: '',
  importantToMe: { description: '', supportedBy: '' },
  importantPeople: { description: '', supportedBy: '' },
  dailyRoutine: { description: '', supportedBy: '' },
  communication: { description: '', supportedBy: '' }
};

export default function AboutMe() {
  const { toast } = useToast();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [userData, setUserData] = useState<any>(null);
  const [editingKey, setEditingKey] = useState<keyof ProfileData | null>(null);
  const [tempValues, setTempValues] = useState<SectionData>({
    description: '',
    supportedBy: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/about-me-logs`, {
          params: { userId: id }
        });

        const userRes = await axiosInstance.get(`/users/${id}`);

        const fetchedData = res.data?.data?.result?.[0];
        setUserData(userRes.data?.data);

        if (fetchedData) {
          setProfileData(fetchedData);
        } else {
          // If no data, keep the default empty structure but set the userId
          setProfileData((prev) => ({ ...prev, userId: id || '' }));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleEdit = (key: keyof ProfileData) => {
    const section = profileData[key] as SectionData;

    // 2. Load into temp state for editing
    setTempValues({
      description: section?.description || '',
      supportedBy: section?.supportedBy || ''
    });

    setEditingKey(key);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setTempValues({ description: '', supportedBy: '' });
  };

  const handleSave = async (key: keyof ProfileData) => {
    setIsSaving(true);
    try {
      const payload = {
        [key]: {
          description: tempValues.description,
          supportedBy: tempValues.supportedBy
        }
      };

      let res;
      if (profileData._id) {
        // Update existing
        res = await axiosInstance.patch(
          `/about-me-logs/${profileData._id}`,
          payload
        );
      } else {
        // Create new if it doesn't exist yet (Optional logic depending on your backend)
        res = await axiosInstance.post(`/about-me-logs`, {
          ...payload,
          userId: id
        });
      }

      if (res.data?.success) {
        // Update local state deeply
        setProfileData((prev) => ({
          ...prev,
          _id: res.data.data._id || prev._id, // Capture ID if created new
          [key]: {
            description: tempValues.description,
            supportedBy: tempValues.supportedBy
          }
        }));

        toast({
          title: 'Success',
          description: 'Section updated successfully.'
        });
        setEditingKey(null);
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to handle input changes
  const handleTempChange = (field: keyof SectionData, value: string) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <BlinkingDots size="large" color="bg-supperagent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          About{' '}
          {`${userData?.title} ${userData?.firstName} ${userData?.lastName}`}
        </h1>
        <Button className="border-gray-300" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="space-y-6">
        {SECTION_CONFIG.map((config) => {
          // Safely access the section data
          // (profileData is guaranteed to be an object now)
          const sectionData = profileData[config.key] as SectionData;
          const isEditing = editingKey === config.key;

          return (
            <Card key={config.key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    {config.title} <span className="ml-2">{config.emoji}</span>
                  </CardTitle>

                  {/* Toggle Buttons */}
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(config.key)}
                      className="shrink-0"
                      disabled={isSaving}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(config.key)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 1. Description Area */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    Description
                  </h3>
                  {isEditing ? (
                    <Textarea
                      value={tempValues.description}
                      onChange={(e) =>
                        handleTempChange('description', e.target.value)
                      }
                      className="min-h-[150px] resize-y border-gray-300 bg-white"
                      placeholder={`Enter details about ${config.title.toLowerCase()}...`}
                    />
                  ) : (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                      {sectionData?.description || 'No description provided.'}
                    </p>
                  )}
                </div>

                {/* 2. Supported By Area */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    Supported to write this by
                  </h3>
                  {isEditing ? (
                    <Textarea
                      value={tempValues.supportedBy}
                      onChange={(e) =>
                        handleTempChange('supportedBy', e.target.value)
                      }
                      placeholder="e.g. My son Shaquile..."
                      className="border-gray-300 bg-white"
                    />
                  ) : (
                    <p className="text-sm italic text-gray-500">
                      {sectionData?.supportedBy || 'N/A'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
