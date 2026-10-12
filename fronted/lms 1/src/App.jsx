import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import Teacher from "./pages/admin/teacher";
import Student from "./pages/admin/student";
import Course from "./pages/admin/course";
import Subject from "./pages/admin/subject";

import AdminLayout from "./components/admin/adminLayout";
import AdminProtectedRoute from "./components/admin/adminProtectedRoute";

import TeacherLogin from "./pages/teacher/login";
import Profile from "./pages/teacher/myProfile";
import Courses from "./pages/teacher/myCourses";
import Students from "./pages/teacher/myStudent";
import Assignments from "./pages/teacher/assignments";
import Submissions from "./pages/teacher/submission";
import Attendence from "./pages/teacher/attendence";
import ViewAttendence from "./pages/teacher/viewAttendence";
import Dashboard from "./pages/teacher/Dashboard";

import TeacherLayout from "./components/teacher/teacherLayout";
import TeacherProtectedRoute from "./components/teacher/teacherProtectedRoute";

import StudentLogin from "./pages/student/login";
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./pages/student/dashboard";
import StudentProfile from "./pages/student/profile";
import StudentCourses from "./pages/student/courses";
import StudentSubjects from "./pages/student/subjects";
import StudentAssignments from "./pages/student/assignments";
import StudentAttendance from "./pages/student/attendance";
import ProtectedRoute from "./components/student/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= ADMIN ================= */}

        <Route path="/" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<Teacher />} />
          <Route path="students" element={<Student />} />
          <Route path="courses" element={<Course />} />
          <Route path="subjects" element={<Subject />} />
        </Route>


        {/* ================= TEACHER ================= */}

        <Route
          path="/teacher/login"
          element={<TeacherLogin />}
        />

        <Route
          path="/teacher"
          element={
            <TeacherProtectedRoute>
              <TeacherLayout />
            </TeacherProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="students" element={<Students />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="attendence" element={<Attendence />} />
          <Route
            path="attendance-records"
            element={<ViewAttendence />}
          />
        </Route>


        {/* ================= STUDENT ================= */}

        <Route
          path="/student/login"
          element={<StudentLogin />}
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="profile"
            element={<StudentProfile />}
          />

          <Route
            path="courses"
            element={<StudentCourses />}
          />

          <Route
            path="subjects"
            element={<StudentSubjects />}
          />

          <Route
            path="assignments"
            element={<StudentAssignments />}
          />

          <Route
            path="attendance"
            element={<StudentAttendance />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;