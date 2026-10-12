
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Building2,
  Hash,
  RefreshCw,
  BookMarked
} from "lucide-react";
import api from "../../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCourses = async () => {
    try {
      setError("");
      const response = await api.get("/student/my-course");
      setCourses(response.data.courses || []);
    } catch (error) {
      console.log("Courses Error:", error);
      setError("Unable to load your courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              STUDENT PORTAL
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Courses
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Explore your assigned courses and course details.
            </p>
          </div>

          <button
            type="button"
            onClick={getCourses}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
                <GraduationCap size={27} />
              </div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Your Learning Journey
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                All your assigned courses in one place. Review course information and stay organized.
              </p>
            </div>

            {!loading && !error && (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:min-w-40">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                  <BookOpen size={23} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Assigned courses</p>
                  <p className="mt-1 text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Course Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View your course details below.
            </p>
          </div>
          {!loading && !error && (
            <span className="mt-2 w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 sm:mt-0">
              {courses.length} {courses.length === 1 ? "Course" : "Courses"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading your courses...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
            <p className="font-semibold text-slate-800">
              Courses unavailable
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={getCourses}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <BookOpen size={30} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No courses assigned yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your assigned courses will appear here once they are added to your student account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <div className="relative overflow-hidden bg-slate-950 p-5 text-white sm:p-6">
                  <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-violet-600/20 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600">
                      <BookMarked size={24} />
                    </div>
                    <span className="max-w-[60%] break-words rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-right text-xs font-medium text-slate-300">
                      {course.courseCode || "Course"}
                    </span>
                  </div>
                  <h3 className="relative mt-5 break-words text-xl font-bold leading-snug">
                    {course.courseName}
                  </h3>
                  <p className="relative mt-2 text-sm text-slate-400">
                    Course details
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <Hash size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Course Code
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {course.courseCode || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Building2 size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Department
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {course.department || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Clock size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Duration
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {course.duration || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {course.description && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Description
                      </p>
                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                        {course.description}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;

