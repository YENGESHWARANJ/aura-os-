import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { updateSettings } from '../../services/settingsService';

const PRIVACY_OPTIONS = [
  {
    key: 'profileVisibility',
    label: 'Profile Visibility',
    description: 'Allow other users and faculty to view your profile page.',
  },
  {
    key: 'activityVisibility',
    label: 'Activity Visibility',
    description: 'Show your academic activity (attendance, assignments) to mentors and faculty.',
  },
  {
    key: 'aiDataUsage',
    label: 'AI Data Usage',
    description: 'Allow AURA OS AI features to access your academic data for personalized insights.',
  },
  {
    key: 'personalization',
    label: 'Personalization',
    description: 'Allow AURA OS to provide personalized recommendations based on your academic history.',
  },
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        checked ? 'border-sky-600 bg-sky-600' : 'border-slate-600 bg-slate-700'
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

export default function PrivacySettings({ settings, onSettingsUpdated }) {
  const [prefs, setPrefs] = useState(
    settings?.privacyPreferences || {
      profileVisibility: true,
      activityVisibility: true,
      aiDataUsage: true,
      personalization: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.privacyPreferences) {
      setPrefs(settings.privacyPreferences);
    }
  }, [settings]);

  const handleToggle = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({ privacyPreferences: prefs });
      if (onSettingsUpdated) onSettingsUpdated(result.data);
      toast.success('✓ Privacy settings updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save privacy settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Privacy Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Control how your data and activity are shared within AURA OS.
        </p>
      </div>

      <div className="space-y-3">
        {PRIVACY_OPTIONS.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-100">{option.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{option.description}</p>
            </div>
            <Toggle
              checked={prefs[option.key] ?? true}
              onChange={(v) => handleToggle(option.key, v)}
              label={option.label}
            />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 px-5 py-4">
        <p className="text-xs text-slate-500">
          Your data is handled according to AURA OS's privacy policy. AI features use anonymized academic data only.
          Disabling AI data usage may reduce recommendation quality.
        </p>
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
          'Save Privacy Settings'
        )}
      </button>
    </div>
  );
}
