import { useSelector } from "react-redux";
import AdminPayslipPage from "./components/AdminPayslip";
import StaffPayslipPage from "./components/StaffPayslip";

function PayslipPage() {
  const { user } = useSelector((state: any) => state.auth);


  if (user.role === 'admin') {
    return <AdminPayslipPage />;
  }

  if (user.role === 'staff') {
    return <StaffPayslipPage />;
  }

  return null;
}

export default PayslipPage;