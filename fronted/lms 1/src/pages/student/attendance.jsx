
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  Users,
  Percent,
  RefreshCw,
  CalendarDays,
  ClipboardCheck,
  AlertCircle
} from "lucide-react";
import api from "../../services/api";

function Attendance() {
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      setError("");

      const [profileResponse, attendanceResponse] = await Promise.all([
        api.get("/student/profile"),
        api.get("/student/my-attendance")
      ]);

      setSubjects(profileResponse.data.student.subjectIds || []);
      setAttendance(attendanceResponse.data.attendance || []);
    } catch (error) {
      console.log("Attendance Error:", error);
      setError("Unable to load attendance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredAttendance = attendance.filter(
    (record) => record.subjectId?._id === selectedSubject
  );

  const totalClasses = filteredAttendance.length;

  const presentCount = filteredAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = filteredAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const percentage =
    totalClasses > 0
      ? ((presentCount / totalClasses) * 100).toFixed(1)
      : "0.0";

  const formatDate = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const stats = [
    {
      title: "Attendance Rate",
      value: `${percentage}%`,
      description: "Classes attended",
      icon: Percent,
      color: "bg-violet-100 text-violet-600"
    },
    {
      title: "Present",
      value: presentCount,
      description: "Classes attended",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Absent",
      value: absentCount,
      description: "Classes missed",
      icon: XCircle,
      color: "bg-rose-100 text-rose-600"
    },
    {
      title: "Total Classes",
      value: totalClasses,
      description: "Recorded classes",
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              STUDENT PORTAL
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Attendance
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Track your attendance percentage and review your class history.
            </p>
          </div>

          <button
            type="button"
            onClick={getData}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
                <CalendarCheck size={26} />
              </div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Your Attendance Overview
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                Select a subject to see your attendance summary and individual class records.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:min-w-44">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400">My Subjects</p>
                <p className="mt-1 text-2xl font-bold">
                  {loading ? "—" : subjects.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center">
            <AlertCircle className="mx-auto text-rose-500" size={30} />
            <h2 className="mt-3 font-bold text-slate-900">
              Attendance unavailable
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={getData}
              className="mt-4 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <label
                htmlFor="attendance-subject"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Select Subject
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-md">
                  <BookOpen
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    id="attendance-subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60"
                  >
                    <option value="">Choose a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSubject && (
                  <button
                    type="button"
                    onClick={() => setSelectedSubject("")}
                    className="w-fit rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {!loading && subjects.length === 0 && (
                <p className="mt-3 text-sm text-slate-500">
                  No subjects are assigned to your profile yet.
                </p>
              )}
            </div>

            {!selectedSubject ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <ClipboardCheck size={30} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Select a subject
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Choose a subject above to view your attendance percentage, present and absent counts, and class history.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Attendance Summary
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your records for{" "}
                    <span className="font-semibold text-violet-700">
                      {subjects.find(
                        (subject) => subject._id === selectedSubject
                      )?.subjectName || "selected subject"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-6"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              {stat.title}
                            </p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                              {loading ? "—" : stat.value}
                            </p>
                          </div>
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                          >
                            <Icon size={23} />
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-400">
                          {stat.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Attendance Percentage
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Based on recorded classes for this subject.
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-violet-700">
                      {percentage}%
                    </span>
                  </div>

                  <div
                    className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label="Attendance percentage"
                    aria-valuenow={Number(percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Number(percentage))}%`
                      }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                    <span>{presentCount} present</span>
                    <span>{absentCount} absent</span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900">
                      Attendance History
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Individual attendance records for the selected subject.
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex min-h-48 items-center justify-center">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
                    </div>
                  ) : filteredAttendance.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <CalendarDays
                        size={30}
                        className="mx-auto text-slate-300"
                      />
                      <h3 className="mt-3 font-semibold text-slate-800">
                        No attendance records found
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Records for this subject will appear here when available.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-slate-100 md:hidden">
                        {filteredAttendance.map((record) => (
                          <div key={record._id} className="space-y-3 p-5">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                  <CalendarDays size={19} />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Class Date
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {formatDate(record.date)}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                  record.status === "Present"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {record.status === "Present" ? (
                                  <CheckCircle2 size={14} />
                                ) : (
                                  <XCircle size={14} />
                                )}
                                {record.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[500px] text-left">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                #
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Class Date
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredAttendance.map((record, index) => (
                              <tr
                                key={record._id}
                                className="transition hover:bg-slate-50"
                              >
                                <td className="px-6 py-4 text-sm text-slate-400">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                  {formatDate(record.date)}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                      record.status === "Present"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-rose-50 text-rose-700"
                                    }`}
                                  >
                                    {record.status === "Present" ? (
                                      <CheckCircle2 size={14} />
                                    ) : (
                                      <XCircle size={14} />
                                    )}
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;

