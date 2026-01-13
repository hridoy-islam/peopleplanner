import { MoveLeft, AlertCircle } from 'lucide-react';

import { ValidationNotification } from './components/ValidationNotification';

import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import ServiceUserProfilePage from './ServiceUserProfile';
import StaffProfilePage from './staffProfile';

const ProfilePage = () => {
  const user = useSelector((state:any) => state.auth?.user) || null;

    if(user?.role === "serviceUser"){
        return(
            <>
            <ServiceUserProfilePage/>
            </>
        )
    }
    if(user?.role === "staff"){
        return(
            <>
            <StaffProfilePage/>
            </>
        )
    }

  
 
};

export default ProfilePage;
