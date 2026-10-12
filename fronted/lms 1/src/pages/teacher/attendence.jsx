
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  UserCheck,
  UserX,
  ClipboardCheck,
  BookOpen,
  GraduationCap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LoaderCircle
} from "lucide-react";
import api from "../../services/api";

function Attendance() {
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const getStudents = async () => {
    if (!selectedCourse || !selectedSubject) {
      setError("Please select both a course and a subject.");
      return;
    }

    try {
      setStudentsLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get(
        `/teacher/students?courseId=${selectedCourse}&subjectId=${selectedSubject}`
      );

      const studentList = response.data.students || [];
      setStudents(studentList);

      const initialAttendance = {};

      studentList.forEach((student) => {
        initialAttendance[student._id] = "Present";
      });

      setAttendance(initialAttendance);

      if (studentList.length === 0) {
        setError("No students found for this course and subject.");
      }
    } catch {
      setStudents([]);
      setAttendance({});
      setError("Unable to load students. Please try again.");
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status
    }));
  };

  const markAll = (status) => {
    const updatedAttendance = {};

    students.forEach((student) => {
      updatedAttendance[student._id] = status;
    });

    setAttendance(updatedAttendance);
  };

  const saveAttendance = async () => {
    if (!selectedCourse || !selectedSubject || !date) {
      setError("Please select a course, subject and date.");
      return;
    }

    if (students.length === 0) {
      setError("Load students before saving attendance.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      for (const student of students) {
        await api.post("/teacher/attendence", {
          date,
          studentId: student._id,
          status: attendance[student._id] || "Present",
          courseId: selectedCourse,
          subjectId: selectedSubject
        });
      }

      setSuccess("Attendance marked successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save attendance. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const presentCount = students.filter(
    (student) => attendance[student._id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student._id] === "Absent"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <LoaderCircle className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-sm font-medium">Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (!teacher && error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <p className="mb-4 text-sm text-slate-600">{error}</p>
        <button
          onClick={getProfile}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const courses = teacher?.courseIds || [];
  const subjects = teacher?.subjectIds || [];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
            <ClipboardCheck className="h-4 w-4" />
            Teacher Workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mark Attendance
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select a course, subject and date to record student attendance.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <CalendarDays className="h-5 w-5 text-violet-600" />
          {date || "Select a date"}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3">
            <BookOpen className="h-5 w-5 text-violet-700" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Attendance Details
            </h2>
            <p className="text-sm text-slate-500">
              Choose the class information before loading students.
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
                setStudents([]);
                setAttendance({});
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
                setStudents([]);
                setAttendance({});
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
                setSuccess("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Verify the selected course, subject and date before saving.
          </p>
          <button
            onClick={getStudents}
            disabled={studentsLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {studentsLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Users className="h-4 w-4" />
            )}
            {studentsLoading ? "Loading Students..." : "Load Students"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Students
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {students.length}
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
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Student Attendance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Set each student's status, then save the attendance.
            </p>
          </div>

          {students.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => markAll("Present")}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll("Absent")}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
              >
                Mark All Absent
              </button>
            </div>
          )}
        </div>

        {studentsLoading ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-slate-500">
            <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-violet-600" />
            <p className="text-sm font-medium">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800">
              No students to display
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Select a course and subject, then click Load Students to begin
              marking attendance.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {students.map((student, index) => {
                const status = attendance[student._id] || "Present";

                return (
                  <div
                    key={student._id}
                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                        {(student.name || "S")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {student.name || "Unnamed Student"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Student #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`hidden rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                          status === "Present"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                      <select
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(student._id, e.target.value)
                        }
                        aria-label={`Attendance status for ${student.name || "student"}`}
                        className={`w-full min-w-36 rounded-xl border px-3 py-2.5 text-sm font-semibold outline-none transition focus:ring-4 sm:w-40 ${
                          status === "Present"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-100"
                            : "border-red-200 bg-red-50 text-red-700 focus:ring-red-100"
                        }`}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-emerald-700">
                  {presentCount} present
                </span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="font-semibold text-red-700">
                  {absentCount} absent
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={getStudents}
                  disabled={studentsLoading || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Students
                </button>
                <button
                  onClick={saveAttendance}
                  disabled={saving || studentsLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {saving ? "Saving Attendance..." : "Save Attendance"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;

