
import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

function StudentLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />

      <main className="min-h-screen min-w-0 md:ml-64">
        <div className="min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;

