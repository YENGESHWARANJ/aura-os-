import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { loginSuccess, setAuthError, setAuthLoading } from "../../redux/slices/authSlice";
import { Shield, UserCheck, GraduationCap, Users, BookOpen } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    dispatch(setAuthLoading(true));

    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data?.success) {
        const accessToken = data.token;
        const user = data.user || null;
        const refreshToken = data.refreshToken || null;

        dispatch(loginSuccess({ accessToken, refreshToken, user }));
        setSuccessMessage(data.message || "Login successful");

        // Redirect based on role
        if (user?.role === "mentor") navigate("/mentor/dashboard", { replace: true });
        else if (user?.role === "parent") navigate("/parent/dashboard", { replace: true });
        else if (user?.role === "faculty") navigate("/faculty/dashboard", { replace: true });
        else navigate("/dashboard", { replace: true });
      } else {
        dispatch(setAuthError(data.message || "Login failed"));
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Network error";
      dispatch(setAuthError(errorMessage));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  // Quick Demo Login Handler
  const handleDemoLogin = (role, targetPath, name, demoEmail) => {
    const demoUser = {
      _id: `demo-${role}-id`,
      name: name,
      email: demoEmail,
      role: role,
    };
    dispatch(
      loginSuccess({
        accessToken: "demo-jwt-token",
        refreshToken: "demo-refresh-token",
        user: demoUser,
      })
    );
    navigate(targetPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f6f4ff] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-violet-200/80 bg-white/80 shadow-[0_30px_80px_rgba(76,29,149,0.12)] backdrop-blur-xl">
        <div className="hidden w-[44%] flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_38%),linear-gradient(135deg,#1f1639_0%,#120f1e_30%,#0e1527_100%)] p-8 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/15">
              <Shield className="h-5 w-5 text-violet-200" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-200/80">AURA OS</p>
              <p className="text-sm text-white/80">Academic Intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-violet-300/40 bg-violet-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-100">
              Student Success Platform
            </div>
            <div>
              <h1 className="max-w-sm text-4xl font-semibold tracking-[-0.06em] text-white">
                Smarter academic guidance for every learner.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                Monitor performance, reduce risk early, and empower mentoring with real-time academic insight.
              </p>
            </div>
            <div className="grid gap-3 pt-2">
              {[
                { icon: UserCheck, label: "Personalised insights" },
                { icon: BookOpen, label: "Progress tracking" },
                { icon: GraduationCap, label: "Mentor collaboration" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-300">
            Built for mentors, students, parents, and faculty.
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-[56%] lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 ring-1 ring-violet-200">
                <Shield className="h-3.5 w-3.5" />
                AURA OS
              </div>
              <Link to="/register" className="text-xs font-semibold text-slate-500 transition hover:text-violet-700">
                Create account
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your academic portal.
              </p>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Quick demo access
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("mentor", "/mentor/dashboard", "Dr. Suresh R", "mentor@aura.edu")}
                  className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-left transition hover:border-violet-300 hover:bg-violet-100"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-700">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Mentor
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Dr. Suresh R</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("parent", "/parent/dashboard", "Robert Johnson", "parent@aura.edu")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-left transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <Users className="h-3.5 w-3.5" />
                    Parent
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Parent view</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("student", "/dashboard", "Alex Johnson", "student@aura.edu")}
                  className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5 text-left transition hover:border-cyan-300 hover:bg-cyan-100"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-700">
                    <UserCheck className="h-3.5 w-3.5" />
                    Student
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Alex Johnson</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("faculty", "/faculty/dashboard", "Prof. Nithya K", "faculty@aura.edu")}
                  className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-left transition hover:border-sky-300 hover:bg-sky-100"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700">
                    <BookOpen className="h-3.5 w-3.5" />
                    Faculty
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Prof. Nithya K</p>
                </button>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  College email
                </label>
                <input
                  type="email"
                  placeholder="e.g. mentor@aura.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_100%)] px-4 py-3 text-sm font-semibold tracking-[0.02em] text-white shadow-[0_16px_30px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-80"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In to AURA OS"}
              </button>
            </form>

            {error && <div className="mt-4 text-center text-xs font-semibold text-rose-500">{error}</div>}
            {successMessage && <div className="mt-4 text-center text-xs font-semibold text-emerald-600">{successMessage}</div>}

            <div className="mt-6 text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link className="font-semibold text-violet-700 transition hover:text-violet-800" to="/register">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}