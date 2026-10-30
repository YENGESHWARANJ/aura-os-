import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import NotificationBell from "../components/dashboard/NotificationBell";
import ThemeToggle from "../components/common/ThemeToggle";
import {
  Search,
  Sparkles,
  ChevronDown,
  Shield,
  Menu,
  X,
  Home,
  LayoutGrid,
  Calendar,
  MessageSquare,
  Bot,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutSuccess } from "../redux/slices/authSlice";

export default function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("aura_sidebar_open");
    // Default to false so full dashboard is shown initially unless user touched/opened it
    return saved === "true";
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const portalTitle =
    user?.role === "mentor"
      ? "Mentor Portal"
      : user?.role === "faculty"
      ? "Faculty Portal"
      : user?.role === "parent"
      ? "Parent Portal"
      : user?.role === "admin"
      ? "Admin Portal"
      : "Student Hub";

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsDesktopSidebarOpen((prev) => {
        const nextState = !prev;
        localStorage.setItem("aura_sidebar_open", String(nextState));
        return nextState;
      });
    }
  };

  return (
    <div className="dashboard-layout h-screen flex flex-col lg:flex-row bg-[var(--aura-bg)] text-[var(--aura-text)] overflow-hidden">
      {/* Desktop Sidebar (270px Collapsible) */}
      <div
        className={`sidebar hidden lg:block bg-[var(--aura-sidebar-bg)] transition-all duration-300 ease-in-out ${
          isDesktopSidebarOpen
            ? "w-[270px] min-w-[270px] border-r border-[var(--aura-border)] opacity-100"
            : "!w-0 !min-w-0 !border-r-0 opacity-0 overflow-hidden pointer-events-none"
        }`}
      >
        <div className="w-[270px] h-full">
          <DashboardSidebar
            onClose={() => {
              setIsDesktopSidebarOpen(false);
              localStorage.setItem("aura_sidebar_open", "false");
            }}
          />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-[var(--aura-surface)] shadow-2xl border-r border-[var(--aura-border)] z-50 flex flex-col">
            <DashboardSidebar
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Container */}
      <div className="dashboard-main flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 sm:h-[70px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 bg-[var(--aura-header-bg)] backdrop-blur-xl border-b border-[var(--aura-border)] shadow-xs flex-shrink-0">
          <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-2 sm:gap-4">
            {/* Left Controls: 3-line Hamburger Menu Button & Portal Brand */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={toggleSidebar}
                aria-label="Toggle Navigation Menu"
                title={isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                className={`h-9 w-9 rounded-xl border flex items-center justify-center transition cursor-pointer shadow-xs ${
                  isDesktopSidebarOpen
                    ? "bg-[#c8f000]/15 border-[#c8f000]/40 text-[#c8f000]"
                    : "bg-[var(--aura-surface-2)] border-[var(--aura-border)] text-[var(--aura-text-secondary)] hover:bg-[#c8f000]/10 hover:border-[#c8f000]/30 hover:text-[#c8f000]"
                }`}
              >
                <Menu className="h-4.5 w-4.5" />
              </button>

              <div className="flex items-center gap-2 rounded-xl bg-[#c8f000]/10 border border-[#c8f000]/30 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#5a6e00] dark:text-[#c8f000] shrink-0">
                <Shield className="h-3.5 w-3.5 text-[#5a6e00] dark:text-[#c8f000]" />
                <span className="hidden sm:inline">AURA OS</span>
                <span className="text-[11px] text-[var(--aura-text-muted)] font-semibold border-l border-[#c8f000]/30 pl-2 hidden md:inline">
                  {portalTitle}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-xl min-w-0">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--aura-text-muted)] pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search courses, skills, student records..."
                  style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                  className="w-full h-10 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] py-1.5 text-xs text-[var(--aura-text)] placeholder:text-[var(--aura-text-muted)] outline-none transition focus:border-[#c8f000] focus:ring-2 focus:ring-[#c8f000]/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[var(--aura-text-muted)] bg-[var(--aura-surface)] border border-[var(--aura-border)] rounded-md">
                    Ctrl /
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* AI Assistant Launcher */}
              <Link
                to="/dashboard/ai"
                className="inline-flex items-center gap-1.5 h-9 rounded-xl border border-[#c8f000]/30 bg-[#c8f000]/10 px-3 text-xs font-bold text-[#5a6e00] dark:text-[#c8f000] hover:bg-[#c8f000] hover:text-[#0d1a00] transition shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#5a6e00] dark:text-[#c8f000]" />
                <span className="hidden sm:inline">AI Tutor</span>
              </Link>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Notification Bell */}
              <NotificationBell />

              {/* Profile Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 h-9 pl-1 pr-2 rounded-full border border-[var(--aura-border)] bg-[var(--aura-surface)] hover:bg-[var(--aura-surface-2)] transition"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#c8f000] to-[#84cc16] flex items-center justify-center font-bold text-[#0d1a00] text-xs shrink-0 shadow-sm">
                    {userInitial}
                  </div>
                  <ChevronDown className="h-3 w-3 text-[var(--aura-text-muted)] hidden sm:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[var(--aura-surface)] border border-[var(--aura-border)] shadow-2xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-[var(--aura-border)]">
                      <p className="text-xs font-bold text-[var(--aura-text)] truncate">{user?.name || "User"}</p>
                      <p className="text-[10px] text-[var(--aura-text-muted)] capitalize">{user?.role || "student"}</p>
                    </div>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] transition"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] transition"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="dashboard-content flex-1 pb-24 lg:pb-12">
          <div className="page-container min-h-full">{children}</div>
        </main>

        {/* Mobile Bottom Dock (ONLY on screens < 1024px) */}
        <div className="lg:hidden aura-bottom-dock">
          <Link
            to="/dashboard"
            className={`dock-tab-btn ${
              isActivePath("/dashboard") ? "active text-[#c8f000] font-bold" : ""
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link
            to="/dashboard/academics"
            className={`dock-tab-btn ${
              isActivePath("/dashboard/academics") ? "active text-indigo-500 font-bold" : ""
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Academics</span>
          </Link>

          {/* Center FAB */}
          <Link
            to="/dashboard/ai"
            className="aura-fab -translate-y-4"
            aria-label="AI Assistant"
          >
            <Bot className="h-6 w-6 text-white text-white-force" />
          </Link>

          <Link
            to="/dashboard/study-planner"
            className={`dock-tab-btn ${
              isActivePath("/dashboard/study-planner") ? "active text-indigo-500 font-bold" : ""
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Planner</span>
          </Link>

          <Link
            to="/dashboard/notifications"
            className={`dock-tab-btn ${
              isActivePath("/dashboard/notifications") ? "active text-indigo-500 font-bold" : ""
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Alerts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
