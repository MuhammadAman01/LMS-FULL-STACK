import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  BookOpen,
  Library,
  Mail,
  GraduationCap,
  Search,
  RefreshCw,
  UserRound,
  Filter,
} from "lucide-react";

function Students() {
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [studentsError, setStudentsError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getProfile = async () => {
    try {
      setProfileError(false);
      const response = await api.get("/teacher/profile");
      setTeacher(response.data.teacher);
    } catch (error) {
      console.log("Profile Error:", error);
      setProfileError(true);
    } finally {
      setProfileLoading(false);
    }
  };

  const getStudents = async () => {
    if (!selectedCourse || !selectedSubject) {
      return;
    }

    try {
      setLoading(true);
      setStudentsError(false);
      setHasSearched(true);

      const response = await api.get(
        `/teacher/students?courseId=${selectedCourse}&subjectId=${selectedSubject}`
      );

      setStudents(response.data.students || []);
    } catch (error) {
      console.log("Students Error:", error);
      setStudentsError(true);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.toLowerCase().trim();

    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    );
  });

  if (profileLoading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <p className="text-sm text-slate-500">Loading students...</p>
      </div>
    );
  }

  if (profileError || !teacher) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <Users size={36} className="mx-auto text-violet-500" />
        <h2 className="mt-3 font-semibold text-slate-800">
          Unable to load teacher profile
        </h2>
        <button
          type="button"
          onClick={() => {
            setProfileLoading(true);
            getProfile();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
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
            My Students
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Select a course and subject to view your students.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="rounded-xl bg-violet-100 p-2.5">
            <Users size={22} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Students Found
            </p>
            <p className="text-xl font-bold text-slate-900">
              {hasSearched && !studentsError ? students.length : "—"}
            </p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="rounded-xl bg-violet-100 p-2.5">
            <Filter size={21} className="text-violet-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Filter Students</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Choose your assigned course and subject.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="course"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Select Course
            </label>
            <div className="relative">
              <BookOpen
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setStudents([]);
                  setHasSearched(false);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="">Select Course</option>
                {teacher.courseIds?.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Select Subject
            </label>
            <div className="relative">
              <Library
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setStudents([]);
                  setHasSearched(false);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="">Select Subject</option>
                {teacher.subjectIds?.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={getStudents}
              disabled={!selectedCourse || !selectedSubject || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <Search size={17} />
              )}
              {loading ? "Loading Students..." : "View Students"}
            </button>

            {(!selectedCourse || !selectedSubject) && (
              <p className="mt-2 text-xs text-slate-400">
                Select both fields to view students.
              </p>
            )}
          </div>
        </div>
      </section>

      {hasSearched && !studentsError && students.length > 0 && (
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>
      )}

      {studentsError ? (
        <div className="rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
          <Users size={34} className="mx-auto text-red-400" />
          <h2 className="mt-4 font-bold text-slate-900">
            Unable to load students
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please try loading the selected students again.
          </p>
          <button
            type="button"
            onClick={getStudents}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : !hasSearched ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:py-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <GraduationCap size={30} className="text-violet-600" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Find Your Students
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Select a course and subject above, then click View Students to see
            the matching student list.
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:py-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Users size={30} className="text-slate-500" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No Students Found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            No students are assigned to the selected course and subject.
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Search size={30} className="mx-auto text-slate-400" />
          <p className="mt-3 font-semibold text-slate-800">
            No matching students
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different name or email.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""} displayed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <article
                key={student._id}
                className="min-w-0 rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:shadow-md sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                    <UserRound size={23} className="text-violet-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-bold text-slate-900">
                      {student.name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {student.email}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <BookOpen size={15} />
                    Courses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {student.courseIds?.length > 0 ? (
                      student.courseIds.map((course) => (
                        <span
                          key={course._id}
                          className="max-w-full break-words rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700"
                        >
                          {course.courseName}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No courses
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Library size={15} />
                    Subjects
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {student.subjectIds?.length > 0 ? (
                      student.subjectIds.map((subject) => (
                        <span
                          key={subject._id}
                          className="max-w-full break-words rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700"
                        >
                          {subject.subjectName}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No subjects
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={`mailto:${student.email}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Mail size={16} />
                  Contact Student
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Students;