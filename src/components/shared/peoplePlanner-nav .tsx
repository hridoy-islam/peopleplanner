

import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Menu,
  X,
  UserCog2,
  LucideUserPlus,
  UserSquare2Icon,
  LucideUserSquare2,
  Calendar,
  BriefcaseIcon,
  File,
  User,
  Newspaper,
  Layers,
  Clock,
  FileBadge,
  FolderPlus,
  Wallet,
  User2,
  UsersIcon,
  Users,
  LayoutPanelTop,
  ArrowBigUp,
  Award,
  BookText,
  BetweenVerticalStart,
  CircleCheckBig,
  FileCheck2,
  Settings,
  ReceiptText,
  Mails,
  UserCircle,
  DoorOpen,
  UserCircleIcon,
  AlarmClock,
  SquareUserRound,
  BookUser,
  NotebookTabs,
  Smartphone,
  AlignEndHorizontal,
  SquareKanban,
  ShieldAlert,
  FileText,
  FileBox,
  SquareAsterisk,
  FileMinus,
  AlignCenterHorizontal,
  FileArchive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '@/redux/features/authSlice';

// === Define Navigation Items with Role-Based Access ===
const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin/people-planner',
    roles: ['admin', 'serviceUser']
  },
  {
    icon: Calendar,
    label: 'Planner',
    href: 'planner',
    roles: ['admin']
  },
  {
    icon: Newspaper,
    label: 'Notice',
    href: 'notice',
    roles: ['admin']
  },
  {
    icon: Clock,
    label: 'Schedule',
    href: 'schedule',
    roles: ['admin']
  },
  {
    icon: FileBadge,
    label: 'Payslip',
    href: 'payslip',
    roles: ['admin']
  },
  {
    icon: Wallet,
    label: 'Invoice',
    href: 'invoice',
    roles: ['admin']
  },
  {
    icon: UsersIcon,
    label: 'HR',
    roles: ['admin'],
    subItems: [
      {
        icon: User2,
        label: 'My Stuff',
        href: 'my-stuff',
        roles: ['admin']
      },
      {
        icon: UserCircle,
        label: 'Vacancy',
        href: 'vacancy',
        roles: ['admin']
      },
      {
        icon: UsersIcon,
        label: 'Employee',
        roles: ['admin'],
        subItems: [
          {
            icon: Users,
            label: 'Employee List',
            href: 'employee',
            roles: ['admin']
          },
          {
            icon: LayoutPanelTop,
            label: 'Department',
            href: 'departments',
            roles: ['admin']
          },
          {
            icon: ArrowBigUp,
            label: 'Shift',
            href: 'shifts',
            roles: ['admin']
          },
          {
            icon: Award,
            label: 'Designation',
            href: 'designations',
            roles: ['admin']
          },
          {
            icon: BookText,
            label: 'Training',
            href: 'training',
            roles: ['admin']
          }
        ]
      },
      {
        icon: FileCheck2,
        label: 'Attendance',
        roles: ['admin'],
        subItems: [
          {
            icon: FileCheck2,
            label: 'Attendance List',
            href: 'attendance',
            roles: ['admin']
          },
          {
            icon: CircleCheckBig,
            label: 'Attendance Approve',
            href: 'attendance-approve',
            roles: ['admin']
          },
          {
            icon: BetweenVerticalStart,
            label: 'Attendance Entry',
            href: 'attendance/attendance-entry',
            roles: ['admin']
          },
          {
            icon: Calendar,
            label: 'Attendance Report',
            href: 'attendance-report',
            roles: ['admin']
          }
        ]
      },
      {
        icon: LucideUserPlus,
        label: 'Document Requests',
        href: 'request/document',
        roles: ['admin']
      },
      {
        icon: Smartphone ,
        label: 'Devices',
        href: 'devices',
        roles: ['admin']
      },
    ]
  },
  {
    icon: UserCog2,
    label: 'Service User',
    roles: ['admin'],
    subItems: [
      {
        icon: LucideUserPlus,
        label: 'New User',
        href: 'service-user/new',
        roles: ['admin']
      },
      {
        icon: UserSquare2Icon,
        label: 'Service user List',
        href: 'service-user',
        roles: ['admin']
      }
    ]
  },
  {
    icon: File,
    label: 'Report',
    href: 'report',
    roles: ['admin']
  },

  {
    icon: LucideUserSquare2,
    label: 'Service Funder',
    roles: ['admin'],
    subItems: [
      {
        icon: LucideUserPlus,
        label: 'New Funder',
        href: 'service-funder/new',
        roles: ['admin']
      },
      {
        icon: UserSquare2Icon,
        label: 'Service Funder List',
        href: 'service-funder',
        roles: ['admin']
      }
    ]
  },
  {
    icon: User,
    label: 'Profile',
    href: 'profile',
    roles: ['serviceUser'],
    subItems: [
      {
        icon: UserCircleIcon,
        label: 'General Information',
        href: 'profile',
        roles: ['serviceUser']
      },
      {
        icon: AlarmClock,
        label: 'Needs',
        href: 'needs',
        roles: ['serviceUser']
      },
      {
        icon: SquareUserRound,
        label: 'Important People',
        href: 'important-people',
        roles: ['serviceUser']
      },
      {
        icon: BookUser,
        label: 'About Me',
        href: 'about-me',
        roles: ['serviceUser']
      },
      {
        icon: NotebookTabs,
        label: 'Contingency Plans',
        href: 'contingency-plan',
        roles: ['serviceUser']
      }
    ]
  },
  {
    icon: Clock,
    label: 'Daily Logs',
    href: 'daily-logs',
    roles: ['serviceUser']
  },
  {
    icon: AlignEndHorizontal   ,
    label: 'Charts',
    roles: ['serviceUser'],
    subItems: [
      {
        icon: SquareKanban ,
        label: 'General Charts',
        href: 'charts/general-charts',
        roles: ['serviceUser']
      },
      {
        icon: ShieldAlert ,
        label: 'Risk Assessment Score',
        href: 'charts/risk-assessment-scores',
        roles: ['serviceUser']
      }
    ]
  },
  {
    icon: File,
    label: 'Documents',
    href: 'documents',
    roles: ['serviceUser']
  },

  {
    icon: FileText ,
    label: 'Care Planning',
    roles: ['serviceUser'],
    subItems: [
      {
        icon: UserCircleIcon,
        label: 'Support Plans',
        href: 'support-plans',
        roles: ['serviceUser']
      },
      {
        icon: FileBox  ,
        label: 'Initial Assessments',
        href: 'initial-assessment',
        roles: ['serviceUser']
      },
      {
        icon: SquareAsterisk ,
        label: 'Risk Assessments',
        href: 'risk-assessments',
        roles: ['serviceUser']
      }
    ]
  },
  {
    icon: User,
    label: 'Medication',
    roles: ['serviceUser'],
    subItems: [
      {
        icon: FileMinus ,
        label: 'MAR Chart',
        href: 'mar-chart',
        roles: ['serviceUser']
      },
      {
        icon: AlignCenterHorizontal ,
        label: 'Stock',
        href: 'stock',
        roles: ['serviceUser']
      }
    ]
  },
  {
    icon: FileArchive ,
    label: 'Consents',
    href: 'consents',
    roles: ['serviceUser']
  },

  {
    icon: Settings,
    label: 'Settings',
    href: 'settings',
    roles: ['admin', 'serviceUser'],
    subItems: [
      {
        icon: ReceiptText,
        label: 'Company Details',
        href: 'company-details',
        roles: ['admin']
      },
      {
        icon: Mails,
        label: 'Email Setup',
        href: 'email-setup',
        roles: ['admin']
      }
    ]
  }
];

