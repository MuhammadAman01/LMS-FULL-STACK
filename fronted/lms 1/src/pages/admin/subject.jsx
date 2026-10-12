
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Library,
  Plus,
  Pencil,
  Trash2,
  X,
  Hash,
  BookOpen,
  Clock,
  GraduationCap,
} from "lucide-react";

function Subjects() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [courseId, setCourseId] = useState("");

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editSubjectId, setEditSubjectId] = useState(null);

  const getCourses = async () => {
    try {
      const response = await api.get("/admin/programs");
      setCourses(response.data.allCourses);
    } catch (error) {
      console.log("Courses Error:", error);
    }
  };

  const getSubjects = async () => {
    try {
      const response = await api.get("/admin/subjects");
      setSubjects(response.data.subjects);
    } catch (error) {
      console.log("Subjects Error:", error);
    }
  };

  useEffect(() => {
    getCourses();
    getSubjects();
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/subject", {
        subjectName,
        subjectCode,
        creditHours: Number(creditHours),
        courseId,
      });

      alert("Subject created successfully");
      handleCancelEdit();
      getSubjects();
    } catch (error) {
      console.log("Create Subject Error:", error);
      alert("Subject create failed");
    }
  };

  const handleEditSubject = (subject) => {
    setEditSubjectId(subject._id);
    setSubjectName(subject.subjectName);
    setSubjectCode(subject.subjectCode);
    setCreditHours(subject.creditHours);
    setCourseId(subject.courseId?._id || "");
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/admin/subject/${editSubjectId}`, {
        subjectName,
        subjectCode,
        creditHours: Number(creditHours),
        courseId,
      });

      alert("Subject updated successfully");
      handleCancelEdit();
      getSubjects();
    } catch (error) {
      console.log("Update Subject Error:", error);
      alert("Subject update failed");
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await api.delete(`/admin/subject/${id}`);
      getSubjects();
    } catch (error) {
      console.log("Delete Subject Error:", error);
      alert("Subject delete failed");
    }
  };

  const handleCancelEdit = () => {
    setEditSubjectId(null);
    setSubjectName("");
    setSubjectCode("");
    setCreditHours("");
    setCourseId("");
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-violet-100 p-3">
          <Library size={24} className="text-violet-600" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Subjects
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage course subjects
          </p>
        </div>
      </div>

      {/* Create / Update Form */}
      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-violet-50 p-2.5">
              {editSubjectId ? (
                <Pencil size={20} className="text-violet-600" />
              ) : (
                <Plus size={20} className="text-violet-600" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {editSubjectId ? "Update Subject" : "Create Subject"}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {editSubjectId
                  ? "Update subject information"
                  : "Add a new subject to the LMS"}
              </p>
            </div>
          </div>

          {editSubjectId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-600 transition hover:bg-slate-50 sm:gap-2 sm:px-3"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          )}
        </div>

        <form
          onSubmit={
            editSubjectId ? handleUpdateSubject : handleCreateSubject
          }
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Subject Name */}
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subject Name
              </label>
              <div className="relative">
                <Library size={18} className={iconClass} />
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Subject Code */}
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subject Code
              </label>
              <div className="relative">
                <Hash size={18} className={iconClass} />
                <input
                  type="text"
                  placeholder="e.g. CS-101"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Credit Hours */}
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Credit Hours
              </label>
              <div className="relative">
                <Clock size={18} className={iconClass} />
                <input
                  type="number"
                  placeholder="Enter credit hours"
                  value={creditHours}
                  onChange={(e) => setCreditHours(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Course */}
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Course
              </label>
              <div className="relative">
                <BookOpen size={18} className={iconClass} />
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            {editSubjectId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                <X size={17} />
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] sm:w-auto"
            >
              {editSubjectId ? (
                <>
                  <Pencil size={17} />
                  Update Subject
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Subject
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Subjects List */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-violet-50 p-2.5">
              <GraduationCap size={21} className="text-violet-600" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                All Subjects
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Manage all registered subjects
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            {subjects.length} Total
          </span>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-3 sm:p-4 md:hidden">
          {subjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
              <Library size={30} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                No subjects found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Create a subject using the form above.
              </p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject._id}
                className="min-w-0 rounded-xl border border-slate-200 p-4 transition hover:border-violet-200"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-violet-100 p-2.5">
                    <Library size={20} className="text-violet-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-slate-900">
                      {subject.subjectName}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Subject Code: {subject.subjectCode}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Credit Hours</p>
                    <p className="mt-1 text-sm font-semibold text-violet-700">
                      {subject.creditHours} Credits
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Course</p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-800">
                      {subject.courseId?.courseName || "No Course"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditSubject(subject)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-violet-200 px-3 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(subject._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[750px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Code
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Credit Hours
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr
                    key={subject._id}
                    className="transition hover:bg-violet-50/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100">
                          <Library size={19} className="text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">
                            {subject.subjectName}
                          </p>
                          <p className="text-xs text-slate-400">Subject</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {subject.subjectCode}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {subject.creditHours} Credits
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {subject.courseId?.courseName ? (
                        <span className="inline-flex max-w-[220px] items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                          <BookOpen size={14} className="shrink-0" />
                          <span className="break-words">
                            {subject.courseId.courseName}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          No Course
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditSubject(subject)}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(subject._id)}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Subjects;

