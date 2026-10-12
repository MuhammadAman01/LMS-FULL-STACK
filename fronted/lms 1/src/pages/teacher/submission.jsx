import { useEffect, useState } from "react";
import {
ClipboardCheck,
GraduationCap,
BookOpen,
Search,
FileText,
ExternalLink,
CheckCircle2,
Clock,
MessageSquare,
Award,
LoaderCircle,
AlertCircle,
RefreshCw,
X,
Send,
Mail,
Filter,
} from "lucide-react";
import api from "../../services/api";

function Submissions() {
const [teacher, setTeacher] = useState(null);
const [submissions, setSubmissions] = useState([]);
const [selectedCourse, setSelectedCourse] = useState("");
const [selectedSubject, setSelectedSubject] = useState("");
const [marks, setMarks] = useState({});
const [feedback, setFeedback] = useState({});
const [profileLoading, setProfileLoading] = useState(true);
const [loading, setLoading] = useState(false);
const [gradingId, setGradingId] = useState(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [hasSearched, setHasSearched] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [gradeFilter, setGradeFilter] = useState("all");

const getProfile = async () => {
setProfileLoading(true);


try {
  const response = await api.get("/teacher/profile");
  setTeacher(response.data.teacher);
} catch (error) {
  console.log("Profile Error:", error);
  setError("Unable to load teacher profile. Please try again.");
} finally {
  setProfileLoading(false);
}


};

const getSubmissions = async () => {
if (!selectedCourse || !selectedSubject) {
setError("Please select both a course and a subject.");
return;
}


setLoading(true);
setError("");
setSuccess("");
setHasSearched(true);

try {
  const response = await api.get(
    `/teacher/submission?courseId=${selectedCourse}&subjectId=${selectedSubject}`
  );

  const result = response.data.submissions || [];
  setSubmissions(result);

  setMarks((previous) => {
    const updated = { ...previous };

    result.forEach((submission) => {
      if (updated[submission._id] === undefined) {
        updated[submission._id] =
          submission.marks === null || submission.marks === undefined
            ? ""
            : String(submission.marks);
      }
    });

    return updated;
  });

  setFeedback((previous) => {
    const updated = { ...previous };

    result.forEach((submission) => {
      if (updated[submission._id] === undefined) {
        updated[submission._id] = submission.feedback || "";
      }
    });

    return updated;
  });
} catch (error) {
  console.log("Submissions Error:", error);
  setError(
    error.response?.data?.message || "Unable to load submissions."
  );
  setSubmissions([]);
} finally {
  setLoading(false);
}


};

const gradeSubmission = async (submissionId) => {
const submissionMarks = marks[submissionId];


if (submissionMarks === "" || submissionMarks === undefined) {
  setError("Please enter marks before submitting the grade.");
  return;
}

if (!Number.isFinite(Number(submissionMarks)) || Number(submissionMarks) < 0) {
  setError("Marks must be a valid non-negative number.");
  return;
}

setGradingId(submissionId);
setError("");
setSuccess("");

try {
  const response = await api.post(
    `/teacher/submission/${submissionId}`,
    {
      marks: Number(submissionMarks),
      feedback: feedback[submissionId] || "",
    }
  );

  setSuccess(response.data?.message || "Submission graded successfully.");
  await getSubmissions();
} catch (error) {
  console.log("Grade Error:", error);
  setError(error.response?.data?.message || "Failed to grade submission.");
} finally {
  setGradingId(null);
}


};

useEffect(() => {
getProfile();
}, []);

const filteredSubmissions = submissions.filter((submission) => {
const studentName = submission.studentId?.name || "";
const studentEmail = submission.studentId?.email || "";
const assignmentTitle = submission.assignmentId?.title || "";
const search = searchTerm.toLowerCase();

const matchesSearch =
  studentName.toLowerCase().includes(search) ||
  studentEmail.toLowerCase().includes(search) ||
  assignmentTitle.toLowerCase().includes(search);

const isGraded =
  submission.marks !== null && submission.marks !== undefined;

const matchesFilter =
  gradeFilter === "all" ||
  (gradeFilter === "graded" && isGraded) ||
  (gradeFilter === "pending" && !isGraded);

return matchesSearch && matchesFilter;


});

const gradedCount = submissions.filter(
(submission) =>
submission.marks !== null && submission.marks !== undefined
).length;

const pendingCount = submissions.length - gradedCount;

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

return ( <div className="min-w-0 space-y-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600"> <ClipboardCheck size={17} />
Teacher Workspace </div> <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
Student Submissions </h1> <p className="mt-1 text-sm text-slate-500 sm:text-base">
Review student work, assign marks, and provide feedback. </p> </div>


    <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
        <FileText size={21} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">
          Total Submissions
        </p>
        <p className="text-xl font-bold text-slate-900">
          {submissions.length}
        </p>
      </div>
    </div>
  </div>

  {success && (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
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
      <button
        onClick={() => setError("")}
        aria-label="Dismiss error"
        className="shrink-0"
      >
        <X size={17} />
      </button>
    </div>
  )}

  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
        <Filter size={21} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Find Submissions
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Select a course and subject to view student submissions.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Course
        </label>
        <div className="relative">
          <BookOpen
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSubmissions([]);
              setHasSearched(false);
              setError("");
              setSuccess("");
            }}
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
          Subject
        </label>
        <div className="relative">
          <GraduationCap
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSubmissions([]);
              setHasSearched(false);
              setError("");
              setSuccess("");
            }}
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
    </div>

    <button
      onClick={getSubmissions}
      disabled={loading || !selectedCourse || !selectedSubject}
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <Search size={18} />
      )}
      {loading ? "Loading Submissions..." : "View Submissions"}
    </button>
  </section>

  {hasSearched && !loading && (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total Submissions
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {submissions.length}
            </p>
          </div>
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <FileText size={22} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Graded</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {gradedCount}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Pending Grading
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Clock size={22} />
          </div>
        </div>
      </div>
    </div>
  )}

  <section className="space-y-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Submissions List
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review, grade, and provide feedback to students.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <div className="relative w-full sm:w-60">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or assignment"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:w-40"
        >
          <option value="all">All Submissions</option>
          <option value="graded">Graded</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    {!hasSearched ? (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <ClipboardCheck size={27} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          Select a course and subject
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Choose your course and subject above, then click View Submissions
          to see student work.
        </p>
      </div>
    ) : loading ? (
      <div className="flex min-h-52 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-violet-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading submissions...
          </p>
        </div>
      </div>
    ) : filteredSubmissions.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <FileText size={27} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          {submissions.length === 0
            ? "No submissions found"
            : "No matching submissions"}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {submissions.length === 0
            ? "No students have submitted work for this course and subject yet."
            : "Try changing your search term or grading filter."}
        </p>
        {submissions.length === 0 && (
          <button
            onClick={getSubmissions}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        )}
      </div>
    ) : (
      <>
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredSubmissions.length}
          </span>{" "}
          of {submissions.length} submissions
        </p>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredSubmissions.map((submission) => {
            const isGraded =
              submission.marks !== null &&
              submission.marks !== undefined;

            return (
              <article
                key={submission._id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <GraduationCap size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
                      {submission.studentId?.name || "Unknown Student"}
                    </h3>
                    <p className="mt-1 flex min-w-0 items-center gap-2 break-all text-sm text-slate-500">
                      <Mail size={14} className="shrink-0" />
                      {submission.studentId?.email || "No email available"}
                    </p>
                    <span
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isGraded
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {isGraded ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      {isGraded ? "Graded" : "Pending Grading"}
                    </span>
                  </div>

                  <div className="shrink-0 rounded-xl bg-slate-50 p-2.5 text-slate-500">
                    <ClipboardCheck size={20} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-4 p-5 sm:p-6">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Assignment
                    </p>
                    <p className="break-words text-sm font-semibold text-slate-800">
                      {submission.assignmentId?.title || "Untitled Assignment"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <MessageSquare size={15} />
                      Student Comment
                    </p>
                    <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                      {submission.comment || "No comment provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Current Marks
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <Award size={18} className="text-violet-600" />
                        {isGraded ? submission.marks : "Not graded"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Current Feedback
                      </p>
                      <p className="mt-1 break-words text-sm leading-5 text-slate-700">
                        {submission.feedback || "No feedback provided"}
                      </p>
                    </div>
                  </div>

                  {submission.fileUrl && (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 sm:justify-start"
                    >
                      <ExternalLink size={16} />
                      View Student File
                    </a>
                  )}

                  <div className="mt-auto space-y-4 border-t border-slate-100 pt-5">
                    <h4 className="text-sm font-bold text-slate-800">
                      {isGraded ? "Update Grade" : "Grade Submission"}
                    </h4>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Marks
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Enter marks"
                        value={marks[submission._id] ?? ""}
                        onChange={(e) =>
                          setMarks((previous) => ({
                            ...previous,
                            [submission._id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Feedback
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Write feedback for the student..."
                        value={feedback[submission._id] ?? ""}
                        onChange={(e) =>
                          setFeedback((previous) => ({
                            ...previous,
                            [submission._id]: e.target.value,
                          }))
                        }
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => gradeSubmission(submission._id)}
                      disabled={gradingId === submission._id}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {gradingId === submission._id ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <Send size={17} />
                      )}
                      {gradingId === submission._id
                        ? "Saving Grade..."
                        : isGraded
                          ? "Update Grade"
                          : "Grade Submission"}
                    </button>
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

export default Submissions;
