import React, { useState } from 'react';
import Payslip from './payslipPage';
import IndividualInvoiceForm from './IndividualInvoiceModal';

function AdminPayslipPage() {
  const [currentView, setCurrentView] = useState<'payslips' | 'create-payslip'>('payslips');

  return (
    <div className="min-h-screen ">
      {currentView === 'payslips' && (
        <Payslip onCreatePayslip={() => setCurrentView('create-payslip')} />
      )}
      {currentView === 'create-payslip' && (
        <IndividualInvoiceForm onClose={() => setCurrentView('payslips')} />
      )}
    </div>
  );
}

export default AdminPayslipPage;