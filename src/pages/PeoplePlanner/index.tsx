import AdminDashboardPage from './Dashboard/adminDhasboard';

import { useSelector } from 'react-redux';
import StaffDashboardPage from './Dashboard/staffDashboard';
import ServiceUserDashboardPage from './Dashboard/serviceUserDashboard';

const PeoplePlannerPage = () => {
  const { user } = useSelector((state: any) => state.auth);

  if (user.role === 'staff') {
    return <div className="min-h-screen"><StaffDashboardPage user={user} /> </div>;
  }
  if (user.role === 'serviceUser') {
    return (
      <div className="min-h-screen "><ServiceUserDashboardPage  /> </div>
    );
  }
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen ">
        <AdminDashboardPage   />

      </div>
    );
  }

  return null;
};

export default PeoplePlannerPage;
