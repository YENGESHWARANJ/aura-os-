import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, Monitor, Sun, Moon } from 'lucide-react';
import { updateSettings } from '../../services/settingsService';

const THEMES = [
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark navy interface' },
  { value: 'light', label: 'Light', icon: Sun, description: 'Light clean interface' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Follow device preference' },
];

const ACCENTS = [
  { value: 'blue', label: 'Blue', bg: 'bg-sky-500', ring: 'ring-sky-500' },
  { value: 'purple', label: 'Purple', bg: 'bg-violet-500', ring: 'ring-violet-500' },
  { value: 'cyan', label: 'Cyan', bg: 'bg-cyan-400', ring: 'ring-cyan-400' },
  { value: 'green', label: 'Green', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
];

export default function AppearanceSettings({ settings, onSettingsUpdated }) {
  const [theme, setTheme] = useState(settings?.theme || 'dark');
  const [accent, setAccent] = useState(settings?.accentColor || 'blue');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'dark');
      setAccent(settings.accentColor || 'blue');
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings({ theme, accentColor: accent });
      if (onSettingsUpdated) onSettingsUpdated(result.data);
      toast.success('✓ Appearance settings updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update appearance settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Appearance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Customize the AURA OS interface. Dark theme is the primary design.
        </p>
      </div>

      {/* Theme Selector */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Theme</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, label, icon: Icon, description }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isActive
                    ? 'border-sky-500 bg-sky-500/10 shadow-md shadow-sky-500/10'
                    : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
                aria-pressed={isActive}
              >
                <div className={`rounded-xl p-2 ${isActive ? 'bg-sky-500/20' : 'bg-slate-800'}`}>
                  <Icon size={18} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isActive ? 'text-sky-400' : 'text-slate-200'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <div className={`ml-auto h-4 w-4 rounded-full border-2 transition ${isActive ? 'border-sky-500 bg-sky-500' : 'border-slate-600'}`} />
              </button>
            );
          })}
        </div>
        {theme !== 'dark' && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-xs text-amber-400">
              AURA OS is optimized for dark mode. Light/System modes may have limited support in this version.
            </p>
          </div>
        )}
      </div>

      {/* Accent Color */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map(({ value, label, bg, ring }) => {
            const isActive = accent === value;
            return (
              <button
                key={value}
                onClick={() => setAccent(value)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isActive
                    ? 'border-sky-500 bg-sky-500/10 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`h-4 w-4 rounded-full ${bg} ${isActive ? `ring-2 ring-offset-1 ring-offset-slate-900 ${ring}` : ''}`}
                />
                {label}
              </button>
            );
          })}
        </div>
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
          'Save Appearance'
        )}
      </button>
    </div>
  );
}
