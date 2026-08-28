import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Camera, Loader2, Save, X } from 'lucide-react';
import { updateProfile, uploadAvatar } from '../../services/profileService';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => i + 1);
const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

function FieldGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 disabled:opacity-50';

export default function ProfileSettings({ user, onProfileUpdated }) {
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        college: user.college || '',
        department: user.department || '',
        degree: user.degree || '',
        specialization: user.specialization || '',
        registerNumber: user.registerNumber || '',
        semester: user.semester || '',
        batch: user.batch || '',
        city: user.city || '',
        country: user.country || 'India',
        careerGoal: user.careerGoal || '',
      });
      setAvatarPreview(null);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const result = await updateProfile(data);
      toast.success('✓ Profile updated successfully');
      if (onProfileUpdated) onProfileUpdated(result.user);
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    setAvatarLoading(true);
    try {
      setAvatarPreview(URL.createObjectURL(file));
      const result = await uploadAvatar(file);
      toast.success('✓ Profile photo updated');
      if (onProfileUpdated) onProfileUpdated(result.user);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload photo.');
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
    }
  };

  const avatarSrc =
    avatarPreview ||
    (user?.avatar
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`
      : null);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Update your personal and academic information.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Profile avatar"
              className="h-20 w-20 rounded-full object-cover border-2 border-slate-700"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-slate-700">
              {initials}
            </div>
          )}
          {avatarLoading && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="avatar-upload"
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <Camera size={15} />
            Change Photo
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleAvatarChange}
            disabled={avatarLoading}
          />
          <p className="mt-1.5 text-xs text-slate-500">JPG, PNG or WebP · Max 5MB</p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Full Name">
          <input
            {...register('name', { required: 'Name is required' })}
            className={inputClass}
            placeholder="Your full name"
            aria-describedby={errors.name ? 'name-err' : undefined}
          />
          {errors.name && (
            <p id="name-err" className="text-xs text-rose-400">{errors.name.message}</p>
          )}
        </FieldGroup>

        <FieldGroup label="Phone Number">
          <input
            {...register('phone', {
              pattern: { value: /^\+?[0-9\s\-]{7,15}$/, message: 'Invalid phone number' },
            })}
            className={inputClass}
            placeholder="+91 XXXXX XXXXX"
            type="tel"
          />
          {errors.phone && (
            <p className="text-xs text-rose-400">{errors.phone.message}</p>
          )}
        </FieldGroup>

        <FieldGroup label="College / Institution">
          <input {...register('college')} className={inputClass} placeholder="College name" />
        </FieldGroup>

        <FieldGroup label="Department">
          <input {...register('department')} className={inputClass} placeholder="e.g. Computer Science" />
        </FieldGroup>

        <FieldGroup label="Degree">
          <input {...register('degree')} className={inputClass} placeholder="e.g. B.Tech" />
        </FieldGroup>

        <FieldGroup label="Specialization">
          <input {...register('specialization')} className={inputClass} placeholder="e.g. Artificial Intelligence" />
        </FieldGroup>

        <FieldGroup label="Register / Roll Number">
          <input {...register('registerNumber')} className={inputClass} placeholder="Your roll number" />
        </FieldGroup>

        <FieldGroup label="Semester">
          <select {...register('semester')} className={inputClass}>
            <option value="">Select semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup label="Batch">
          <input {...register('batch')} className={inputClass} placeholder="e.g. 2023 - 2027" />
        </FieldGroup>

        <FieldGroup label="City">
          <input {...register('city')} className={inputClass} placeholder="Your city" />
        </FieldGroup>

        <FieldGroup label="Country">
          <input {...register('country')} className={inputClass} placeholder="Country" />
        </FieldGroup>

        <FieldGroup label="Career Goal">
          <input {...register('careerGoal')} className={inputClass} placeholder="e.g. Software Engineer at a top tech firm" />
        </FieldGroup>
      </div>

      {/* Bio */}
      <FieldGroup label="Bio / About Me">
        <textarea
          {...register('bio', { maxLength: { value: 500, message: 'Bio must be under 500 characters' } })}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Write a short bio about yourself..."
        />
        {errors.bio && (
          <p className="text-xs text-rose-400">{errors.bio.message}</p>
        )}
      </FieldGroup>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !isDirty}
          className="flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              Save Changes
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>
      </div>
    </form>
  );
}
