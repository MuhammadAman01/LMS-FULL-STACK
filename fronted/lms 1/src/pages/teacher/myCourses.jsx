import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BookOpen,
  GraduationCap,
  Building2,
  Clock3,
  Hash,
  RefreshCw,
  BookMarked,
} from "lucide-react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getCourses = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/teacher/courses");
      setCourses(response.data.courses || []);
    } catch (error) {
      console.log("Courses Error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <p className="text-sm text-slate-500">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <BookOpen size={36} className="mx-auto text-violet-500" />
        <h2 className="mt-3 font-semibold text-slate-800">
          Unable to load courses
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Please try again.
        </p>
        <button
          type="button"
          onClick={getCourses}
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-violet-600">
            Learning Management System
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Courses
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            View the courses assigned to you and their details.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="rounded-xl bg-violet-100 p-2.5">
            <BookOpen size={22} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Assigned Courses</p>
            <p className="text-xl font-bold text-slate-900">{courses.length}</p>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <BookMarked size={30} className="text-violet-600" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No courses assigned
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Your assigned courses will appear here when the administrator adds
            them to your profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course._id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
            >
              <div className="relative overflow-hidden bg-slate-950 px-5 py-6 sm:px-6">
                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet-600/20 blur-2xl" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/20">
                    <GraduationCap size={25} className="text-violet-300" />
                  </div>

                  <span className="max-w-[60%] break-words rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                    {course.courseCode || "Course"}
                  </span>
                </div>

                <h2 className="relative mt-5 break-words text-xl font-bold text-white sm:text-2xl">
                  {course.courseName}
                </h2>
                <p className="relative mt-2 text-sm text-slate-400">
                  Assigned course
                </p>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-violet-100 p-2">
                      <Hash size={18} className="text-violet-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Course Code
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {course.courseCode || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Building2 size={18} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Department
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {course.department || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <Clock3 size={18} className="text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Duration
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {course.duration || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Description
                  </p>
                  <p className="break-words text-sm leading-6 text-slate-600">
                    {course.description || "No description available."}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;