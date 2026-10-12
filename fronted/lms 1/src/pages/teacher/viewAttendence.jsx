
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  BookOpen,
  GraduationCap
} from "lucide-react";
import api from "../../services/api";

function AttendanceRecords() {
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editDate, setEditDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/teacher/profile");
      setTeacher(response.data.teacher);
    } catch {
      setError("Unable to load teacher profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAttendance = async () => {
    if (!selectedCourse || !selectedSubject || !date) {
      setError("Please select a course, subject and date.");
      return;
    }

    try {
      setRecordsLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get(
        `/teacher/attendences?courseId=${selectedCourse}&subjectId=${selectedSubject}&date=${date}`
      );

      setAttendance(response.data.attendance || []);
    } catch (err) {
      setAttendance([]);
      setError(
        err.response?.data?.message ||
          "Unable to load attendance records. Please try again."
      );
    } finally {
      setRecordsLoading(false);
    }
  };

  const startEdit = (record) => {
    setEditId(record._id);
    setEditStatus(record.status);
    setEditDate(new Date(record.date).toISOString().split("T")[0]);
    setError("");
    setSuccess("");
  };

  const updateAttendance = async () => {
    if (!editStatus || !editDate) {
      setError("Please select a status and date.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.patch(`/teacher/attendence/${editId}`, {
        status: editStatus,
        date: editDate
      });

      setAttendance((previous) =>
        previous.map((record) =>
          record._id === editId
            ? {
                ...record,
                status: editStatus,
                date: editDate
              }
            : record
        )
      );

      setEditId(null);
      setEditStatus("");
      setEditDate("");
      setSuccess("Attendance record updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update attendance. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/teacher/attendence/${id}`);

      setAttendance((previous) =>
        previous.filter((record) => record._id !== id)
      );

      if (editId === id) {
        setEditId(null);
        setEditStatus("");
        setEditDate("");
      }

      setSuccess("Attendance record deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete attendance. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance.filter((record) => {
      const studentName = record.studentId?.name || "";
      const email = record.studentId?.email || "";
      const courseName = record.courseId?.courseName || "";
      const subjectName = record.subjectId?.subjectName || "";

      const matchesSearch = [
        studentName,
        email,
        courseName,
        subjectName
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [attendance, search, statusFilter]);

  const presentCount = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const formatDate = (value) => {
    if (!value) return "—";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <LoaderCircle className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-sm font-medium">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <p className="mb-4 text-sm text-slate-600">
          {error || "Teacher profile could not be loaded."}
        </p>
        <button
          onClick={getProfile}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const courses = teacher.courseIds || [];
  const subjects = teacher.subjectIds || [];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
            <ClipboardList className="h-4 w-4" />
            Teacher Workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Attendance Records
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View, update and manage student attendance records.
          </p>
        </div>

        <button
          onClick={getAttendance}
          disabled={recordsLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${recordsLoading ? "animate-spin" : ""}`}
          />
          Refresh Records
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto shrink-0"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto shrink-0"
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3">
            <BookOpen className="h-5 w-5 text-violet-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Filter Records</h2>
            <p className="text-sm text-slate-500">
              Select the course, subject and date to view attendance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setAttendance([]);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setAttendance([]);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setAttendance([]);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Records will load for the selected course, subject and date.
          </p>
          <button
            onClick={getAttendance}
            disabled={recordsLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {recordsLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ClipboardList className="h-4 w-4" />
            )}
            {recordsLoading ? "Loading..." : "View Attendance"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Records
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {attendance.length}
              </p>
            </div>
            <div className="rounded-xl bg-violet-100 p-3">
              <GraduationCap className="h-6 w-6 text-violet-700" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Present</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {presentCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3">
              <UserCheck className="h-6 w-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Absent</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {absentCount}
              </p>
            </div>
            <div className="rounded-xl bg-red-100 p-3">
              <UserX className="h-6 w-6 text-red-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Attendance List
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredAttendance.length} of {attendance.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, email, course or subject..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 md:w-44"
            >
              <option value="All">All statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {recordsLoading ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-slate-500">
            <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-violet-600" />
            <p className="text-sm font-medium">Fetching attendance records...</p>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4">
              <ClipboardList className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800">
              {attendance.length === 0
                ? "No attendance records"
                : "No matching records"}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {attendance.length === 0
                ? "Select a course, subject and date, then view attendance records."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Course</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendance.map((record) => (
                  <tr
                    key={record._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                          {(record.studentId?.name || "S")
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {record.studentId?.name || "Unknown Student"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {record.studentId?.email || "No email available"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {record.courseId?.courseName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {record.subjectId?.subjectName || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          record.status === "Present"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {record.status === "Present" ? (
                          <UserCheck className="h-3.5 w-3.5" />
                        ) : (
                          <UserX className="h-3.5 w-3.5" />
                        )}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(record)}
                          title="Edit attendance"
                          aria-label="Edit attendance"
                          className="rounded-lg border border-violet-200 bg-violet-50 p-2.5 text-violet-700 transition hover:bg-violet-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAttendance(record._id)}
                          disabled={deletingId === record._id}
                          title="Delete attendance"
                          aria-label="Delete attendance"
                          className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === record._id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-attendance-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-3 inline-flex rounded-xl bg-violet-100 p-3">
                  <Pencil className="h-5 w-5 text-violet-700" />
                </div>
                <h2
                  id="edit-attendance-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Edit Attendance
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the attendance status or date.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditId(null);
                  setEditStatus("");
                  setEditDate("");
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close edit form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Attendance Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setEditId(null);
                  setEditStatus("");
                  setEditDate("");
                }}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={updateAttendance}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceRecords;

