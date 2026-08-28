import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AlertCircle, RefreshCw } from "lucide-react";

import { loginSuccess } from "../../redux/slices/authSlice";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  uploadResume,
  deleteResume,
} from "../../services/profileService";

import ProfileSkeleton from "../../components/profile/ProfileSkeleton";
import ProfileHero from "../../components/profile/ProfileHero";
import ProfileCompletion from "../../components/profile/ProfileCompletion";
import AcademicSummary from "../../components/profile/AcademicSummary";
import PersonalInfo from "../../components/profile/PersonalInfo";
import AcademicInfo from "../../components/profile/AcademicInfo";
import AboutMe from "../../components/profile/AboutMe";
import SkillsPreview from "../../components/profile/SkillsPreview";
import ProjectsPreview from "../../components/profile/ProjectsPreview";
import CertificatesPreview from "../../components/profile/CertificatesPreview";
import CareerProfile from "../../components/profile/CareerProfile";
import ProfessionalLinks from "../../components/profile/ProfessionalLinks";
import ResumeCard from "../../components/profile/ResumeCard";
import CareerReadiness from "../../components/profile/CareerReadiness";

// ── Validate form before saving ────────────────────────────────
function validateForm(form) {
  const errors = [];

  if (form.phone && !/^[+\d\s\-().]{7,15}$/.test(form.phone)) {
    errors.push("Invalid phone number format");
  }
  if (form.alternateEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.alternateEmail)) {
    errors.push("Invalid alternate email format");
  }
  const urlFields = ["socialLinks.linkedin", "socialLinks.github", "socialLinks.portfolio",
    "socialLinks.leetcode", "socialLinks.hackerrank", "socialLinks.codechef", "socialLinks.website"];
  if (form.socialLinks) {
    Object.entries(form.socialLinks).forEach(([key, val]) => {
      if (val && !/^https?:\/\/.+/.test(val)) {
        errors.push(`${key} must be a valid URL starting with https://`);
      }
    });
  }
  if (form.bio && form.bio.length > 500) {
    errors.push("Bio cannot exceed 500 characters");
  }
  if (form.graduationYear && (form.graduationYear < 2000 || form.graduationYear > 2040)) {
    errors.push("Graduation year must be between 2000 and 2040");
  }
  return errors;
}

// ── Deep clone user to editable form state ─────────────────────
function userToForm(user) {
  if (!user) return {};
  return {
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    dob: user.dob || "",
    gender: user.gender || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "India",
    alternateEmail: user.alternateEmail || "",
    degree: user.degree || "",
    specialization: user.specialization || "",
    registerNumber: user.registerNumber || "",
    batch: user.batch || "",
    graduationYear: user.graduationYear || "",
    careerGoal: user.careerGoal || "",
    preferredRole: user.preferredRole || "",
    interestedDomains: [...(user.interestedDomains || [])],
    preferredTechnologies: [...(user.preferredTechnologies || [])],
    socialLinks: { ...(user.socialLinks || {}) },
    college: user.college || "",
    department: user.department || "",
    semester: user.semester || "",
  };
}

