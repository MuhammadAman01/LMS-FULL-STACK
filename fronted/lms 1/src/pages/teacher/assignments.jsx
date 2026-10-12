import { useEffect, useState } from "react";
import {
BookOpen,
FileText,
CalendarDays,
Upload,
Plus,
Pencil,
Trash2,
ExternalLink,
X,
LoaderCircle,
Search,
ClipboardList,
Clock,
GraduationCap,
AlertCircle,
RefreshCw,
} from "lucide-react";
import api from "../../services/api";

function Assignments() {
const [assignments, setAssignments] = useState([]);
const [teacher, setTeacher] = useState(null);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [courseId, setCourseId] = useState("");
const [subjectId, setSubjectId] = useState("");
const [dueDate, setDueDate] = useState("");
const [file, setFile] = useState(null);
const [editId, setEditId] = useState(null);
const [loading, setLoading] = useState(true);
const [profileLoading, setProfileLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [deletingId, setDeletingId] = useState(null);
const [error, setError] = useState("");
const [formError, setFormError] = useState("");
const [success, setSuccess] = useState("");
const [searchTerm, setSearchTerm] = useState("");

const getProfile = async () => {
setProfileLoading(true);


try {
  const response = await api.get("/teacher/profile");
  setTeacher(response.data.teacher);
} catch (error) {
  console.log("Profile Error:", error);
  setFormError("Unable to load teacher profile. Please try again.");
} finally {
  setProfileLoading(false);
}


};

const getAssignments = async () => {
setLoading(true);
setError("");


try {
  const response = await api.get("/teacher/Myassignments");
  setAssignments(response.data.assignments || []);
} catch (error) {
  console.log("Assignments Error:", error);
  setError("Unable to load assignments. Please try again.");
} finally {
  setLoading(false);
}


};

useEffect(() => {
getProfile();
getAssignments();
}, []);

const clearForm = () => {
setEditId(null);
setTitle("");
setDescription("");
setCourseId("");
setSubjectId("");
setDueDate("");
setFile(null);
setFormError("");
};

const createAssignment = async (e) => {
e.preventDefault();
setSubmitting(true);
setFormError("");
setSuccess("");


try {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("courseId", courseId);
  formData.append("subjectId", subjectId);
  formData.append("dueDate", dueDate);

  if (file) {
    formData.append("file", file);
  }

  await api.post("/teacher/assignment", formData);

  clearForm();
  setSuccess("Assignment created successfully.");
  await getAssignments();
} catch (error) {
  console.log("Create Assignment Error:", error);
  setFormError(
    error.response?.data?.message || "Failed to create assignment."
  );
} finally {
  setSubmitting(false);
}


};

const editAssignment = (assignment) => {
setEditId(assignment._id);
setTitle(assignment.title || "");
setDescription(assignment.description || "");
setCourseId(
typeof assignment.courseId === "object"
? assignment.courseId?._id || ""
: assignment.courseId || ""
);
setSubjectId(
typeof assignment.subjectId === "object"
? assignment.subjectId?._id || ""
: assignment.subjectId || ""
);
setDueDate(
assignment.dueDate
? new Date(assignment.dueDate).toISOString().split("T")[0]
: ""
);
setFile(null);
setFormError("");
setSuccess("");
window.scrollTo({ top: 0, behavior: "smooth" });
};

const updateAssignment = async (e) => {
e.preventDefault();
setSubmitting(true);
setFormError("");
setSuccess("");

try {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("courseId", courseId);
  formData.append("subjectId", subjectId);
  formData.append("dueDate", dueDate);

  if (file) {
    formData.append("file", file);
  }

  await api.patch(`/teacher/assignment/${editId}`, formData);

  clearForm();
  setSuccess("Assignment updated successfully.");
  await getAssignments();
} catch (error) {
  console.log("Update Assignment Error:", error);
  setFormError(
    error.response?.data?.message || "Failed to update assignment."
  );
} finally {
  setSubmitting(false);
}


};

const deleteAssignment = async (id) => {
const confirmed = window.confirm(
"Are you sure you want to delete this assignment?"
);

if (!confirmed) return;

setDeletingId(id);
setError("");
setSuccess("");

try {
  await api.delete(`/teacher/assignment/${id}`);

  setAssignments((previous) =>
    previous.filter((assignment) => assignment._id !== id)
  );

  if (editId === id) clearForm();

  setSuccess("Assignment deleted successfully.");
} catch (error) {
  console.log("Delete Error:", error);
  setError(
    error.response?.data?.message || "Failed to delete assignment."
  );
} finally {
  setDeletingId(null);
}

};

const getCourseName = (assignment) => {
if (assignment.courseName) return assignment.courseName;


if (typeof assignment.courseId === "object") {
  return assignment.courseId?.courseName || "Course";
}

return (
  teacher?.courseIds?.find((course) => course._id === assignment.courseId)
    ?.courseName || "Course"
);


};

const getSubjectName = (assignment) => {
if (assignment.subjectName) return assignment.subjectName;


if (typeof assignment.subjectId === "object") {
  return assignment.subjectId?.subjectName || "Subject";
}

return (
  teacher?.subjectIds?.find(
    (subject) => subject._id === assignment.subjectId
  )?.subjectName || "Subject"
);


};

const formatDate = (date) => {
if (!date) return "No due date";


const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

return parsedDate.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

};

const isOverdue = (date) => {
if (!date) return false;


const due = new Date(date);
const today = new Date();

due.setHours(23, 59, 59, 999);
today.setHours(0, 0, 0, 0);

return due < today;


};

const filteredAssignments = assignments.filter((assignment) => {
const search = searchTerm.toLowerCase();


return (
  (assignment.title || "").toLowerCase().includes(search) ||
  (assignment.description || "").toLowerCase().includes(search) ||
  getCourseName(assignment).toLowerCase().includes(search) ||
  getSubjectName(assignment).toLowerCase().includes(search)
);

});

if (profileLoading) {
return ( <div className="flex min-h-72 items-center justify-center"> <LoaderCircle className="h-8 w-8 animate-spin text-violet-600" /> </div>
);
}

if (!teacher) {
return ( <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"> <AlertCircle className="mx-auto mb-3 h-10 w-10 text-rose-500" /> <h2 className="text-lg font-bold text-slate-800">
Unable to load teacher profile </h2> <button
       onClick={getProfile}
       className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
     > <RefreshCw size={16} />
Try Again </button> </div>
);
}

return ( <div className="min-w-0 space-y-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600"> <ClipboardList size={17} />
Teacher Workspace </div> <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
Assignments </h1> <p className="mt-1 text-sm text-slate-500 sm:text-base">
Create, manage, and organize your course assignments. </p> </div>

    <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
        <FileText size={21} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">
          Total Assignments
        </p>
        <p className="text-xl font-bold text-slate-900">
          {assignments.length}
        </p>
      </div>
    </div>
  </div>

  {success && (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      <ClipboardList size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1">{success}</p>
      <button onClick={() => setSuccess("")} aria-label="Dismiss message">
        <X size={17} />
      </button>
    </div>
  )}

  {error && (
    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1">{error}</p>
      <button onClick={getAssignments} className="font-semibold underline">
        Retry
      </button>
    </div>
  )}

  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-5 sm:px-7">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
          {editId ? <Pencil size={21} /> : <Plus size={21} />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {editId ? "Edit Assignment" : "Create Assignment"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {editId
              ? "Update the assignment details below."
              : "Fill in the details to publish a new assignment."}
          </p>
        </div>
      </div>
    </div>

    <form
      onSubmit={editId ? updateAssignment : createAssignment}
      className="space-y-5 p-5 sm:p-7"
    >
      {formError && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Assignment Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Explain the assignment instructions and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Course <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <BookOpen
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            >
              <option value="">Select Course</option>
              {(teacher.courseIds || []).map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Subject <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            >
              <option value="">Select Subject</option>
              {(teacher.subjectIds || []).map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Due Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Attachment (Optional)
          </label>
          <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-violet-400 hover:bg-violet-50/50">
            <Upload size={19} className="shrink-0 text-violet-600" />
            <span className="min-w-0 flex-1 truncate text-sm text-slate-600">
              {file ? file.name : "Choose a file to upload"}
            </span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="sr-only"
            />
          </label>
          <p className="mt-1.5 text-xs text-slate-400">
            {editId
              ? "Leave empty to keep the existing attachment."
              : "Attach a file if your assignment requires one."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        {editId && (
          <button
            type="button"
            onClick={clearForm}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <X size={17} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : editId ? (
            <Pencil size={17} />
          ) : (
            <Plus size={18} />
          )}
          {submitting
            ? "Saving..."
            : editId
              ? "Update Assignment"
              : "Create Assignment"}
        </button>
      </div>
    </form>
  </section>

  <section className="space-y-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          My Assignments
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View and manage assignments you have created.
        </p>
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assignments..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>
    </div>

    {loading ? (
      <div className="flex min-h-52 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-violet-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading assignments...
          </p>
        </div>
      </div>
    ) : filteredAssignments.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <ClipboardList size={27} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          {searchTerm ? "No matching assignments" : "No assignments yet"}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {searchTerm
            ? "Try another search term to find your assignment."
            : "Create your first assignment using the form above. Your assignments will appear here."}
        </p>
      </div>
    ) : (
      <>
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredAssignments.length}
          </span>{" "}
          of {assignments.length} assignments
        </p>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredAssignments.map((assignment) => {
            const overdue = isOverdue(assignment.dueDate);

            return (
              <article
                key={assignment._id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FileText size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                      {assignment.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {getCourseName(assignment)}
                    </p>
                    <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <BookOpen size={13} />
                      <span className="break-words">
                        {getSubjectName(assignment)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="line-clamp-3 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                    {assignment.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                        overdue
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <CalendarDays size={15} />
                      Due: {formatDate(assignment.dueDate)}
                    </span>

                    {overdue && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        <Clock size={14} />
                        Overdue
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    {assignment.fileUrl ? (
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 sm:justify-start"
                      >
                        <ExternalLink size={16} />
                        View Attachment
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                        <FileText size={16} />
                        No attachment
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editAssignment(assignment)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:flex-none"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteAssignment(assignment._id)}
                        disabled={deletingId === assignment._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                      >
                        {deletingId === assignment._id ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </>
    )}
  </section>
</div>


);
}

export default Assignments;
