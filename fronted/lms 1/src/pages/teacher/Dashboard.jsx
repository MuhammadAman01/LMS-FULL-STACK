
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BookOpen,
  Library,
  Users,
  ClipboardList,
  FileCheck,
  Clock3,
  RefreshCw,
} from "lucide-react";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(false);

  const getDashboard = async () => {
    try {
      setError(false);
      const response = await api.get("/teacher/dashboard");
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.log("Dashboard Error:", error);
      setError(true);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const stats = [
    {
      title: "Total Courses",
      value: dashboard?.totalCourses,
      icon: BookOpen,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Total Subjects",
      value: dashboard?.totalSubjects,
      icon: Library,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Students",
      value: dashboard?.totalStudents,
      icon: Users,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Assignments",
      value: dashboard?.totalAssignments,
      icon: ClipboardList,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Total Submissions",
      value: dashboard?.totalSubmissions,
      icon: FileCheck,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Pending Submissions",
      value: dashboard?.pendingSubmissions,
      icon: Clock3,
      color: "bg-rose-100 text-rose-600",
    },
  ];

  if (!dashboard && !error) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
        <p className="font-semibold text-slate-800">
          Unable to load dashboard
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={getDashboard}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-violet-600">
            Learning Management System
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Teacher Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Overview of your courses, students and assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={getDashboard}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-5 text-slate-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-3 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {stat.value ?? 0}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-400">
                  Your teaching overview
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;

