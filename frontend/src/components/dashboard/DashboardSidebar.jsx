import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../redux/slices/authSlice";
import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  FileText,
  FolderGit2,
  Award,
  Calendar,
  BarChart3,
  Bot,
  Bell,
  User,
  Settings,
  GraduationCap,
  Users,
  AlertTriangle,
  Video,
  FileCode,
  Target,
  Sparkles,
  PieChart,
  LogOut,
  MessageSquare,
  X,
  Shield,
} from "lucide-react";

// Standard Student Navigation Items
const studentNavItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Academics", to: "/dashboard/academics", icon: BookOpen },
  { label: "Attendance", to: "/dashboard/attendance", icon: UserCheck },
  { label: "Assignments", to: "/dashboard/assignments", icon: FileText },
  { label: "Projects", to: "/dashboard/projects", icon: FolderGit2 },
  { label: "Skills", to: "/dashboard/skills", icon: Award },
  { label: "Study Planner", to: "/dashboard/study-planner", icon: Calendar },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "AI Assistant", to: "/dashboard/ai", icon: Bot },
  { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
  { label: "Profile", to: "/dashboard/profile", icon: User },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

// Dedicated Mentor Navigation Structure
const mentorNavGroups = [
  {
    category: "MAIN",
    items: [
      { label: "Dashboard", to: "/mentor/dashboard", icon: LayoutDashboard },
      { label: "My Students", to: "/mentor/assigned-students", icon: Users },
      { label: "At-Risk Students", to: "/mentor/risk-students", icon: AlertTriangle },
    ],
  },
  {
    category: "MENTORING",
    items: [
      { label: "Meetings", to: "/mentor/meetings", icon: Video },
      { label: "Notes", to: "/mentor/notes", icon: FileCode },
      { label: "Goals", to: "/mentor/goals", icon: Target },
      { label: "Recommendations", to: "/mentor/recommendations", icon: Sparkles },
    ],
  },
  {
    category: "ANALYTICS",
    items: [
      { label: "Performance & Reports", to: "/mentor/reports", icon: PieChart },
    ],
  },
  {
    category: "COMMUNICATION",
    items: [
      { label: "Notifications", to: "/mentor/notifications", icon: Bell },
    ],
  },
  {
    category: "ACCOUNT",
    items: [
      { label: "Profile", to: "/dashboard/profile", icon: User },
      { label: "Settings", to: "/dashboard/settings", icon: Settings },
    ],
  },
];

// Dedicated Faculty Navigation Structure
const facultyNavGroups = [
  {
    category: "MAIN",
    items: [
      { label: "Dashboard", to: "/faculty/dashboard", icon: LayoutDashboard },
      { label: "My Classes", to: "/faculty/classes", icon: Calendar },
      { label: "Students", to: "/faculty/students", icon: Users },
      { label: "Attendance", to: "/faculty/attendance", icon: UserCheck },
    ],
  },
  {
    category: "ACADEMICS",
    items: [
      { label: "Assignments", to: "/faculty/assignments", icon: FileText },
      { label: "Assessments", to: "/faculty/assessments", icon: Award },
      { label: "Marks & Grades", to: "/faculty/marks", icon: PieChart },
      { label: "Course Materials", to: "/faculty/materials", icon: FolderGit2 },
    ],
  },
  {
    category: "STUDENT MANAGEMENT",
    items: [
      { label: "At-Risk Students", to: "/faculty/risk-students", icon: AlertTriangle },
      { label: "Student Feedback", to: "/faculty/feedback", icon: MessageSquare },
    ],
  },
  {
    category: "ANALYTICS & REPORTS",
    items: [
      { label: "Faculty Analytics", to: "/faculty/analytics", icon: BarChart3 },
      { label: "Reports", to: "/faculty/reports", icon: PieChart },
    ],
  },
  {
    category: "COMMUNICATION",
    items: [
      { label: "Messages", to: "/faculty/messages", icon: MessageSquare },
      { label: "Notifications", to: "/faculty/notifications", icon: Bell },
    ],
  },
  {
    category: "ACCOUNT",
    items: [
      { label: "Profile", to: "/dashboard/profile", icon: User },
      { label: "Settings", to: "/dashboard/settings", icon: Settings },
    ],
  },
];

// Parent Navigation Items
const parentNavItems = [
  { label: "Parent Dashboard", to: "/parent/dashboard", icon: LayoutDashboard },
  { label: "Child Attendance", to: "/parent/attendance", icon: UserCheck },
  { label: "Parent Alerts", to: "/parent/notifications", icon: Bell },
  { label: "AI Advisory", to: "/dashboard/ai", icon: Bot },
  { label: "Profile", to: "/dashboard/profile", icon: User },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({ onClose, isMobile = false }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role || "student";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const userName = user?.name || "Student User";
  const userRole = user?.role || "Student";

  const handleLogout = () => {
    dispatch(logoutSuccess());
    if (onClose) onClose();
    navigate("/login", { replace: true });
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const containerClasses = isMobile
    ? "w-full h-full bg-[var(--aura-sidebar-bg)] text-[var(--aura-text)] flex flex-col justify-between select-none p-5 overflow-y-auto"
    : "w-[270px] min-w-[270px] shrink-0 bg-[var(--aura-sidebar-bg)] text-[var(--aura-text)] flex flex-col justify-between hidden lg:flex sticky top-0 h-screen z-40 select-none p-5";

  // Faculty Sidebar
  if (role === "faculty") {
    return (
      <aside className={containerClasses}>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="mb-5 px-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-500">
                  AURA OS
                </p>
                <h2 className="text-sm font-extrabold tracking-tight text-[var(--aura-text)]">
                  Faculty Portal
                </h2>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg bg-[var(--aura-surface-2)] border border-[var(--aura-border)] flex items-center justify-center text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {facultyNavGroups.map((group) => (
              <div key={group.category}>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--aura-text-muted)] mb-1.5">
                  {group.category}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 h-10 rounded-xl px-3 font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20 text-white-force"
                            : "text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] hover:text-[var(--aura-text)]"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-white text-white-force" : "text-[var(--aura-text-muted)]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--aura-border)] shrink-0 mt-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--aura-surface-2)] border border-[var(--aura-border)] p-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm text-white-force">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--aura-text)] truncate">{userName}</p>
              <p className="text-[10px] text-cyan-500 font-semibold capitalize truncate">{userRole}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-500 transition hover:bg-rose-500/20 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }

  // Mentor Sidebar
  if (role === "mentor") {
    return (
      <aside className={containerClasses}>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="mb-5 px-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-purple-500">
                  AURA OS
                </p>
                <h2 className="text-sm font-extrabold tracking-tight text-[var(--aura-text)]">
                  Mentor Portal
                </h2>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg bg-[var(--aura-surface-2)] border border-[var(--aura-border)] flex items-center justify-center text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {mentorNavGroups.map((group) => (
              <div key={group.category}>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--aura-text-muted)] mb-1.5">
                  {group.category}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 h-10 rounded-xl px-3 font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 text-white-force"
                            : "text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] hover:text-[var(--aura-text)]"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-white text-white-force" : "text-[var(--aura-text-muted)]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--aura-border)] shrink-0 mt-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--aura-surface-2)] border border-[var(--aura-border)] p-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm text-white-force">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--aura-text)] truncate">{userName}</p>
              <p className="text-[10px] text-purple-500 font-semibold capitalize truncate">{userRole}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-500 transition hover:bg-rose-500/20 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }

  // Parent Sidebar
  if (role === "parent") {
    return (
      <aside className={containerClasses}>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="mb-5 px-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                  AURA OS
                </p>
                <h2 className="text-sm font-extrabold tracking-tight text-[var(--aura-text)]">
                  Parent Portal
                </h2>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg bg-[var(--aura-surface-2)] border border-[var(--aura-border)] flex items-center justify-center text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1 overflow-y-auto pr-1 text-xs">
            {parentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 h-10 rounded-xl px-3 font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 text-white-force"
                      : "text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] hover:text-[var(--aura-text)]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white text-white-force" : "text-[var(--aura-text-muted)]"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--aura-border)] shrink-0 mt-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--aura-surface-2)] border border-[var(--aura-border)] p-2.5">
            <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-white text-xs shrink-0 text-white-force">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--aura-text)] truncate">{userName}</p>
              <p className="text-[10px] text-amber-500 font-semibold capitalize truncate">{userRole}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-500 transition hover:bg-rose-500/20 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }

  // Standard Student / Default Sidebar
  return (
    <aside className={containerClasses}>
      <div>
        <div className="mb-6 px-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shadow-xs">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
                AURA OS
              </p>
              <h2 className="text-sm font-extrabold tracking-tight text-[var(--aura-text)]">
                Academic Hub
              </h2>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-[var(--aura-surface-2)] border border-[var(--aura-border)] flex items-center justify-center text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 text-xs">
          {studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 h-10 rounded-xl px-3 font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 text-white-force"
                    : "text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] hover:text-[var(--aura-text)]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-white text-white-force" : "text-[var(--aura-text-muted)]"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--aura-border)] mt-4">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--aura-surface-2)] border border-[var(--aura-border)] p-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm text-white-force">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[var(--aura-text)] truncate">{userName}</p>
            <p className="text-[10px] text-indigo-500 font-semibold capitalize truncate">{userRole}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-500 transition hover:bg-rose-500/20 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
