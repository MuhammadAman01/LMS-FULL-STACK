
import { useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  BookOpen,
  GraduationCap,
  ClipboardList,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  School,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "../../services/api";

function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const navItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      path: "/student/profile",
      icon: UserRound,
    },
    {
      name: "My Courses",
      path: "/student/courses",
      icon: BookOpen,
    },
    {
      name: "My Subjects",
      path: "/student/subjects",
      icon: GraduationCap,
    },
    {
      name: "Assignments",
      path: "/student/assignments",
      icon: ClipboardList,
    },
    {
      name: "Attendance",
      path: "/student/attendance",
      icon: CalendarCheck,
    },
  ];

  const activePage =
    navItems.find((item) => location.pathname === item.path)?.name ||
    "Student Portal";

  const logout = async () => {
    try {
      setLoggingOut(true);
      setLogoutError("");

      await api.post("/student/logout");
      setMenuOpen(false);
      navigate("/student/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
      setLogoutError(
        error.response?.data?.msg || "Logout failed. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-950/30">
          <School size={24} />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-wide text-white">
            Student Portal
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            University LMS
          </p>
        </div>
      </div>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Main Menu
        </p>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-950/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon size={19} />
                      {item.name}
                    </span>
                    {isActive && <ChevronRight size={17} />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-5 pt-6">
        {logoutError && (
          <div className="mb-3 flex gap-2 rounded-xl border border-red-900 bg-red-950/50 p-3 text-xs text-red-200">
            <AlertCircle size={16} className="shrink-0" />
            <p>{logoutError}</p>
          </div>
        )}

        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
              <GraduationCap size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Student Account
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Learning Portal
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
            <School size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-900">
              Student Portal
            </h1>
            <p className="truncate text-xs text-slate-500">{activePage}</p>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate-950 md:flex">
        <SidebarContent />
      </aside>

      {menuOpen && (
        <button
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-slate-950 transition-transform duration-200 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-end px-4 pt-3">
          <button
            onClick={closeMenu}
            aria-label="Close navigation menu"
            tabIndex={menuOpen ? 0 : -1}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}

export default StudentNavbar;

