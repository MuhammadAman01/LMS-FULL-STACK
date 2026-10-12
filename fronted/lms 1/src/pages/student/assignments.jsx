
import { useEffect, useState } from "react";
import {
  ClipboardList,
  BookOpen,
  BookMarked,
  CalendarDays,
  Download,
  Upload,
  FileText,
  MessageSquare,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import api from "../../services/api";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const getAssignments = async () => {
    try {
      const response = await api.get("/student/Assignments");
      setAssignments(response.data.assignment || []);
    } catch (error) {
      console.log("Assignments Error:", error);
      throw error;
    }
  };

  const getSubmissions = async () => {
    try {
      const response = await api.get("/student/submits");
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.log("Submissions Error:", error);
      throw error;
    }
  };

  const loadData = async () => {
    setPageLoading(true);
    setError("");

    try {
      await Promise.all([getAssignments(), getSubmissions()]);
    } catch (error) {
      setError("Unable to load assignments. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSubmission = (assignmentId) =>
    submissions.find(
      (submission) =>
        submission.assignmentId?._id === assignmentId ||
        submission.assignmentId === assignmentId
    );

  const openSubmitForm = (assignment) => {
    setSelectedAssignment(assignment);
    setEditingSubmission(null);
    setFile(null);
    setComment("");
  };

  const openEditForm = (submission, assignment) => {
    setEditingSubmission(submission);
    setSelectedAssignment(assignment);
    setFile(null);
    setComment(submission.comment || "");
  };

  const closeForm = () => {
    setSelectedAssignment(null);
    setEditingSubmission(null);
    setFile(null);
    setComment("");
  };

  const submitAssignment = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("assignmentId", selectedAssignment._id);
      formData.append("comment", comment);
      formData.append("file", file);

      const response = await api.post("/student/submit", formData);

      alert(response.data.msg);
      closeForm();
      await getSubmissions();
    } catch (error) {
      console.log("Submit Error:", error);
      alert(error.response?.data?.msg || "Assignment submission failed");
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("comment", comment);

      if (file) {
        formData.append("file", file);
      }

      const response = await api.patch(
        `/student/submit/${editingSubmission._id}`,
        formData
      );

      alert(response.data.msg);
      closeForm();
      await getSubmissions();
    } catch (error) {
      console.log("Update Error:", error);
      alert(error.response?.data?.msg || "Submission update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (submissionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/student/submit/${submissionId}`);
      alert(response.data.msg);
      await getSubmissions();
    } catch (error) {
      console.log("Delete Error:", error);
      alert(error.response?.data?.msg || "Submission deletion failed");
    }
  };

  const formatDate = (date) => {
    if (!date) return "No due date";
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const isOverdue = (date) => {
    if (!date) return false;

    const due = new Date(date);
    if (Number.isNaN(due.getTime())) return false;

    due.setHours(23, 59, 59, 999);
    return due < new Date();
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const submission = getSubmission(assignment._id);
    const searchText = search.toLowerCase();

    const matchesSearch = [
      assignment.title,
      assignment.description,
      assignment.courseId?.courseName,
      assignment.subjectId?.subjectName
    ].some((value) => String(value || "").toLowerCase().includes(searchText));

    const matchesFilter =
      filter === "all" ||
      (filter === "submitted" && submission) ||
      (filter === "pending" && !submission);

    return matchesSearch && matchesFilter;
  });

  const submittedCount = assignments.filter(
    (assignment) => getSubmission(assignment._id)
  ).length;

  const pendingCount = assignments.length - submittedCount;

  const stats = [
    {
      label: "Total Assignments",
      value: assignments.length,
      icon: ClipboardList,
      color: "bg-violet-100 text-violet-600"
    },
    {
      label: "Submitted",
      value: submittedCount,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              STUDENT PORTAL
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Assignments
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              View your assigned work, submit files and manage your submissions.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={pageLoading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-60"
          >
            <RefreshCw size={16} className={pageLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
                <FileText size={26} />
              </div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Stay on top of your work
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                Keep track of deadlines, submit your assignments and review your submission status.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:min-w-44">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Pending work</p>
                <p className="mt-1 text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center">
            <AlertCircle className="mx-auto text-rose-500" size={30} />
            <p className="mt-3 font-semibold text-slate-900">
              Assignments unavailable
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={loadData}
              className="mt-4 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                          {pageLoading ? "—" : stat.value}
                        </p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                        <Icon size={23} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Assignment List</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search assignments or filter by submission status.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assignments..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:min-w-64 lg:w-72"
                />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:w-auto"
                >
                  <option value="all">All Assignments</option>
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {pageLoading ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading assignments...
                </p>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <ClipboardList size={30} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {assignments.length === 0
                    ? "No assignments available"
                    : "No matching assignments"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {assignments.length === 0
                    ? "Your assignments will appear here when your teachers publish them."
                    : "Try changing your search or submission filter."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filteredAssignments.map((assignment) => {
                  const submission = getSubmission(assignment._id);
                  const overdue = !submission && isOverdue(assignment.dueDate);

                  return (
                    <article
                      key={assignment._id}
                      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="border-b border-slate-100 p-5 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                              <ClipboardList size={22} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="break-words text-lg font-bold text-slate-900">
                                {assignment.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {assignment.courseId?.courseName || "Course"}
                                {assignment.subjectId?.subjectName
                                  ? ` · ${assignment.subjectId.subjectName}`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              submission
                                ? "bg-emerald-50 text-emerald-700"
                                : overdue
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {submission ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                            {submission
                              ? "Submitted"
                              : overdue
                              ? "Past Due"
                              : "Pending"}
                          </span>
                        </div>

                        <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                          {assignment.description || "No description provided."}
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3">
                            <BookOpen size={18} className="mt-0.5 shrink-0 text-violet-600" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-400">
                                Course
                              </p>
                              <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                                {assignment.courseId?.courseName || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3">
                            <BookMarked size={18} className="mt-0.5 shrink-0 text-violet-600" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-400">
                                Subject
                              </p>
                              <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                                {assignment.subjectId?.subjectName || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 sm:col-span-2">
                            <CalendarDays size={18} className="mt-0.5 shrink-0 text-violet-600" />
                            <div>
                              <p className="text-xs font-medium text-slate-400">
                                Due Date
                              </p>
                              <p className={`mt-1 text-sm font-semibold ${overdue ? "text-rose-600" : "text-slate-700"}`}>
                                {formatDate(assignment.dueDate)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {assignment.fileUrl && (
                          <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 sm:w-fit"
                          >
                            <Download size={17} />
                            Download Assignment
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        {submission ? (
                          <>
                            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                              <CheckCircle2 size={18} />
                              Your submission
                            </div>

                            {submission.comment && (
                              <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                                <MessageSquare size={17} className="mt-0.5 shrink-0 text-slate-400" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-400">
                                    Your Comment
                                  </p>
                                  <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-slate-700">
                                    {submission.comment}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                              {submission.fileUrl && (
                                <a
                                  href={submission.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
                                >
                                  <FileText size={17} />
                                  View Submission
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => openEditForm(submission, assignment)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                              >
                                <Pencil size={16} />
                                Edit Submission
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteSubmission(submission._id)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm leading-6 text-slate-500">
                              You have not submitted this assignment yet. Upload your work when it is ready.
                            </p>
                            <button
                              type="button"
                              onClick={() => openSubmitForm(assignment)}
                              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:w-fit"
                            >
                              <Upload size={17} />
                              Submit Assignment
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {selectedAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !loading) closeForm();
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-4 bg-slate-950 p-5 text-white sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600">
                  {editingSubmission ? <Pencil size={21} /> : <Upload size={21} />}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold sm:text-xl">
                    {editingSubmission ? "Edit Submission" : "Submit Assignment"}
                  </h2>
                  <p className="mt-1 break-words text-sm text-slate-400">
                    {selectedAssignment.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={loading}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={editingSubmission ? updateSubmission : submitAssignment}
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="assignment-file"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {editingSubmission ? "Replace File (Optional)" : "Assignment File"}
                </label>

                <label
                  htmlFor="assignment-file"
                  className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center transition hover:border-violet-400 hover:bg-violet-50/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Upload size={23} />
                  </div>
                  <span className="mt-3 break-all text-sm font-semibold text-slate-700">
                    {file ? file.name : "Choose a file to upload"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    {editingSubmission
                      ? "Leave empty to keep your current file"
                      : "Select the file you want to submit"}
                  </span>
                  <input
                    id="assignment-file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required={!editingSubmission}
                    className="sr-only"
                  />
                </label>
              </div>

              <div>
                <label
                  htmlFor="assignment-comment"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Comment
                </label>
                <textarea
                  id="assignment-comment"
                  placeholder="Enter your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : editingSubmission ? (
                    "Update Submission"
                  ) : (
                    "Submit Assignment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignments;

