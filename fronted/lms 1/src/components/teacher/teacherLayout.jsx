
import { Outlet } from "react-router-dom";
import TeacherNavbar from "./TeacherNavbar";

function TeacherLayout() {
  return (
    <div className="min-h-screen min-w-0 bg-slate-50">
      <TeacherNavbar />

      <main className="min-w-0 pt-16 md:ml-72">
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TeacherLayout;

