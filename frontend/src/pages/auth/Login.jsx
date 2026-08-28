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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-[460px] rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
            <Shield className="h-4 w-4" />
            AURA OS Academic Portal
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-white">Sign In</h1>
        <p className="text-xs text-slate-400 text-center mt-2">
          Autonomous Academic Performance & Mentoring Platform
        </p>

        {/* Quick Demo Logins Section */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            ⚡ Quick Demo Logins (Click to Enter)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("mentor", "/mentor/dashboard", "Dr. Suresh R", "mentor@aura.edu")}
              className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-left transition"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                Mentor Portal
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Dr. Suresh R</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("parent", "/parent/dashboard", "Robert Johnson", "parent@aura.edu")}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-left transition"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Users className="h-3.5 w-3.5 shrink-0" />
                Parent Portal
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Parent View</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("student", "/dashboard", "Alex Johnson", "student@aura.edu")}
              className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-left transition"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                Student Portal
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Alex Johnson</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("faculty", "/faculty/dashboard", "Prof. Nithya K", "faculty@aura.edu")}
              className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-950/30 hover:bg-blue-900/40 text-left transition"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                Faculty Portal
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Prof. Nithya K</p>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">College Email</label>
            <input
              type="email"
              placeholder="e.g. mentor@aura.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full aura-btn aura-btn-primary py-3 text-xs font-bold w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In to AURA OS"}
          </button>
        </form>

        {error && <div className="mt-4 text-center text-xs font-semibold text-rose-400">{error}</div>}
        {successMessage && <div className="mt-4 text-center text-xs font-semibold text-emerald-400">{successMessage}</div>}

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link className="text-cyan-400 hover:underline font-semibold" to="/register">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}