
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import api from "../../services/api";

function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/student/profile");
      setStudent(response.data.student);
    } catch (error) {
      console.error("Profile Error:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="text-lg font-bold text-slate-900">
          Profile could not be loaded
        </h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <button
          onClick={getProfile}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-medium text-slate-600">
          No profile information found.
        </p>
      </div>
    );
  }

  const courses = student.courseIds || [];
  const subjects = student.subjectIds || [];

  const initials = student.name
    ?.split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-purple-600">
              STUDENT PORTAL
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View your personal information, courses, and subjects.
            </p>
          </div>

          <button
            onClick={getProfile}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-purple-300 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-500 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-purple-100 text-2xl font-bold text-purple-700 shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
                {initials || <UserRound size={34} />}
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                  {student.name || "Student"}
                </h2>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {student.email}
                </p>
              </div>

              <div className="sm:ml-auto sm:pb-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold capitalize text-emerald-700">
                  <ShieldCheck size={15} />
                  {student.role || "Student"}
                </span>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700">
                  <UserRound size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Full Name
                  </p>
                  <p className="mt-1 break-words font-semibold text-slate-900">
                    {student.name || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700">
                  <Mail size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email Address
                  </p>
                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {student.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                  <BookOpen size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">My Courses</h2>
                  <p className="text-sm text-slate-500">
                    Your enrolled courses
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-700">
                {courses.length}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/40"
                  >
                    <div className="rounded-lg bg-purple-50 p-2 text-purple-700">
                      <GraduationCap size={19} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-slate-800">
                        {course.courseName}
                      </h3>
                      {course.courseCode && (
                        <p className="mt-1 text-sm text-slate-500">
                          Course Code: {course.courseCode}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No courses assigned yet.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                  <GraduationCap size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">My Subjects</h2>
                  <p className="text-sm text-slate-500">
                    Your assigned subjects
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-700">
                {subjects.length}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/40"
                  >
                    <div className="rounded-lg bg-purple-50 p-2 text-purple-700">
                      <BookOpen size={19} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-slate-800">
                        {subject.subjectName}
                      </h3>
                      {subject.subjectCode && (
                        <p className="mt-1 text-sm text-slate-500">
                          Subject Code: {subject.subjectCode}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No subjects assigned yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;

