
import { useEffect, useState } from "react";
import {
  BookOpen,
  BookMarked,
  ClipboardList,
  FileCheck,
  Clock,
  RefreshCw,
  GraduationCap,
  ArrowUpRight
} from "lucide-react";
import api from "../../services/api";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDashboard = async () => {
    try {
      setError("");
      const response = await api.get("/student/dashboard");
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.log("Dashboard Error:", error);
      setError("Unable to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const stats = [
    {
      title: "Total Courses",
      value: dashboard?.totalCourses ?? 0,
      icon: BookOpen,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      description: "Your enrolled courses"
    },
    {
      title: "Total Subjects",
      value: dashboard?.totalSubjects ?? 0,
      icon: BookMarked,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Subjects to study"
    },
    {
      title: "Total Assignments",
      value: dashboard?.totalAssignments ?? 0,
      icon: ClipboardList,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      description: "All assigned work"
    },
    {
      title: "Total Submissions",
      value: dashboard?.totalSubmissions ?? 0,
      icon: FileCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      description: "Assignments submitted"
    },
    {
      title: "Pending Assignments",
      value: dashboard?.pendingAssignments ?? 0,
      icon: Clock,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      description: "Work awaiting submission"
    }
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <RefreshCw size={23} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Dashboard unavailable
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={getDashboard}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              STUDENT PORTAL
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Student Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Keep track of your courses, assignments and academic progress.
            </p>
          </div>

          <button
            onClick={getDashboard}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
                <GraduationCap size={27} />
              </div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Welcome to your learning space
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                Review your academic activity and stay on top of your pending work.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:min-w-44">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <ArrowUpRight size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Pending work</p>
                <p className="mt-1 text-2xl font-bold">
                  {dashboard?.pendingAssignments ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Academic Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick summary of your learning activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                      <Icon size={23} />
                    </div>
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                      Overview
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

