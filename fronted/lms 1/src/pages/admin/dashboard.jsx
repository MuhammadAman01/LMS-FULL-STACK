
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  GraduationCap,
  BookOpen,
  Library,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalTeachers: 0,
    totalStudent: 0,
    totalCourses: 0,
    totalSubject: 0,
  });

  const [loading, setLoading] = useState(true);

  const getDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");

      setDashboard({
        totalTeachers: response.data.totalTeachers,
        totalStudent: response.data.totalStudent,
        totalCourses: response.data.totalCourses,
        totalSubject: response.data.totalSubj,
      });
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center sm:min-h-[400px]">
        <p className="text-sm text-slate-500 sm:text-base">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Teachers",
      value: dashboard.totalTeachers,
      description: "Registered teachers",
      icon: Users,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Students",
      value: dashboard.totalStudent,
      description: "Registered students",
      icon: GraduationCap,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Courses",
      value: dashboard.totalCourses,
      description: "Available courses",
      icon: BookOpen,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Subjects",
      value: dashboard.totalSubject,
      description: "Available subjects",
      icon: Library,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 sm:space-y-7 lg:space-y-8">

      {/* Page heading */}
      <section className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
          Admin Panel
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Manage and monitor your Learning Management System.
        </p>
      </section>

      {/* Responsive statistics */}
      <section
        aria-label="LMS statistics"
        className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 xl:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:p-5 lg:p-6"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-xs font-medium text-slate-500 sm:text-sm">
                    {card.title}
                  </p>

                  <h2 className="mt-2 break-words text-3xl font-bold tabular-nums text-slate-900 sm:mt-3 sm:text-4xl">
                    {card.value ?? 0}
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`shrink-0 rounded-xl p-2.5 sm:rounded-2xl sm:p-3 ${card.iconBg} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={22}
                    className={card.iconColor}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Overview */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 sm:p-3">
            <TrendingUp
              size={22}
              className="text-violet-600 sm:h-6 sm:w-6"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              LMS Overview
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-slate-500">
              Manage teachers, students, courses and subjects from
              your admin panel.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Dashboard;

