import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Bell, Smartphone, Mail, Zap, Shield, CheckCircle2 } from "lucide-react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../../services/notifications/notificationApi";

const CHANNELS = [
  {
    key: "push",
    label: "Mobile Push Notifications",
    description: "Receive instant push alerts on your Android or iOS device even when app is minimized or locked.",
    icon: Smartphone,
    iconColor: "text-purple-400",
  },
  {
    key: "email",
    label: "Email Notifications",
    description: "Receive transactional emails with actionable links to your registered email address.",
    icon: Mail,
    iconColor: "text-emerald-400",
  },
  {
    key: "inApp",
    label: "In-App Real-Time Notifications",
    description: "Receive zero-reload toast notifications and live bell badge updates via Socket.IO.",
    icon: Zap,
    iconColor: "text-cyan-400",
  },
];

const NOTIFICATION_CATEGORIES = [
  {
    key: "assignments",
    label: "Assignments & Submissions",
    description: "Deadlines, approvals, evaluations, and grade releases.",
    locked: false,
  },
  {
    key: "attendance",
    label: "Attendance Alerts",
    description: "Warnings when attendance falls below institutional threshold (75%).",
    locked: false,
  },
  {
    key: "marks",
    label: "Academic Marks & Exam Results",
    description: "Continuous assessment scores and semester examination updates.",
    locked: false,
  },
  {
    key: "messages",
    label: "Mentor & Faculty Messages",
    description: "Direct academic guidance notes, 1-on-1 meeting reminders, and advice.",
    locked: false,
  },
  {
    key: "projects",
    label: "Capstone Projects & Teams",
    description: "Milestone approvals, repo synchronization, and review remarks.",
    locked: false,
  },
  {
    key: "evidence",
    label: "Academic Evidence Wallet",
    description: "Cryptographic credential endorsements, issuer stamps, and verifications.",
    locked: false,
  },
  {
    key: "interventions",
    label: "AI Intervention Recommendations",
    description: "Counterfactual simulator alerts and personalized recovery roadmaps.",
    locked: false,
  },
  {
    key: "announcements",
    label: "Institutional Announcements",
    description: "Campus notices, semester registrations, and academic circulars.",
    locked: false,
  },
  {
    key: "security",
    label: "Security & Account Alerts",
    description: "Critical account logins, password changes, and permission modifications.",
    locked: true,
  },
];

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        disabled
          ? "cursor-not-allowed border-slate-700 bg-slate-700 opacity-60"
          : checked
          ? "border-cyan-500 bg-cyan-600"
          : "border-slate-700 bg-slate-800"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function NotificationSettings() {
  const [channels, setChannels] = useState({ push: true, email: true, inApp: true });
  const [categories, setCategories] = useState({
    assignments: true,
    attendance: true,
    marks: true,
    messages: true,
    projects: true,
    evidence: true,
    interventions: true,
    announcements: true,
    security: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const res = await getNotificationPreferences();
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          if (data.channels) setChannels(data.channels);
          if (data.categories) setCategories({ ...data.categories, security: true });
        }
      } catch (err) {
        console.warn("Could not load notification preferences:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const handleChannelToggle = (key, val) => {
    setChannels((prev) => ({ ...prev, [key]: val }));
  };

  const handleCategoryToggle = (key, val) => {
    setCategories((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotificationPreferences({
        channels,
        categories: { ...categories, security: true },
      });
      toast.success("✓ Multi-channel notification preferences saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save notification preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        <span>Loading notification preferences...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyan-400" />
          Multi-Channel Delivery Preferences
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Control how and where AURA OS reaches you across Mobile Push, Transactional Email, and In-App sockets.
        </p>
      </div>

      {/* 1. Delivery Channels Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Delivery Channels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            const isEnabled = channels[ch.key] ?? true;
            return (
              <div
                key={ch.key}
                className={`rounded-2xl border p-4 transition ${
                  isEnabled
                    ? "border-cyan-500/30 bg-slate-900/80 shadow-[0_0_15px_-3px_rgba(6,182,212,0.1)]"
                    : "border-slate-800 bg-slate-950/40 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                    <Icon className={`h-4 w-4 ${ch.iconColor}`} />
                  </div>
                  <Toggle
                    checked={isEnabled}
                    onChange={(val) => handleChannelToggle(ch.key, val)}
                    label={ch.label}
                  />
                </div>
                <h4 className="text-sm font-bold text-white">{ch.label}</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{ch.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Notification Categories Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Notification Topics & Categories
        </h3>
        <div className="space-y-2">
          {NOTIFICATION_CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition ${
                cat.locked
                  ? "border-slate-800 bg-slate-900/40 opacity-75"
                  : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700/80"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {cat.locked ? (
                    <Shield className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">{cat.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{cat.description}</p>
                  {cat.locked && (
                    <span className="mt-1 inline-block text-[10px] text-amber-400 font-semibold">
                      🔒 Essential institutional notice — cannot be disabled
                    </span>
                  )}
                </div>
              </div>
              <Toggle
                checked={cat.locked ? true : (categories[cat.key] ?? true)}
                onChange={(v) => handleCategoryToggle(cat.key, v)}
                disabled={cat.locked}
                label={cat.label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="aura-btn aura-btn-primary text-xs h-10 px-6 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>
    </div>
  );
}
