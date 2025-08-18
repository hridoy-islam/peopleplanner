import { useSelector } from 'react-redux';

import { BlinkingDots } from '@/components/shared/blinking-dots';
import StaffNoticeBoard from './components/StaffNotice';
import AdminNoticeBoard from './components/AdminNotice';

const NoticeBoard = () => {
  const user = useSelector((state: any) => state.auth?.user) || null;

  if (!user) {
    return (
      <div className="flex justify-center py-6">
        <BlinkingDots size="large" color="bg-supperagent" />
      </div>
    );
  }

  return user.role === 'admin' ? (
    <AdminNoticeBoard />
  ) : (
    <StaffNoticeBoard />
  );
};

export default NoticeBoard;