// === Recursive Filter Function Based on User Role ===
const filterNavItemsByRole = (items, userRole) => {
  return (
    items
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => {
        if (item.subItems) {
          return {
            ...item,
            subItems: filterNavItemsByRole(item.subItems, userRole)
          };
        }
        return item;
      })
      // Remove parent items that have no visible subItems left
      .filter((item) => {
        if (item.subItems && item.subItems.length === 0) {
          return false;
        }
        return true;
      })
  );
};

// === NavItem Component (Unchanged, but supports filtered items) ===
const NavItem = ({ item, expandedItems, toggleExpanded, depth = 0 }) => {
  const location = useLocation();

  // Check if current path matches this leaf node
  const isActiveLeaf =
    !item.subItems && location.pathname.startsWith('/' + item.href);

  // Handle expanded state for dropdowns
  const isExpanded = expandedItems[item.label];

  if (item.subItems) {
    return (
      <div className="space-y-1" key={item.label}>
        <button
          onClick={() => toggleExpanded(item.label)}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-supperagent hover:text-white',
            depth > 0 && 'pl-6'
          )}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="h-4 w-4 text-supperagent group-hover:text-white" />
            <span className="text-black group-hover:text-white">
              {item.label}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-supperagent group-hover:text-white" />
          ) : (
            <ChevronRight className="h-4 w-4 text-supperagent group-hover:text-white" />
          )}
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="ml-4 space-y-1 border-l-2 border-gray-300">
            {item.subItems.map((subItem) => (
              <NavItem
                key={subItem.label}
                item={subItem}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        'group flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-supperagent hover:text-white',
        isActiveLeaf && 'bg-blue-50 text-supperagent shadow-sm',
        depth > 0 && 'pl-6'
      )}
    >
      <item.icon className="h-4 w-4 text-supperagent group-hover:text-white" />
      <span className="text-black group-hover:text-white">{item.label}</span>
    </Link>
  );
};

// === Main Component: PeoplePlannerSideNav ===
export function PeoplePlannerSideNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.auth?.user) || null;
  const userRole = user?.role || 'admin'; // Default to admin if no role

  const [expandedItems, setExpandedItems] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logout handler
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Auto-expand parents based on current route
  useEffect(() => {
    const expandParents = (items) => {
      for (let item of items) {
        if (item.subItems) {
          if (
            item.subItems.some(
              (subItem) =>
                location.pathname.includes(subItem.href) ||
                (subItem.subItems &&
                  subItem.subItems.some((s) =>
                    location.pathname.includes(s.href)
                  ))
            )
          ) {
            setExpandedItems((prev) => ({ ...prev, [item.label]: true }));
            expandParents(item.subItems);
          }
        }
      }
    };
    expandParents(navItems);
  }, [location.pathname]);

  // Toggle expanded state for accordion menus
  const toggleExpanded = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Filter navigation items based on user role
  const filteredNavItems = filterNavItemsByRole(navItems, userRole);

  // Sidebar content (used in both mobile and desktop)
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 ">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-supperagent">
            <span className="text-sm font-bold text-white">PP</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-gray-900">
              People Planner
            </h1>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredNavItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
        >
          <DoorOpen className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Mobile & Desktop) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm transition-transform duration-300 lg:translate-x-0',
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar (visible only on large screens) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-sm">
        {sidebarContent}
      </aside>
    </>
  );
}
