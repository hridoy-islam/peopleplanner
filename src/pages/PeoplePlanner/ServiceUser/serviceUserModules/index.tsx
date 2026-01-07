import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';



const ServiceUserModulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    

    const modules = [
      {
        id: 1,
        title: 'Profile',
        link: `/admin/people-planner/service-user/${id}`,
        icon: 'clipboard'
      },
      {
        id: 2,
        title: 'Needs',
        link: `/admin/people-planner/needs/${id}`,
        icon: 'calendar'
      },
      {
        id: 3,
        title: 'Medications',
        link: '/medications',
        icon: 'pill'
      },
      {
        id: 4,
        title: 'Care Plan',
        link: '/care-plan',
        icon: 'heart'
      },
      {
        id: 5,
        title: 'Documents',
        link: '/documents',
        icon: 'folder'
      },
      {
        id: 6,
        title: 'Settings',
        link: '/settings',
        icon: 'cog'
      }
    ];

    const ModuleIcon = ({ type }) => {
      const baseClass = 'w-6 h-6';
      switch (type) {
        case 'clipboard':
          return (
            <svg
              className={baseClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          );
        case 'calendar':
          return (
            <svg
              className={baseClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          );
        case 'pill':
          return (
            <svg
              className={baseClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          );
        case 'heart':
          return (
            <svg
              className={baseClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          );
        case 'folder':
          return (
            <svg
              className={baseClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1a2 2 0 002 2h0a2 2 0 012 2v3a2 2 0 01-2 2H5z"
              />
            </svg>
          );
        case 'cog':
          return (
            <svg
              className={baseClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          );
        default:
          return null;
      }
    };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserData();
  }, [id]);

  const handleCardClick = (link) => {
    navigate(link);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <BlinkingDots size="large" color="text-supperagent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700">User not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-supperagent hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div>
        {/* --- Profile Header Card --- */}
        <div className="relative overflow-hidden rounded-2xl  bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Avatar Section */}
            <div className="relative">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-gray-100">
                <img
                  src={user?.image || 'https://via.placeholder.com/150'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Active Status Indicator (Optional) */}
              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <Button
                  onClick={() => navigate(-1)}
                  className="bg-supperagent text-white hover:bg-supperagent/90"
                >
                  <MoveLeft />
                  Back
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-700 ring-1 ring-gray-200/50">
                  <svg
                    className="h-4 w-4 text-supperagent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {user.email}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-700 ring-1 ring-gray-200/50">
                  <svg
                    className="h-4 w-4 text-supperagent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {user.phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Modules Grid --- */}
        <div className="mt-10">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => handleCardClick(module.link)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-supperagent/50 hover:shadow-lg"
              >
                    <div className="flex items-start justify-between">
                        <div className='flex flex-row items-center gap-4'>
                  <div className="inline-flex items-center justify-center rounded-lg bg-gray-50 p-3 text-supperagent transition-colors group-hover:bg-supperagent group-hover:text-white">
                    <ModuleIcon type={module.icon} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-supperagent">
                    {module.title}
                  </h3>
                        </div>
                  
                  <svg
                    className="h-5 w-5 text-gray-300 transition-colors group-hover:text-supperagent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceUserModulePage;
