
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Building2,
  Hash,
  Clock,
  FileText,
  Activity,
} from "lucide-react";

function Courses() {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [department, setDepartment] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const [courses, setCourses] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);

  const getCourses = async () => {
    try {
      const response = await api.get("/admin/programs");
      setCourses(response.data.allCourses);
    } catch (error) {
      console.log("Courses Error:", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const clearForm = () => {
    setEditCourseId(null);
    setCourseName("");
    setCourseCode("");
    setDepartment("");
    setDuration("");
    setDescription("");
    setStatus("active");
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/program", {
        courseName,
        courseCode,
        department,
        duration,
        description,
        status,
      });

      alert("Course created successfully");
      clearForm();
      getCourses();
    } catch (error) {
      console.log("Create Course Error:", error);
      alert("Course create failed");
    }
  };

  const handleEditCourse = (course) => {
    setEditCourseId(course._id);
    setCourseName(course.courseName);
    setCourseCode(course.courseCode);
    setDepartment(course.department);
    setDuration(course.duration);
    setDescription(course.description || "");
    setStatus(course.status);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/admin/program/${editCourseId}`, {
        courseName,
        courseCode,
        department,
        duration,
        description,
        status,
      });

      alert("Course updated successfully");
      clearForm();
      getCourses();
    } catch (error) {
      console.log("Update Course Error:", error);
      alert("Course update failed");
    }
  };

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/program/${id}`);
      alert("Course deleted successfully");
      getCourses();
    } catch (error) {
      console.log("Delete Course Error:", error);
      alert("Course delete failed");
    }
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:pr-4";

  const fields = [
    {
      label: "Course Name",
      value: courseName,
      setter: setCourseName,
      placeholder: "Enter course name",
      icon: BookOpen,
      required: true,
    },
    {
      label: "Course Code",
      value: courseCode,
      setter: setCourseCode,
      placeholder: "e.g. CS-101",
      icon: Hash,
      required: true,
    },
    {
      label: "Department",
      value: department,
      setter: setDepartment,
      placeholder: "Enter department",
      icon: Building2,
      required: true,
    },
    {
      label: "Duration",
      value: duration,
      setter: setDuration,
      placeholder: "e.g. 4 Years",
      icon: Clock,
      required: true,
    },
  ];

  const renderCourseCard = (course) => (
    <article
      key={course._id}
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
          <BookOpen size={21} className="text-violet-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words font-semibold text-slate-900">
            {course.courseName}
          </h3>
          <p className="mt-1 break-words text-sm text-slate-500">
            {course.courseCode}
          </p>
          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              course.status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {course.status}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 min-[400px]:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Department
          </p>
          <p className="mt-1 break-words text-sm text-slate-700">
            {course.department || "—"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Duration
          </p>
          <p className="mt-1 break-words text-sm text-slate-700">
            {course.duration || "—"}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Description
        </p>
        <p className="mt-1 break-words text-sm leading-5 text-slate-600">
          {course.description || "No description"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => handleEditCourse(course)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-violet-200 px-2 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => handleDeleteCourse(course._id)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-2 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 sm:space-y-7 lg:space-y-8">
      {/* Page Header */}
      <section className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 sm:p-3">
          <BookOpen size={25} className="text-violet-600" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Courses
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Create and manage LMS courses
          </p>
        </div>
      </section>

      {/* Create / Update Form */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
        <div className="mb-5 flex min-w-0 items-start justify-between gap-3 sm:mb-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-xl bg-violet-50 p-2.5">
              {editCourseId ? (
                <Pencil size={20} className="text-violet-600" />
              ) : (
                <Plus size={20} className="text-violet-600" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {editCourseId ? "Update Course" : "Create Course"}
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {editCourseId
                  ? "Update course information"
                  : "Add a new course to the LMS"}
              </p>
            </div>
          </div>

          {editCourseId && (
            <button
              type="button"
              onClick={clearForm}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-600 transition hover:bg-slate-50 sm:gap-2 sm:px-3"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={editCourseId ? handleUpdateCourse : handleCreateCourse}
          className="space-y-5"
        >
          {/* Course Name, Code, Department, Duration */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {fields.map((field) => {
              const Icon = field.icon;

              return (
                <div key={field.label} className="min-w-0">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {field.label}
                  </label>

                  <div className="relative">
                    <Icon
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      required={field.required}
                      className={inputClass}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="pointer-events-none absolute left-3 top-3 text-slate-400"
              />
              <textarea
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:pr-4"
              />
            </div>
          </div>

          {/* Status */}
          <div className="min-w-0 sm:max-w-sm">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <div className="relative">
              <Activity
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${inputClass} appearance-none`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            {editCourseId && (
              <button
                type="button"
                onClick={clearForm}
                className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] sm:w-auto"
            >
              {editCourseId ? (
                <>
                  <Pencil size={17} />
                  Update Course
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Course List */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-6">
          <div className="shrink-0 rounded-xl bg-violet-50 p-2.5">
            <BookOpen size={20} className="text-violet-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              All Courses
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {courses.length} course{courses.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:p-4 md:hidden">
          {courses.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No courses found.
            </p>
          ) : (
            courses.map((course) => renderCourseCard(course))
          )}
        </div>

        {/* Tablet / Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Course",
                  "Code",
                  "Department",
                  "Duration",
                  "Description",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 lg:px-6 ${
                      heading === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100">
                          <BookOpen size={19} className="text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">
                            {course.courseName}
                          </p>
                          <p className="text-xs text-slate-400">Course</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {course.courseCode}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 lg:px-6">
                      {course.department}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 lg:px-6">
                      {course.duration}
                    </td>

                    <td className="max-w-[280px] px-5 py-4 text-sm text-slate-500 lg:px-6">
                      <p className="truncate">
                        {course.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          course.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditCourse(course)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course._id)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
      </section>
    </div>
  );
}

export default Courses;

