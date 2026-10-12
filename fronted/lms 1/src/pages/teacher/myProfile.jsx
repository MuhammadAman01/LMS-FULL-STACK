import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  UserRound,
  Mail,
  ShieldCheck,
  BookOpen,
  Library,
  GraduationCap,
} from "lucide-react";

function Profile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(false);

  const getProfile = async () => {
    try {
      setError(false);
      const response = await api.get("/teacher/profile");
      setTeacher(response.data.teacher);
    } catch (error) {
      console.log("Profile Error:", error);
      setError(true);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!teacher && !error) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (!teacher && error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="font-semibold text-slate-800">Unable to load profile</p>
        <button
          onClick={getProfile}
          className="mt-4 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium text-violet-600">
          Learning Management System
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          View your personal information, courses and subjects.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-slate-950 via-slate-900 to-violet-900 sm:h-36" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-violet-100 shadow-sm sm:h-28 sm:w-28">
              <UserRound className="text-violet-700" size={46} />
            </div>

            <div className="min-w-0 pb-1">
              <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                {teacher.name}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-500">
                {teacher.email}
              </p>
            </div>

            <div className="sm:ml-auto sm:pb-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-sm font-semibold capitalize text-violet-700">
                <ShieldCheck size={16} />
                {teacher.role}
              </span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-4">
              <div className="rounded-lg bg-violet-100 p-2.5">
                <UserRound size={20} className="text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Full Name</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {teacher.name}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-4">
              <div className="rounded-lg bg-blue-100 p-2.5">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Email Address</p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {teacher.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-3">
              <BookOpen size={22} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Courses</h2>
              <p className="text-sm text-slate-500">
                {teacher.courseIds?.length || 0} assigned courses
              </p>
            </div>
          </div>

          {teacher.courseIds?.length > 0 ? (
            <div className="space-y-3">
              {teacher.courseIds.map((course) => (
                <div
                  key={course._id}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="rounded-lg bg-violet-100 p-2">
                    <GraduationCap size={19} className="text-violet-600" />
                  </div>
                  <p className="break-words text-sm font-semibold text-slate-800">
                    {course.courseName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              No courses assigned yet.
            </p>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Library size={22} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Subjects</h2>
              <p className="text-sm text-slate-500">
                {teacher.subjectIds?.length || 0} assigned subjects
              </p>
            </div>
          </div>

          {teacher.subjectIds?.length > 0 ? (
            <div className="space-y-3">
              {teacher.subjectIds.map((subject) => (
                <div
                  key={subject._id}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <div className="rounded-lg bg-blue-100 p-2">
                    <BookOpen size={19} className="text-blue-600" />
                  </div>
                  <p className="break-words text-sm font-semibold text-slate-800">
                    {subject.subjectName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              No subjects assigned yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;