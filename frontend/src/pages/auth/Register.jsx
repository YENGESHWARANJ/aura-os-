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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-[520px] rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
            <Shield className="h-4 w-4" />
            AURA OS Account Creation
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-white">Create Account</h1>
        <p className="text-xs text-slate-400 text-center mt-2">
          Select your portal role to customize your academic workspace
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Step 1: Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Your Role
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
                    className={`p-3 rounded-2xl border text-left transition relative ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${r.color.split(" ")[2]}`} />
                      <span className="text-xs font-bold text-white">{r.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
            <input
              type="email"
              placeholder="e.g. alex@aura.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full aura-btn aura-btn-primary py-3 text-xs font-bold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : `Register as ${role.toUpperCase()}`}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link className="text-cyan-400 hover:underline font-semibold" to="/login">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
