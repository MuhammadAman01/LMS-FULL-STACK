
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  UserPlus,
  Users,
  Mail,
  Lock,
  BookOpen,
  Library,
  Pencil,
  Trash2,
  X,
  GraduationCap,
} from "lucide-react";

function Students() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [students, setStudents] = useState([]);
  const [editStudentId, setEditStudentId] = useState(null);

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

  const getStudents = async () => {
    try {
      const response = await api.get("/admin/students");
      setStudents(response.data.students);
    } catch (error) {
      console.log("Students Error:", error);
    }
  };

  useEffect(() => {
    getCourses();
    getSubjects();
    getStudents();
  }, []);

  const clearForm = () => {
    setEditStudentId(null);
    setName("");
    setEmail("");
    setPassword("");
    setSelectedCourse("");
    setSelectedSubject("");
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/admin/student", {
        name,
        email,
        password,
        courseIds: selectedCourse ? [selectedCourse] : [],
        subjectIds: selectedSubject ? [selectedSubject] : [],
      });

      console.log("Student Created:", response.data);
      alert("Student created successfully");

      clearForm();
      getStudents();
    } catch (error) {
      console.log("Create Student Error:", error);
      alert("Student create failed");
    }
  };

  const handleEditStudent = (student) => {
    setEditStudentId(student._id);
    setName(student.name);
    setEmail(student.email);

    setSelectedCourse(
      student.courseIds?.length > 0
        ? student.courseIds[0]._id
        : ""
    );

    setSelectedSubject(
      student.subjectIds?.length > 0
        ? student.subjectIds[0]._id
        : ""
    );
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await api.patch(
        `/admin/student/${editStudentId}`,
        {
          name,
          email,
          courseIds: selectedCourse ? [selectedCourse] : [],
          subjectIds: selectedSubject ? [selectedSubject] : [],
        }
      );

      console.log("Student Updated:", response.data);
      alert("Student updated successfully");

      clearForm();
      getStudents();
    } catch (error) {
      console.log("Update Student Error:", error);
      alert("Student update failed");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await api.delete(`/admin/student/${id}`);
      console.log("Student Deleted:", response.data);
      getStudents();
    } catch (error) {
      console.log("Delete Student Error:", error);
      alert("Student delete failed");
    }
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:pr-4";

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 sm:space-y-7 lg:space-y-8">
      {/* Page Header */}
      <section className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 sm:p-3">
          <GraduationCap size={25} className="text-violet-600" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Create and manage students
          </p>
        </div>
      </section>

      {/* Create / Update Form */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
        <div className="mb-5 flex min-w-0 items-start justify-between gap-3 sm:mb-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-xl bg-violet-50 p-2.5">
              <UserPlus size={20} className="text-violet-600" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {editStudentId ? "Update Student" : "Create Student"}
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {editStudentId
                  ? "Update student information"
                  : "Add a new student to the LMS"}
              </p>
            </div>
          </div>

          {editStudentId && (
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
          onSubmit={editStudentId ? handleUpdateStudent : handleCreateStudent}
          className="space-y-5"
        >
          {/* Name + Email */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Student Name
              </label>
              <div className="relative">
                <UserPlus
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          {!editStudentId && (
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Course + Subject */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Course
              </label>
              <div className="relative">
                <BookOpen
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
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

            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Subject
              </label>
              <div className="relative">
                <Library
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    Select Subject
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            {editStudentId && (
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
              {editStudentId ? (
                <>
                  <Pencil size={17} />
                  Update Student
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Create Student
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Students List */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-6">
          <div className="shrink-0 rounded-xl bg-violet-50 p-2.5">
            <Users size={20} className="text-violet-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              All Students
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {students.length} registered student{students.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:p-4 md:hidden">
          {students.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No students found.
            </p>
          ) : (
            students.map((student) => (
              <article
                key={student._id}
                className="min-w-0 rounded-xl border border-slate-200 p-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
                    {student.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-slate-900">
                      {student.name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {student.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Course
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.courseIds?.length > 0 ? (
                        student.courseIds.map((course) => (
                          <span
                            key={course._id}
                            className="max-w-full break-words rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                          >
                            {course.courseName}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">No course</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.subjectIds?.length > 0 ? (
                        student.subjectIds.map((subject) => (
                          <span
                            key={subject._id}
                            className="max-w-full break-words rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700"
                          >
                            {subject.subjectName}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">No subject</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleEditStudent(student)}
                    className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-violet-200 px-2 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(student._id)}
                    className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-2 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Tablet / Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[750px]">
            <thead className="bg-slate-50">
              <tr>
                {["Student", "Email", "Course", "Subject", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className={`whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 lg:px-6 ${
                        heading === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
                          {student.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-400">Student</p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-[220px] break-all px-5 py-4 text-sm text-slate-600 lg:px-6">
                      {student.email}
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {student.courseIds?.length > 0 ? (
                          student.courseIds.map((course) => (
                            <span
                              key={course._id}
                              className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                            >
                              {course.courseName}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">No course</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {student.subjectIds?.length > 0 ? (
                          student.subjectIds.map((subject) => (
                            <span
                              key={subject._id}
                              className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700"
                            >
                              {subject.subjectName}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">No subject</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditStudent(student)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(student._id)}
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

export default Students;

