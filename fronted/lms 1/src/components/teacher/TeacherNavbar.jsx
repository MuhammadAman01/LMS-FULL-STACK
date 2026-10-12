
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  BookOpen,
  Users,
  ClipboardList,
  FileCheck,
  CalendarCheck,
  History,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import api from "../../services/api";

function TeacherNavbar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/teacher/profile", icon: UserRound },
    { name: "Courses", path: "/teacher/courses", icon: BookOpen },
    { name: "Students", path: "/teacher/students", icon: Users },
    { name: "Assignments", path: "/teacher/assignments", icon: ClipboardList },
    { name: "Submissions", path: "/teacher/submissions", icon: FileCheck },
    { name: "Attendance", path: "/teacher/attendence", icon: CalendarCheck },
    {
      name: "Attendance Records",
      path: "/teacher/attendance-records",
      icon: History,
    },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const logout = async () => {
    try {
      await api.post("/teacher/logout");
      closeSidebar();
      navigate("/teacher/login");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <div>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar - Same design as Admin */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-slate-950 px-5 py-6 text-white transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-9 flex items-center justify-between">
          <Link
            to="/teacher/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
              <GraduationCap size={25} className="text-violet-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">LMS</h1>
              <p className="text-xs text-slate-400">Teacher Panel</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-violet-600 font-semibold text-white shadow-md shadow-violet-950/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Teacher Info */}
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
              <GraduationCap size={20} className="text-violet-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Teacher</p>
              <p className="text-xs text-slate-400">Manage your LMS</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Header */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 md:left-72 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              {navItems.find(
                (item) => item.path === window.location.pathname
              )?.name || "Teacher Panel"}
            </h2>
            <p className="hidden text-xs text-slate-500 sm:block">
              Learning Management System
            </p>
          </div>
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-violet-50 px-3 py-2">
          <GraduationCap size={17} className="text-violet-600" />
          <span className="hidden text-sm font-medium text-violet-700 sm:inline">
            Teacher
          </span>
        </div>
      </header>
    </div>
  );
}

export default TeacherNavbar;

