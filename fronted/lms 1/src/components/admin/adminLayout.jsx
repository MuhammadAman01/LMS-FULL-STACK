
import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Library,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import api from "../../services/api";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = async () => {
    try {
      await api.post("/admin/logout");
      navigate("/");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: Users,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: GraduationCap,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Subjects",
      path: "/admin/subjects",
      icon: Library,
    },
  ];

  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.name ||
    "Admin Panel";

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-slate-950 px-5 py-6 text-white transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-9 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
              <ShieldCheck size={25} className="text-violet-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">LMS</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

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

        {/* Admin info */}
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
              <ShieldCheck size={20} className="text-violet-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Administrator</p>
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

      {/* Main area */}
      <div className="min-h-screen min-w-0 md:ml-72">
        {/* Responsive header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
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
                {currentPage}
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Learning Management System
              </p>
            </div>
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-violet-50 px-3 py-2">
            <ShieldCheck size={17} className="text-violet-600" />
            <span className="hidden text-sm font-medium text-violet-700 sm:inline">
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

