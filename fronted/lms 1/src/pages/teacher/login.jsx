
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  BookOpen,
} from "lucide-react";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/teacher/login", {
        email,
        password,
      });

      alert(response.data.msg);
      navigate("/teacher/dashboard");
    } catch (error) {
      console.log("Teacher Login Error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Login failed"
      );
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 sm:text-sm";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-7 text-center sm:mb-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 ring-8 ring-violet-50">
            <GraduationCap
              size={34}
              className="text-violet-600"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Teacher Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your courses and students
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 sm:shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5">
              <BookOpen
                size={21}
                className="text-violet-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500">
                Enter your teacher credentials
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="teacher-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="teacher-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="teacher-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="teacher-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-200 active:scale-[0.99]"
            >
              Login to Dashboard
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Learning Management System
        </p>
      </div>
    </main>
  );
}

export default TeacherLogin;
