import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { updateSettings } from '../../services/settingsService';

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 transition focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30';

function FieldGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</label>
      {children}
    </div>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

export default function PreferencesSettings({ settings, onSettingsUpdated }) {
  const [prefs, setPrefs] = useState({
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setPrefs({
        language: settings.language || 'en',
        timezone: settings.timezone || 'Asia/Kolkata',
        dateFormat: settings.dateFormat || 'DD/MM/YYYY',
        timeFormat: settings.timeFormat || '12h',
      });
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings(prefs);
      if (onSettingsUpdated) onSettingsUpdated(result.data);
      toast.success('✓ Preferences saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Preferences</h2>
        <p className="mt-1 text-sm text-slate-400">
          Configure application behavior and localization.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Language">
          <select
            className={selectClass}
            value={prefs.language}
            onChange={(e) => handleChange('language', e.target.value)}
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
        </FieldGroup>

        <FieldGroup label="Timezone">
          <select
            className={selectClass}
            value={prefs.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            aria-label="Timezone"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="UTC">UTC</option>
          </select>
        </FieldGroup>

        <FieldGroup label="Date Format">
          <select
            className={selectClass}
            value={prefs.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            aria-label="Date format"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </FieldGroup>

        <FieldGroup label="Time Format">
          <select
            className={selectClass}
            value={prefs.timeFormat}
            onChange={(e) => handleChange('timeFormat', e.target.value)}
            aria-label="Time format"
          >
            <option value="12h">12 Hour (AM/PM)</option>
            <option value="24h">24 Hour</option>
          </select>
        </FieldGroup>

        <FieldGroup label="Default Dashboard">
          <select className={selectClass} disabled aria-label="Default dashboard">
            <option>Student Dashboard</option>
          </select>
        </FieldGroup>

        <FieldGroup label="Academic Year">
          <select className={selectClass} disabled aria-label="Academic year">
            <option>{CURRENT_YEAR} – {CURRENT_YEAR + 1}</option>
          </select>
        </FieldGroup>
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
          'Save Preferences'
        )}
      </button>
    </div>
  );
}
