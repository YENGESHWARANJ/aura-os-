import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { Shield, UserCheck, GraduationCap, Users, BookOpen, Check } from "lucide-react";

const ROLES = [
  { id: "student", label: "Student", icon: UserCheck, desc: "Track academics, attendance & AI study plans", color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-400" },
  { id: "mentor", label: "Mentor", icon: GraduationCap, desc: "Guide assigned students, manage risk & goals", color: "border-purple-500/40 bg-purple-950/20 text-purple-400" },
  { id: "parent", label: "Parent", icon: Users, desc: "Monitor child's progress, attendance & alerts", color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-400" },
  { id: "faculty", label: "Faculty", icon: BookOpen, desc: "Manage course classes, marks & assignments", color: "border-blue-500/40 bg-blue-950/20 text-blue-400" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });

      if (data?.success) {
        toast.success(data.message || "Account created successfully! Please sign in.");
        navigate("/login", { replace: true });
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4ff] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-violet-200/80 bg-white/80 shadow-[0_30px_80px_rgba(76,29,149,0.12)] backdrop-blur-xl">
        <div className="hidden w-[42%] flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(107,70,193,0.2),_transparent_38%),linear-gradient(135deg,#241b45_0%,#171425_25%,#111827_100%)] p-8 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/15">
              <Shield className="h-5 w-5 text-violet-200" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-200/80">AURA OS</p>
              <p className="text-sm text-white/80">Account Setup</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-violet-300/40 bg-violet-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-100">
              New profile
            </div>
            <div>
              <h1 className="max-w-sm text-4xl font-semibold tracking-[-0.06em] text-white">
                Build a clearer path to academic success.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                Create a role-based account and connect your academic workspace to the insights that matter most.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            Your account can be shaped for student, mentor, parent, or faculty workflows.
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-[58%] lg:p-10">
          <div className="w-full max-w-lg">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 ring-1 ring-violet-200">
                <Shield className="h-3.5 w-3.5" />
                AURA OS
              </div>
              <Link to="/login" className="text-xs font-semibold text-slate-500 transition hover:text-violet-700">
                Sign in
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900">Create account</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose your role and set up your academic profile.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Select your role
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`relative rounded-2xl border p-3 text-left transition ${
                          isSelected
                            ? "border-violet-300 bg-violet-50 shadow-[0_10px_30px_rgba(124,58,237,0.08)]"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-white">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${r.color.split(" ")[2]}`} />
                          <span className="text-xs font-semibold text-slate-900">{r.label}</span>
                        </div>
                        <p className="mt-2 text-[10px] leading-snug text-slate-500">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  College email
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex@aura.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  required
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
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#4f46e5_100%)] px-4 py-3 text-sm font-semibold tracking-[0.02em] text-white shadow-[0_16px_30px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-80"
                disabled={loading}
              >
                {loading ? "Creating account..." : `Register as ${role.toUpperCase()}`}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link className="font-semibold text-violet-700 transition hover:text-violet-800" to="/login">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
