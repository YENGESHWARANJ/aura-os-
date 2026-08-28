import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Eye,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    id: 'account',
    label: 'Account',
    description: 'Manage account information',
    icon: User,
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Update personal information',
    icon: Settings,
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Password and authentication',
    icon: Lock,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Notification preferences',
    icon: Bell,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Theme and interface',
    icon: Palette,
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Privacy controls',
    icon: Eye,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Application preferences',
    icon: Shield,
  },
];

export default function SettingsSidebar({ active, onSelect }) {
  return (
    <>
      {/* Desktop vertical nav */}
      <nav
        className="hidden lg:flex flex-col gap-1 w-64 shrink-0"
        aria-label="Settings navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={18}
                className={isActive ? 'text-white' : 'text-slate-400'}
              />
              <div>
                <p className="text-sm font-medium leading-snug">{item.label}</p>
                {!isActive && (
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mobile horizontal scroll nav */}
      <nav
        className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        aria-label="Settings navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2 shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
