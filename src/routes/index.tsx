import ProtectedRoute from '@/components/shared/ProtectedRoute';
import ForgotPassword from '@/pages/auth/forget-password';
import SignUpPage from '@/pages/auth/sign-up';

import { Children, Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Otp from '@/pages/auth/otp';
import AdminLayout from '@/components/layout/admin-layout';
import { DashboardPage } from '@/pages/Dashboard';
import ErrorPage from '@/pages/ErrorPage/';
import NewPassword from '@/pages/auth/NewPassword';



import PeoplePlannerPage from '@/pages/PeoplePlanner';

import PeoplePlannerLayout from '@/components/layout/peoplePlanner-layout';
import CreateServiceUserPage from '@/pages/PeoplePlanner/ServiceUser/create';
import PServiceUserList from '@/pages/PeoplePlanner/ServiceUser';
import ServiceFunderList from '@/pages/PeoplePlanner/ServiceFunder';
import CreateServiceFunderPage from '@/pages/PeoplePlanner/ServiceFunder/create-funder';
import PlannerPage from '@/pages/PeoplePlanner/Planner';
import ServiceuserDetailPage from '@/pages/PeoplePlanner/ServiceUser/serviceUserDetail';
import ServiceFunderDetailPage from '@/pages/PeoplePlanner/ServiceFunder/view-funder';
import JobPage from '@/pages/PeoplePlanner/Jobs';
import ServiceUserFunder from '@/pages/PeoplePlanner/ServiceUser/funder';
import CreateServiceUserFunderPage from '@/pages/PeoplePlanner/ServiceUser/funder/create-funder';
import { ReportPage } from '@/pages/PeoplePlanner/reports';
import InvoicePage from '@/pages/PeoplePlanner/Invoice';
import ServiceUserPlannerPage from '@/pages/PeoplePlanner/ServiceUser/planner';
import ServiceUserTask from '@/pages/PeoplePlanner/ServiceUser/task';
import ViewTaskPage from '@/pages/PeoplePlanner/ServiceUser/task/view-task';
import PayslipPage from '@/pages/PeoplePlanner/payslips';

import NoticeBoard from '@/pages/PeoplePlanner/NoticeBoard';
import TrainingPage from '@/pages/PeoplePlanner/Training';
import Department from '@/pages/PeoplePlanner/Department';
import Designation from '@/pages/PeoplePlanner/Designation';
import AddDesignation from '@/pages/PeoplePlanner/Designation/CreateDesignation';
import EditDesignation from '@/pages/PeoplePlanner/Designation/EditDesignation';
import Employee from '@/pages/PeoplePlanner/Employee';
import EditEmployee from '@/pages/PeoplePlanner/Employee/editEmployee';
import EmployeeRate from '@/pages/PeoplePlanner/Employee/employeeRate';
import Holiday from '@/pages/PeoplePlanner/Holidays';
import Shift from '@/pages/PeoplePlanner/Shift';
import CreateShift from '@/pages/PeoplePlanner/Shift/CreateShift';
import EditShift from '@/pages/PeoplePlanner/Shift/EditShift';
import Vacancy from '@/pages/PeoplePlanner/Vacancy';
import CreateVacancy from '@/pages/PeoplePlanner/Vacancy/CreateVacancy';
import EditVacancy from '@/pages/PeoplePlanner/Vacancy/EditVacancy';
import AddApplicant from '@/pages/PeoplePlanner/Vacancy/AddApplicant';
import Attendance from '@/pages/PeoplePlanner/Attendance';
import AttendanceApprovalPage from '@/pages/PeoplePlanner/Attendance/Attendance-Approve';
import AttendanceApproveList from '@/pages/PeoplePlanner/Attendance/Attendance-Approve/attendance-list';
import AttendanceReport from '@/pages/PeoplePlanner/Attendance/Attendance-Report';
import AttendanceList from '@/pages/PeoplePlanner/Attendance/attendaceList';
import EntryAttendance from '@/pages/PeoplePlanner/Attendance/entry-attendance';
import CompanyDetails from '@/pages/PeoplePlanner/Company-Details';
import EmailSetup from '@/pages/PeoplePlanner/Email-Setup';
import RecruitApplicantForm from '@/pages/PeoplePlanner/Recruitment';
import ViewApplicant from '@/pages/PeoplePlanner/Vacancy/ViewApplicants';
import ApplicantDetailPage from '@/pages/PeoplePlanner/Vacancy/viewApplicant';
import DevicePage from '@/pages/PeoplePlanner/Device';
import NeedPage from '@/pages/PeoplePlanner/Needs';
import ImportantPeoplePage from '@/pages/PeoplePlanner/ImportantPeople';
import PersonalForm from '@/pages/PeoplePlanner/ImportantPeople/components/personalForm';
import ProfessionalForm from '@/pages/PeoplePlanner/ImportantPeople/components/professionalForm';
import AboutMe from '@/pages/PeoplePlanner/AboutMe';
import ContingencyPlan from '@/pages/PeoplePlanner/Contingency-Plan';
import DailyLogs from '@/pages/DailyLogs';
import GeneralCharts from '@/pages/PeoplePlanner/General-Charts';
import RiskAssessmentScorePage from '@/pages/PeoplePlanner/RiskAssessmentScore';
import ChartDetailPage from '@/pages/PeoplePlanner/General-Charts/components/ChartDetailPage';
import DocumentPage from '@/pages/PeoplePlanner/Documents';
import SupportPlanPage from '@/pages/PeoplePlanner/SupportPlan';
import SupportPlanDetailPage from '@/pages/PeoplePlanner/SupportPlan/components/SupportPlanDetailPage';
import InitialAssessmentPage from '@/pages/PeoplePlanner/InitialAssessment';
import InitialAssessmentDetailPage from '@/pages/PeoplePlanner/InitialAssessment/components/InitialAssessmentDetailPage';
import RiskAssessmentPage from '@/pages/PeoplePlanner/RiskAssessment';
import CreateRiskAssessmentPage from '@/pages/PeoplePlanner/RiskAssessment/createPage';
import RiskAssessmentDetailPage from '@/pages/PeoplePlanner/RiskAssessment/components/AssessmentDetailPage';
import MarChartPage from '@/pages/PeoplePlanner/MARChart';
import AddMedicationPage from '@/pages/PeoplePlanner/MARChart/addMedicine';
import StockPage from '@/pages/PeoplePlanner/Stock';
import StockDetailPage from '@/pages/PeoplePlanner/Stock/components/StockDetailPage';
import ConsentPage from '@/pages/PeoplePlanner/Consent';
import AddCapacityFormPage from '@/pages/PeoplePlanner/Consent/components/add-capacity-form';
import AddConsentFormPage from '@/pages/PeoplePlanner/Consent/components/add-consent-form';
import StaffAttendancePage from '@/pages/PeoplePlanner/StaffAttendance';
import ServiceUserFunderDetailPage from '@/pages/PeoplePlanner/ServiceUser/funder/view-funder';
import CreateTraining from '@/pages/PeoplePlanner/Training/CreateTraining';
import EditTraining from '@/pages/PeoplePlanner/Training/EditTraining';
import LeaveApprovalPage from '@/pages/PeoplePlanner/LeaveApproval';
import MyStaff from '@/pages/PeoplePlanner/MyStaff';
import BankHolidayPage from '@/pages/PeoplePlanner/Bank-Holiday';
import HRDashboardPage from '@/pages/PeoplePlanner/HR-Dashboard/adminDashboard';
import PendingHiring from '@/pages/PeoplePlanner/Pending-Hiring';
import RequestDocumentPage from '@/pages/PeoplePlanner/RequestDocument';
import DocumentReportPage from '@/pages/PeoplePlanner/RequestDocument';
import AdminRequestDocumentPage from '@/pages/PeoplePlanner/Request-Documents';
import UpcomingSchedulePage from '@/pages/PeoplePlanner/todaySchedule';
import ServiceUserModulePage from '@/pages/PeoplePlanner/ServiceUser/serviceUserModules';
import EditCapacityFormPage from '@/pages/PeoplePlanner/Consent/components/edit-capacity-form';
import EditConsentFormPage from '@/pages/PeoplePlanner/Consent/components/edit-consent-form';
import TodaysSchedulePage from '@/pages/PeoplePlanner/todaySchedule';
import SchedulePage from '@/pages/PeoplePlanner/schedulePage';
import PassportExpiryPage from '@/pages/PeoplePlanner/HR-Dashboard/components/passportExpiray';
import TrainingExpiryPage from '@/pages/PeoplePlanner/HR-Dashboard/components/trainingExprity';
import RightToWorkExpiryPage from '@/pages/PeoplePlanner/HR-Dashboard/components/rightToWork';
import RightToWorkStatusPage from '@/pages/PeoplePlanner/HR-Dashboard/components/rightToWorkStatus';
import ProfilePage from '@/pages/PeoplePlanner/profilePage';
import ServiceUserProfilePage from '@/pages/PeoplePlanner/profilePage/ServiceUserProfile';

const SignInPage = lazy(() => import('@/pages/auth/signin'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const adminRoutes = [
    {
      path: '/admin',
      element: (
        <AdminLayout>
          <ProtectedRoute>
            <Suspense>
              <Outlet />
            </Suspense>
          </ProtectedRoute>
        </AdminLayout>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true
        },

        {
          path: 'people-planner',
          element: <PeoplePlannerLayout />,
          children: [
            {
              element: <PeoplePlannerPage />,
              index: true
            },

            {
              path: 'service-user',
              element: <PServiceUserList />
            },
            {
              path: 'service-user/:id/modules',
              element: <ServiceUserModulePage />
            },
            {
              path: 'hr-dashboard',
              element: <HRDashboardPage />
            },
            {
              path: 'expiry/passport',
              element: <PassportExpiryPage />
            },
            {
              path: 'expiry/training',
              element: <TrainingExpiryPage />
            },
            {
              path: 'expiry/rightToWork',
              element: <RightToWorkExpiryPage />
            },
            {
              path: 'expiry/rightToWorkStatus',
              element: <RightToWorkStatusPage />
            },
            {
              path: 'service-user/new',
              element: <CreateServiceUserPage />
            },
            {
              path: 'service-user/:id',
              element: <ServiceuserDetailPage />
            },
            {
              path: 'service-user/:id/planner',
              element: <ServiceUserPlannerPage />
            },
            {
              path: 'service-user/:id/schedule',
              element: <ServiceUserTask />
            },
            {
              path: 'service-user/:id/tasks/:taskId',
              element: <ViewTaskPage />
            },
            {
              path: 'service-funder',
              element: <ServiceFunderList />
            },
            {
              path: 'service-funder/new',
              element: <CreateServiceFunderPage />
            },
            {
              path: 'service-funder/:id',
              element: <ServiceFunderDetailPage />
            },
            {
              path: 'service-user/:id/funder',
              element: <ServiceUserFunder />
            },
            {
              path: 'service-user/:id/funder/:funderId',
              element: <ServiceUserFunderDetailPage />
            },
            {
              path: 'service-user/:id/funder/create',
              element: <CreateServiceUserFunderPage />
            },
            {
              path: 'planner',
              element: <PlannerPage />
            },
            {
              path: 'jobs',
              element: <JobPage />
            },
            {
              path: 'report',
              element: <ReportPage />
            },
            {
              path: 'profile',
              element: <ProfilePage />
            },
            {
              path: 'needs/:id',
              element: <NeedPage />
            },
            {
              path: 'important-people/:id',
              element: <ImportantPeoplePage />
            },
            {
              path: 'general-information/:id',
              element: <ServiceUserProfilePage />
            },
          
            {
              path: 'about-me/:id',
              element: <AboutMe />
            },
            {
              path: 'contingency-plan/:id',
              element: <ContingencyPlan />
            },
            {
              path: 'daily-logs',
              element: <DailyLogs />
            },
            {
              path: 'notice',
              element: <NoticeBoard />
            },
            {
              path: 'training',
              element: <TrainingPage />
            },
            {
              path: 'training/create',
              element: <CreateTraining />
            },
            {
              path: 'training/edit/:id',
              element: <EditTraining />
            },
            {
              path: 'schedule',
              element: <SchedulePage />
            },
            // {
            //   path: 'upcoming-schedule',
            //   element: <UpcomingSchedulePage />
            // },
            {
              path: 'today-schedule',
              element: <TodaysSchedulePage />
            },
            {
              path: 'payslip',
              element: <PayslipPage />
            },
            {
              path: 'request/document',
              element: <DocumentReportPage />
            },
            {
              path: 'request-documents',
              element: <AdminRequestDocumentPage />
            },
            {
              path: 'invoice',
              element: <InvoicePage />
            },
            {
              path: 'departments',
              element: <Department />
            },
            {
              path: 'designations',
              element: <Designation />
            },
            {
              path: 'designations/create',
              element: <AddDesignation />
            },
            {
              path: 'designations/edit/:id',
              element: <EditDesignation />
            },
            {
              path: 'email-setup',
              element: <EmailSetup />
            },

            {
              path: 'employee',
              element: <Employee />
            },
            {
              path: 'employee/:id',
              element: <EditEmployee />
            },
            {
              path: 'employee/:id/employee-rate',
              element: <EmployeeRate />
            },
            {
              path: 'holiday',
              element: <Holiday />
            },
            {
              path: 'leave-approval',
              element: <LeaveApprovalPage />
            },
            {
              path: 'my-staff',
              element: <MyStaff />
            },
            {
              path: 'devices',
              element: <DevicePage />
            },

            {
              path: 'shifts',
              element: <Shift />
            },
            {
              path: 'shift/create',
              element: <CreateShift />
            },
            {
              path: 'shift/edit/:id',
              element: <EditShift />
            },
            {
              path: 'vacancy',
              element: <Vacancy />
            },
            {
              path: 'create-vacancy',
              element: <CreateVacancy />
            },
            {
              path: 'edit-vacancy/:id',
              element: <EditVacancy />
            },
            {
              path: 'add-applicant/:id',
              element: <AddApplicant />
            },
            {
              path: 'view-applicants/:id',
              element: <ViewApplicant />
            },
            {
              path: 'view-applicant/:id',
              element: <ApplicantDetailPage />
            },
            {
              path: 'recruit-applicant/:id',
              element: <RecruitApplicantForm />
            },
            {
              path: 'attendance',
              element: <Attendance />
            },
            {
              path: 'attendance/attendance-list',
              element: <AttendanceList />
            },
            {
              path: 'attendance/attendance-entry',
              element: <EntryAttendance />
            },
            {
              path: 'attendance-approve',
              element: <AttendanceApprovalPage />
            },
            {
              path: 'attendance-approve/attendance-list',
              element: <AttendanceApproveList />
            },
            {
              path: 'attendance-report',
              element: <AttendanceReport />
            },
            {
              path: 'staff-attendance',
              element: <StaffAttendancePage />
            },
            {
              path: 'company-details',
              element: <CompanyDetails />
            },
            {
              path: 'email-setup',
              element: <EmailSetup />
            },
            {
              path: 'charts/general-charts',
              element: <GeneralCharts />
            },
            {
              path: 'charts/general-charts/:id',
              element: <ChartDetailPage />
            },
            {
              path: 'charts/risk-assessment-scores',
              element: <RiskAssessmentScorePage />
            },
            {
              path: 'documents/:id',
              element: <DocumentPage />
            },
            {
              path: 'support-plans',
              element: <SupportPlanPage />
            },
            {
              path: 'support-plans/:id',
              element: <SupportPlanDetailPage />
            },
            {
              path: 'initial-assessment',
              element: <InitialAssessmentPage />
            },
            {
              path: 'initial-assessment/:id',
              element: <InitialAssessmentDetailPage />
            },
            {
              path: 'risk-assessments',
              element: <RiskAssessmentPage />
            },
            {
              path: 'risk-assessments/create',
              element: <CreateRiskAssessmentPage />
            },
            {
              path: 'risk-assessments/:id',
              element: <RiskAssessmentDetailPage />
            },
            {
              path: 'mar-chart',
              element: <MarChartPage />
            },
            {
              path: 'mar-chart/add-medication',
              element: <AddMedicationPage />
            },
            {
              path: 'stock',
              element: <StockPage />
            },
            {
              path: 'stock/:id',
              element: <StockDetailPage />
            },
            {
              path: 'consents/:id',
              element: <ConsentPage />
            },
            {
              path: 'consents/:id/add-capacity-form',
              element: <AddCapacityFormPage />
            },
            {
              path: 'consents/:id/capacity-form/:capacityId',
              element: <EditCapacityFormPage />
            },
            {
              path: 'consents/:id/add-consent-form',
              element: <AddConsentFormPage />
            },
             {
              path: 'consents/:id/consent-form/:consentId',
              element: <EditConsentFormPage />
            },
            {
              path: 'holiday',
              element: <Holiday />
            },
            {
              path: 'bank-holiday',
              element: <BankHolidayPage />
            },
            {
              path: 'pending-employee',
              element: <PendingHiring />
            }
          ]
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/signup',
      element: <SignUpPage />,
      index: true
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
      index: true
    },
    {
      path: '/otp',
      element: <Otp />,
      index: true
    },

    {
      path: '/new-password',
      element: <NewPassword />,
      index: true
    },
    {
      path: '/404',
      element: <ErrorPage />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...publicRoutes, ...adminRoutes]);

  return routes;
}
