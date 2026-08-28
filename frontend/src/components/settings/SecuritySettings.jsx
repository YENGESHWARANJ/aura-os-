import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Lock, Monitor, Shield } from 'lucide-react';
import { changePassword } from '../../services/settingsService';

// ─── Password Strength ───────────────────────────────────────
function getStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: '', color: '' },
    { label: 'Weak', color: 'bg-rose-500' },
    { label: 'Fair', color: 'bg-orange-500' },
    { label: 'Good', color: 'bg-yellow-500' },
    { label: 'Strong', color: 'bg-emerald-500' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ];
  return { score, ...levels[score] };
}

function Requirement({ met, label }) {
  return (
    <li className={`flex items-center gap-2 text-xs transition ${met ? 'text-emerald-400' : 'text-slate-500'}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${met ? 'bg-emerald-400' : 'bg-slate-600'}`} />
      {label}
    </li>
  );
}

const inputClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 pr-11 text-sm text-slate-100 placeholder-slate-500 transition focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30';

function PasswordInput({ label, id, registration, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={inputClass}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-rose-400">{error.message}</p>}
    </div>
  );
}

export default function SecuritySettings() {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPwd = watch('newPassword', '');
  const strength = getStrength(newPwd);

  // Get browser/device info
  const sessionInfo = {
    browser: navigator.userAgent.includes('Chrome')
      ? 'Chrome'
      : navigator.userAgent.includes('Firefox')
      ? 'Firefox'
      : navigator.userAgent.includes('Safari')
      ? 'Safari'
      : 'Unknown Browser',
    os: navigator.platform || 'Unknown OS',
    lastActive: new Date().toLocaleString('en-IN'),
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('✓ Password changed successfully. Please log in again.');
      reset();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to change password.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your password and account security.
        </p>
      </div>

      {/* Change Password */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-slate-800 p-2">
            <Lock size={16} className="text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Change Password</h3>
            <p className="text-xs text-slate-500">Use a strong, unique password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            label="Current Password"
            id="currentPassword"
            registration={register('currentPassword', { required: 'Current password is required' })}
            error={errors.currentPassword}
          />
          <PasswordInput
            label="New Password"
            id="newPassword"
            registration={register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'At least 8 characters required' },
            })}
            error={errors.newPassword}
          />

          {/* Strength bar */}
          {newPwd && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Password strength</span>
                <span className={`text-xs font-semibold ${strength.score >= 4 ? 'text-emerald-400' : strength.score >= 3 ? 'text-yellow-400' : strength.score >= 2 ? 'text-orange-400' : 'text-rose-400'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.color : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <ul className="grid grid-cols-2 gap-1.5 pt-1">
                <Requirement met={newPwd.length >= 8} label="At least 8 characters" />
                <Requirement met={/[A-Z]/.test(newPwd)} label="Uppercase letter" />
                <Requirement met={/[a-z]/.test(newPwd)} label="Lowercase letter" />
                <Requirement met={/[0-9]/.test(newPwd)} label="Number" />
                <Requirement met={/[^A-Za-z0-9]/.test(newPwd)} label="Special character" />
              </ul>
            </div>
          )}

          <PasswordInput
            label="Confirm New Password"
            id="confirmPassword"
            registration={register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (v) => v === newPwd || 'Passwords do not match',
            })}
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Changing password...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-slate-800 p-2">
            <Monitor size={16} className="text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Active Sessions</h3>
            <p className="text-xs text-slate-500">Devices currently logged in to your account</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                <span className="text-sm font-medium text-white">Current Device</span>
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                  This device
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                {sessionInfo.browser} · {sessionInfo.os}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Last active: {sessionInfo.lastActive}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 opacity-75">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-slate-800 p-2">
            <Shield size={16} className="text-slate-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-xs text-slate-500">
              Protect your account with an additional authentication layer.
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-400">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Two-factor authentication is not yet available in this version of AURA OS. This feature is under development.
        </p>
        <button
          disabled
          className="mt-4 rounded-2xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
          aria-disabled="true"
        >
          Enable 2FA — Unavailable
        </button>
      </div>
    </div>
  );
}
