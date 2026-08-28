import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, Bell } from 'lucide-react';
import { updateSettings } from '../../services/settingsService';

const NOTIFICATION_CATEGORIES = [
  {
    key: 'academic',
    label: 'Academic Notifications',
    description: 'Receive updates about academic activities and announcements.',
    locked: false,
  },
  {
    key: 'assignments',
    label: 'Assignment Notifications',
    description: 'Receive notifications about assignment deadlines and grades.',
    locked: false,
  },
  {
    key: 'attendance',
    label: 'Attendance Alerts',
    description: 'Get notified when your attendance drops below the threshold.',
    locked: false,
  },
  {
    key: 'exams',
    label: 'Exam Reminders',
    description: 'Receive reminders for upcoming examinations and results.',
    locked: false,
  },
  {
    key: 'mentorMessages',
    label: 'Mentor Messages',
    description: 'Get notified when your mentor sends you a message or update.',
    locked: false,
  },
  {
    key: 'aiRecommendations',
    label: 'AI Recommendations',
    description: 'Allow AURA OS AI to send personalized learning recommendations.',
    locked: false,
  },
  {
    key: 'systemNotifications',
    label: 'System Notifications',
    description: 'Receive platform updates and system announcements.',
    locked: false,
  },
  {
    key: 'securityAlerts',
    label: 'Security Alerts',
    description: 'Receive important account security notifications. Cannot be disabled.',
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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        disabled
          ? 'cursor-not-allowed border-slate-700 bg-slate-700'
          : checked
          ? 'border-sky-600 bg-sky-600'
          : 'border-slate-600 bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function NotificationSettings({ settings, onSettingsUpdated }) {
  const [prefs, setPrefs] = useState(
    settings?.notificationPreferences || {
      academic: true,
      assignments: true,
      attendance: true,
      exams: true,
      mentorMessages: true,
      aiRecommendations: true,
      systemNotifications: true,
      securityAlerts: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.notificationPreferences) {
      setPrefs({ ...settings.notificationPreferences, securityAlerts: true });
    }
  }, [settings]);

  const handleToggle = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({
        notificationPreferences: { ...prefs, securityAlerts: true },
      });
      if (onSettingsUpdated) onSettingsUpdated(result.data);
      toast.success('✓ Notification preferences saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save notification preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
        <p className="mt-1 text-sm text-slate-400">
          Control what notifications you receive from AURA OS.
        </p>
      </div>

      <div className="space-y-3">
        {NOTIFICATION_CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition ${
              cat.locked
                ? 'border-slate-700/50 bg-slate-900/30 opacity-70'
                : 'border-slate-800 bg-slate-900/50'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <Bell
                size={16}
                className={`mt-0.5 shrink-0 ${cat.locked ? 'text-slate-500' : 'text-sky-400'}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100">{cat.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{cat.description}</p>
                {cat.locked && (
                  <p className="mt-1 text-[10px] text-amber-500 font-medium">🔒 Required — cannot be disabled</p>
                )}
              </div>
            </div>
            <Toggle
              checked={cat.locked ? true : (prefs[cat.key] ?? true)}
              onChange={(v) => handleToggle(cat.key, v)}
              disabled={cat.locked}
              label={cat.label}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        {saving ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Saving...
          </>
        ) : (
          'Save Notification Preferences'
        )}
      </button>
    </div>
  );
}
