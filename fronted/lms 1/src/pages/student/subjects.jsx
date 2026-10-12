
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Hash,
  Clock3,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import api from "../../services/api";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/student/profile");
      setSubjects(response.data.student.subjectIds || []);
    } catch (error) {
      console.error("Subjects Error:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load your subjects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              STUDENT PORTAL
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Subjects
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View your assigned subjects and their details.
            </p>
          </div>

          <button
            onClick={getSubjects}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
              <BookOpen size={23} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Subjects</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {subjects.length}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <LoaderCircle className="h-9 w-9 animate-spin text-violet-600" />
            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading your subjects...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h2 className="font-bold text-slate-900">
              Subjects could not be loaded
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={getSubjects}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <BookOpen size={30} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No Subjects Assigned
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your assigned subjects will appear here once they have been added
              to your profile.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold text-slate-900">Assigned Subjects</h2>
              <p className="text-sm text-slate-500">
                {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => (
                <article
                  key={subject._id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                      <BookOpen size={23} />
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      Assigned
                    </span>
                  </div>

                  <h3 className="mt-5 break-words text-lg font-bold text-slate-900">
                    {subject.subjectName || "Unnamed Subject"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Subject information
                  </p>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                      <Hash size={17} className="shrink-0 text-violet-600" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Subject Code</p>
                        <p className="break-words text-sm font-semibold text-slate-800">
                          {subject.subjectCode || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock3 size={17} className="shrink-0 text-violet-600" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Credit Hours</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {subject.creditHours ?? "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    <GraduationCap
                      size={18}
                      className="shrink-0 text-violet-600"
                    />
                    <span>Part of your academic program</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Subjects;

