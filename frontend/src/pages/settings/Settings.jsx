import React, { useState } from "react";
import {
    User,
    Lock,
    Bell,
    Palette,
    Shield,
    Moon,
    Sun,
    Monitor,
    Mail,
    Smartphone,
    Save,
    Eye,
    EyeOff,
    LogOut,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
} from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";
export default function Settings() {
    const { theme, setTheme } = useTheme();

    const [activeSection, setActiveSection] = useState("appearance");
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        firstName: "Yengeshwaran",
        lastName: "J",
        email: "student@example.com",
        phone: "",
        college: "Bannari Amman Institute of Technology",
        department: "Artificial Intelligence & Data Science",
        year: "3rd Year",
        rollNumber: "",
    });

    const [password, setPassword] = useState({
        current: "",
        newPassword: "",
        confirm: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        newPassword: false,
        confirm: false,
    });

    const [notifications, setNotifications] = useState({
        email: true,
        attendance: true,
        assignments: true,
        exams: true,
        mentor: true,
        aiSuggestions: true,
        announcements: true,
    });

    const sections = [
        {
            id: "profile",
            label: "Profile",
            description: "Personal information",
            icon: User,
        },
        {
            id: "security",
            label: "Security",
            description: "Password & account security",
            icon: Lock,
        },
        {
            id: "notifications",
            label: "Notifications",
            description: "Manage notifications",
            icon: Bell,
        },
        {
            id: "appearance",
            label: "Appearance",
            description: "Theme & display",
            icon: Palette,
        },
        {
            id: "privacy",
            label: "Privacy",
            description: "Privacy & data",
            icon: Shield,
        },
    ];

    const handleProfileChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPassword((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const toggleNotification = (key) => {
        setNotifications((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    };

    const handleSave = () => {
        localStorage.setItem(
            "aura-profile-settings",
            JSON.stringify(profile)
        );

        localStorage.setItem(
            "aura-notification-settings",
            JSON.stringify(notifications)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
    };

    const handlePasswordUpdate = () => {
        if (
            !password.current ||
            !password.newPassword ||
            !password.confirm
        ) {
            alert("Please fill all password fields.");
            return;
        }

        if (password.newPassword !== password.confirm) {
            alert("New password and confirm password do not match.");
            return;
        }

        if (password.newPassword.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        alert("Password validation successful.");
    };

    return (
        <div className="min-h-screen bg-[var(--aura-bg)] text-[var(--aura-text)]">

            {/* HEADER */}
            <div className="mb-8">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                            Account Control
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-[var(--aura-text)]">
                            Settings
                        </h1>

                        <p className="mt-2 text-sm text-[var(--aura-text-muted)]">
                            Manage your AURA OS account, security,
                            notifications and preferences.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                        <Save size={17} />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* SUCCESS */}
            {saved && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    <CheckCircle2 size={18} />
                    Settings saved successfully.
                </div>
            )}

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

                {/* SIDEBAR */}
                <aside className="h-fit rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-3">

                    <div className="px-3 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-muted)]">
                            Settings
                        </p>
                    </div>

                    <div className="space-y-1">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const active = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active
                                        ? "bg-cyan-500/15 text-cyan-400 font-bold"
                                        : "text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] hover:text-[var(--aura-text)]"
                                        }`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${active
                                            ? "bg-cyan-500 text-slate-950"
                                            : "bg-[var(--aura-surface-2)] text-[var(--aura-text-muted)]"
                                            }`}
                                    >
                                        <Icon size={17} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {section.label}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-[var(--aura-text-muted)]">
                                            {section.description}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={16}
                                        className={
                                            active
                                                ? "text-cyan-400"
                                                : "opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                                        }
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div className="my-4 border-t border-[var(--aura-border)]" />

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-400 transition hover:bg-red-500/10"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                            <LogOut size={17} />
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Logout
                            </p>

                            <p className="text-xs text-red-400/60">
                                End current session
                            </p>
                        </div>
                    </button>
                </aside>

                {/* CONTENT */}
                <main className="overflow-hidden rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)]">

                    {/* PROFILE */}
                    {activeSection === "profile" && (
                        <section>
                            <SectionHeader
                                icon={User}
                                title="Profile Information"
                                description="Update your personal and academic information."
                            />

                            <div className="p-6">

                                <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-[#020817] p-5 sm:flex-row sm:items-center">

                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-bold text-white">
                                        {profile.firstName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold">
                                            {profile.firstName} {profile.lastName}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {profile.department}
                                        </p>

                                        <span className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                                            Student
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                                    >
                                        Change Photo
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleProfileChange}
                                    />

                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleProfileChange}
                                    />

                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        icon={Mail}
                                    />

                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        icon={Smartphone}
                                    />

                                    <Input
                                        label="College"
                                        name="college"
                                        value={profile.college}
                                        onChange={handleProfileChange}
                                    />

                                    <Input
                                        label="Department"
                                        name="department"
                                        value={profile.department}
                                        onChange={handleProfileChange}
                                    />

                                    <Input
                                        label="Academic Year"
                                        name="year"
                                        value={profile.year}
                                        onChange={handleProfileChange}
                                    />

                                    <Input
                                        label="Roll Number"
                                        name="rollNumber"
                                        value={profile.rollNumber}
                                        onChange={handleProfileChange}
                                    />

                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECURITY */}
                    {activeSection === "security" && (
                        <section>
                            <SectionHeader
                                icon={Lock}
                                title="Security"
                                description="Protect your AURA OS account."
                            />

                            <div className="space-y-6 p-6">

                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                                    <div className="flex gap-4">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                            <Shield size={20} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-emerald-300">
                                                Account Protected
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Your account is protected with secure authentication.
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-6">

                                    <h3 className="mb-6 text-lg font-semibold">
                                        Change Password
                                    </h3>

                                    <div className="space-y-5">

                                        <PasswordInput
                                            label="Current Password"
                                            name="current"
                                            value={password.current}
                                            onChange={handlePasswordChange}
                                            show={showPasswords.current}
                                            toggle={() =>
                                                setShowPasswords((previous) => ({
                                                    ...previous,
                                                    current: !previous.current,
                                                }))
                                            }
                                        />

                                        <PasswordInput
                                            label="New Password"
                                            name="newPassword"
                                            value={password.newPassword}
                                            onChange={handlePasswordChange}
                                            show={showPasswords.newPassword}
                                            toggle={() =>
                                                setShowPasswords((previous) => ({
                                                    ...previous,
                                                    newPassword: !previous.newPassword,
                                                }))
                                            }
                                        />

                                        <PasswordInput
                                            label="Confirm New Password"
                                            name="confirm"
                                            value={password.confirm}
                                            onChange={handlePasswordChange}
                                            show={showPasswords.confirm}
                                            toggle={() =>
                                                setShowPasswords((previous) => ({
                                                    ...previous,
                                                    confirm: !previous.confirm,
                                                }))
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={handlePasswordUpdate}
                                            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                                        >
                                            Update Password
                                        </button>

                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-6">

                                    <h3 className="font-semibold">
                                        Active Sessions
                                    </h3>

                                    <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-800 p-4">

                                        <div>
                                            <p className="font-medium">
                                                Current Browser
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Windows · Chrome · Active now
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                                            Active
                                        </span>

                                    </div>
                                </div>

                            </div>
                        </section>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeSection === "notifications" && (
                        <section>
                            <SectionHeader
                                icon={Bell}
                                title="Notifications"
                                description="Choose what notifications you want to receive."
                            />

                            <div className="space-y-2 p-6">

                                <NotificationItem
                                    title="Email Notifications"
                                    description="Receive important updates through email."
                                    enabled={notifications.email}
                                    onToggle={() => toggleNotification("email")}
                                />

                                <NotificationItem
                                    title="Attendance Alerts"
                                    description="Get notified when your attendance requires attention."
                                    enabled={notifications.attendance}
                                    onToggle={() => toggleNotification("attendance")}
                                />

                                <NotificationItem
                                    title="Assignment Reminders"
                                    description="Receive reminders about pending assignments."
                                    enabled={notifications.assignments}
                                    onToggle={() => toggleNotification("assignments")}
                                />

                                <NotificationItem
                                    title="Exam Notifications"
                                    description="Get reminders for upcoming examinations."
                                    enabled={notifications.exams}
                                    onToggle={() => toggleNotification("exams")}
                                />

                                <NotificationItem
                                    title="Mentor Messages"
                                    description="Receive alerts when your mentor sends a message."
                                    enabled={notifications.mentor}
                                    onToggle={() => toggleNotification("mentor")}
                                />

                                <NotificationItem
                                    title="AI Suggestions"
                                    description="Receive personalized academic recommendations."
                                    enabled={notifications.aiSuggestions}
                                    onToggle={() => toggleNotification("aiSuggestions")}
                                />

                                <NotificationItem
                                    title="College Announcements"
                                    description="Stay updated with important announcements."
                                    enabled={notifications.announcements}
                                    onToggle={() => toggleNotification("announcements")}
                                />

                            </div>
                        </section>
                    )}

                    {/* APPEARANCE */}
                    {activeSection === "appearance" && (
                        <section>
                            <SectionHeader
                                icon={Palette}
                                title="Appearance"
                                description="Customize the look and feel of AURA OS."
                            />

                            <div className="p-6">

                                <h3 className="mb-4 font-semibold">
                                    Theme
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                    <ThemeCard
                                        icon={Moon}
                                        title="Dark"
                                        description="Dark appearance"
                                        active={theme === "dark"}
                                        onClick={() => setTheme("dark")}
                                    />

                                    <ThemeCard
                                        icon={Sun}
                                        title="Light"
                                        description="Light appearance"
                                        active={theme === "light"}
                                        onClick={() => setTheme("light")}
                                    />

                                    <ThemeCard
                                        icon={Monitor}
                                        title="System"
                                        description="Follow system preference"
                                        active={theme === "system"}
                                        onClick={() => setTheme("system")}
                                    />

                                </div>

                                <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

                                    <div className="flex gap-4">

                                        <Palette
                                            className="mt-1 text-cyan-400"
                                            size={20}
                                        />

                                        <div>
                                            <h3 className="font-semibold">
                                                AURA OS Interface
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Your selected theme will be applied across
                                                the AURA OS interface.
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </section>
                    )}

                    {/* PRIVACY */}
                    {activeSection === "privacy" && (
                        <section>
                            <SectionHeader
                                icon={Shield}
                                title="Privacy & Data"
                                description="Control your personal data and account privacy."
                            />

                            <div className="space-y-5 p-6">

                                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">

                                    <div className="flex items-start gap-4">

                                        <Shield
                                            className="mt-1 text-cyan-400"
                                            size={21}
                                        />

                                        <div className="flex-1">

                                            <h3 className="font-semibold">
                                                Academic Data
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Your attendance, academic performance,
                                                assignments, skills and study information
                                                are used to provide personalized academic insights.
                                            </p>

                                        </div>

                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">

                                    <h3 className="font-semibold">
                                        Data Export
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Download a copy of your academic and profile data.
                                    </p>

                                    <button
                                        type="button"
                                        className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                                    >
                                        Export My Data
                                    </button>

                                </div>

                                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

                                    <div className="flex gap-4">

                                        <AlertCircle
                                            className="mt-1 text-red-400"
                                            size={21}
                                        />

                                        <div className="flex-1">

                                            <h3 className="font-semibold text-red-300">
                                                Danger Zone
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Permanently delete your AURA OS account
                                                and associated data.
                                            </p>

                                            <button
                                                type="button"
                                                className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                                            >
                                                <Trash2 size={16} />
                                                Delete Account
                                            </button>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="border-b border-slate-800 px-6 py-6">
            <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Icon size={21} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>

            </div>
        </div>
    );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    icon: Icon,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </label>

            <div className="relative">

                {Icon && (
                    <Icon
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                )}

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full rounded-xl border border-slate-800 bg-[#020817] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 ${Icon ? "pl-10" : ""
                        }`}
                />

            </div>
        </div>
    );
}

/* =========================================================
   PASSWORD INPUT
========================================================= */

function PasswordInput({
    label,
    name,
    value,
    onChange,
    show,
    toggle,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </label>

            <div className="relative">

                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-xl border border-slate-800 bg-[#020817] px-4 py-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-400"
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                    {show ? (
                        <EyeOff size={17} />
                    ) : (
                        <Eye size={17} />
                    )}
                </button>

            </div>
        </div>
    );
}

/* =========================================================
   NOTIFICATION ITEM
========================================================= */

function NotificationItem({
    title,
    description,
    enabled,
    onToggle,
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#020817] p-5">

            <div>
                <h3 className="text-sm font-semibold">
                    {title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={onToggle}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-cyan-500" : "bg-slate-700"
                    }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"
                        }`}
                />
            </button>

        </div>
    );
}

/* =========================================================
   THEME CARD
========================================================= */

function ThemeCard({
    icon: Icon,
    title,
    description,
    active,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border p-5 text-left transition ${active
                ? "border-cyan-500 bg-cyan-500/15 shadow-sm"
                : "border-[var(--aura-border)] bg-[var(--aura-surface-2)] hover:border-slate-400"
                }`}
        >
            <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${active
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-[var(--aura-surface)] text-[var(--aura-text-muted)] border border-[var(--aura-border)]"
                    }`}
            >
                <Icon size={19} />
            </div>

            <p className="font-bold text-[var(--aura-text)]">
                {title}
            </p>

            <p className="mt-1 text-xs text-[var(--aura-text-muted)]">
                {description}
            </p>

            {active && (
                <p className="mt-2 text-xs font-bold text-cyan-500">
                    Selected
                </p>
            )}
        </button>
    );
}