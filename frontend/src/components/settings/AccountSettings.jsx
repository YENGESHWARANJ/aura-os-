import { Mail, User, Shield, Clock, Calendar, CheckCircle2 } from 'lucide-react';

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
      <div className="mt-0.5 rounded-xl bg-slate-800 p-2 shrink-0">
        <Icon size={16} className="text-sky-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-slate-100 break-all">{value || '—'}</p>
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountSettings({ user }) {
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null;

  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'Not recorded';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Account Information</h2>
        <p className="mt-1 text-sm text-slate-400">
          Your account details. Email changes require identity verification.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow
          icon={Mail}
          label="Email Address"
          value={user?.email}
        />
        <InfoRow
          icon={Mail}
          label="Alternate Email"
          value={user?.alternateEmail || 'Not set'}
        />
        <InfoRow
          icon={User}
          label="Username / Name"
          value={user?.name}
        />
        <InfoRow
          icon={Shield}
          label="Role"
          value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}
        />
        <InfoRow
          icon={CheckCircle2}
          label="Account Status"
          value={user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
          badge={user?.status !== 'inactive' ? 'Active' : undefined}
        />
        <InfoRow
          icon={Calendar}
          label="Account Created"
          value={createdAt || '—'}
        />
        <InfoRow
          icon={Clock}
          label="Last Login"
          value={lastLogin}
        />
        {user?.college && (
          <InfoRow
            icon={Shield}
            label="Institution"
            value={user.college}
          />
        )}
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <p className="text-sm text-amber-400">
          <span className="font-semibold">Email change requires verification.</span>{' '}
          To update your email address, please contact your institution administrator or submit a support request.
        </p>
      </div>
    </div>
  );
}