export default function Profile() {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);

  // ── Data State ──────────────────────────────────────────────
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Edit State ──────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // ── Fetch profile data ──────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfile();
      setProfileData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Unable to load your profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ── Edit Mode ───────────────────────────────────────────────
  const handleEditToggle = () => {
    setFormData(userToForm(profileData?.user));
    setIsDirty(false);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    if (isDirty) {
      const confirmed = window.confirm("Discard unsaved changes?");
      if (!confirmed) return;
    }
    setEditMode(false);
    setIsDirty(false);
    setFormData({});
  };

  // ── Field change handler ────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // ── Save changes ────────────────────────────────────────────
  const handleSaveEdit = async () => {
    const errors = validateForm(formData);
    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e));
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile(formData);
      const updatedUser = res.user;

      // Refresh full profile
      const profileRes = await getProfile();
      setProfileData(profileRes.data);

      // Sync Redux auth state (updates Navbar name/avatar)
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedUser = { ...storedUser, ...updatedUser };
      dispatch(
        loginSuccess({
          accessToken: localStorage.getItem("accessToken") || localStorage.getItem("aura_token"),
          refreshToken: localStorage.getItem("refreshToken"),
          user: mergedUser,
        })
      );
      localStorage.setItem("user", JSON.stringify(mergedUser));

      setEditMode(false);
      setIsDirty(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar upload ────────────────────────────────────────────
  const handleAvatarUpload = async (file) => {
    // Validate type
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Allowed: JPG, JPEG, PNG, WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const toastId = toast.loading("Uploading photo...");
    try {
      const res = await uploadAvatar(file);
      await fetchProfile();

      // Sync Navbar avatar
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedUser = { ...storedUser, avatar: res.avatarUrl };
      dispatch(
        loginSuccess({
          accessToken: localStorage.getItem("accessToken") || localStorage.getItem("aura_token"),
          refreshToken: localStorage.getItem("refreshToken"),
          user: mergedUser,
        })
      );
      localStorage.setItem("user", JSON.stringify(mergedUser));

      toast.success("Profile photo updated!", { id: toastId });
    } catch (err) {
      toast.error("Failed to upload photo", { id: toastId });
    }
  };

  const handleAvatarRemove = async () => {
    const confirmed = window.confirm("Remove your profile photo?");
    if (!confirmed) return;
    const toastId = toast.loading("Removing photo...");
    try {
      await deleteAvatar();
      await fetchProfile();

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedUser = { ...storedUser, avatar: null };
      delete mergedUser.avatar;
      dispatch(
        loginSuccess({
          accessToken: localStorage.getItem("accessToken") || localStorage.getItem("aura_token"),
          refreshToken: localStorage.getItem("refreshToken"),
          user: mergedUser,
        })
      );
      localStorage.setItem("user", JSON.stringify(mergedUser));

      toast.success("Profile photo removed", { id: toastId });
    } catch (err) {
      toast.error("Failed to remove photo", { id: toastId });
    }
  };

  // ── Resume ──────────────────────────────────────────────────
  const handleResumeUpload = async (file) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Allowed: PDF, DOC, DOCX");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume must be smaller than 10MB");
      return;
    }
    const toastId = toast.loading("Uploading resume...");
    try {
      await uploadResume(file);
      await fetchProfile();
      toast.success("Resume uploaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to upload resume", { id: toastId });
    }
  };

  const handleResumeDelete = async () => {
    const confirmed = window.confirm("Delete your resume? This cannot be undone.");
    if (!confirmed) return;
    const toastId = toast.loading("Deleting resume...");
    try {
      await deleteResume();
      await fetchProfile();
      toast.success("Resume deleted", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete resume", { id: toastId });
    }
  };

  // ── Unsaved changes navigation guard ────────────────────────
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ── Render ──────────────────────────────────────────────────
  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <AlertCircle size={28} className="text-rose-400" />
        </div>
        <div>
          <p className="text-slate-200 font-semibold mb-1">Profile unavailable</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <button
          onClick={fetchProfile}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const { user, completion, readiness, skills, projects } = profileData || {};

  return (
    <div className="space-y-6 pb-10">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your personal, academic and career information.</p>
        </div>
      </div>

      {/* ── Hero Card ───────────────────────────────────────── */}
      <ProfileHero
        user={user}
        completion={completion}
        editMode={editMode}
        onEditToggle={handleEditToggle}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onAvatarUpload={handleAvatarUpload}
        onAvatarRemove={handleAvatarRemove}
      />

      {/* ── Profile Completion + Academic Summary ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileCompletion completion={completion} />
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center h-full">
            <div className="w-full">
              <AcademicSummary user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Personal + Academic Info ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfo
          user={user}
          editMode={editMode}
          formData={formData}
          onChange={handleChange}
        />
        <AcademicInfo
          user={user}
          editMode={editMode}
          formData={formData}
          onChange={handleChange}
        />
      </div>

      {/* ── About Me ─────────────────────────────────────────── */}
      <AboutMe
        user={user}
        editMode={editMode}
        formData={formData}
        onChange={handleChange}
      />

      {/* ── Skills + Career Profile ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsPreview skills={skills || []} />
        <CareerProfile
          user={user}
          editMode={editMode}
          formData={formData}
          onChange={handleChange}
        />
      </div>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <ProjectsPreview projects={projects || []} />

      {/* ── Certificates + Professional Links ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CertificatesPreview certificates={[]} />
        <ProfessionalLinks
          user={user}
          editMode={editMode}
          formData={formData}
          onChange={handleChange}
        />
      </div>

      {/* ── Career Readiness ─────────────────────────────────── */}
      {readiness && <CareerReadiness readiness={readiness} />}

      {/* ── Resume ──────────────────────────────────────────── */}
      <ResumeCard
        user={user}
        onUpload={handleResumeUpload}
        onDelete={handleResumeDelete}
      />

      {/* ── Floating Save Banner (edit mode) ────────────────── */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/95 backdrop-blur-xl px-5 py-3 shadow-2xl shadow-black/50"
          >
            <span className="text-sm text-slate-400">
              {isDirty ? "You have unsaved changes" : "Edit mode active"}
            </span>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
