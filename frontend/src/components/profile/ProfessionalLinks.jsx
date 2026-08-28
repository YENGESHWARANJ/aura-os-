import React from "react";
import { motion } from "framer-motion";
import { Link2, ExternalLink } from "lucide-react";

// SVG icons for platforms
const SvgLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const SvgGitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);
const SvgLeetCode = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
);

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", icon: SvgLinkedIn, color: "text-sky-400", hoverColor: "hover:text-sky-300", placeholder: "https://linkedin.com/in/yourprofile" },
  { key: "github", label: "GitHub", icon: SvgGitHub, color: "text-slate-400", hoverColor: "hover:text-slate-200", placeholder: "https://github.com/yourusername" },
  { key: "portfolio", label: "Portfolio", icon: Link2, color: "text-purple-400", hoverColor: "hover:text-purple-300", placeholder: "https://yourportfolio.com" },
  { key: "leetcode", label: "LeetCode", icon: SvgLeetCode, color: "text-amber-400", hoverColor: "hover:text-amber-300", placeholder: "https://leetcode.com/yourusername" },
  { key: "hackerrank", label: "HackerRank", icon: Link2, color: "text-emerald-400", hoverColor: "hover:text-emerald-300", placeholder: "https://hackerrank.com/yourusername" },
  { key: "codechef", label: "CodeChef", icon: Link2, color: "text-rose-400", hoverColor: "hover:text-rose-300", placeholder: "https://codechef.com/users/yourusername" },
  { key: "website", label: "Other Website", icon: Link2, color: "text-slate-400", hoverColor: "hover:text-slate-200", placeholder: "https://yourwebsite.com" },
];

function safeUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.href;
  } catch { return null; }
}

export default function ProfessionalLinks({ user, editMode, formData, onChange }) {
  const links = editMode ? (formData?.socialLinks || {}) : (user?.socialLinks || {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`rounded-2xl border bg-slate-900 p-5 sm:p-6 h-full ${editMode ? "border-indigo-500/20 ring-1 ring-indigo-500/10" : "border-slate-800"}`}
    >
      <div className="flex items-center gap-2 mb-5">
        <Link2 size={16} className="text-sky-400" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Professional Links</h3>
        {editMode && (
          <span className="ml-auto text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Editing</span>
        )}
      </div>

      <div className="space-y-3">
        {PLATFORMS.map(({ key, label, icon: Icon, color, hoverColor, placeholder }) => {
          const raw = links[key] || "";
          const url = safeUrl(raw);

          if (!editMode) {
            return (
              <div key={key} className="flex items-center gap-3">
                <div className={`shrink-0 h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center ${color}`}>
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">{label}</p>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs ${color} ${hoverColor} transition-colors flex items-center gap-1 truncate`}
                    >
                      <span className="truncate">{raw}</span>
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600 italic">Not set</span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="flex items-center gap-3">
              <div className={`shrink-0 h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center ${color}`}>
                <Icon />
              </div>
              <input
                id={`link-${key}`}
                type="url"
                value={raw}
                onChange={(e) => onChange("socialLinks", { ...links, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder:text-slate-700"
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
