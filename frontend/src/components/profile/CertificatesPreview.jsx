import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Plus, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CertificatesPreview({ certificates = [] }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Certificates</h3>
        </div>
        {certificates.length > 0 && (
          <button
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            View All <ChevronRight size={12} />
          </button>
        )}
      </div>

      {certificates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <Award size={20} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mb-1">No certificates added yet</p>
          <p className="text-xs text-slate-600">Earn and showcase your certifications</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {certificates.slice(0, 3).map((cert, i) => (
            <motion.div
              key={cert._id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3 hover:border-amber-500/20 hover:bg-slate-800/60 transition-colors group"
            >
              <div className="shrink-0 h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Award size={16} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{cert.name || cert.title}</p>
                <p className="text-xs text-slate-500 truncate">{cert.organization || cert.issuer}</p>
                {cert.issuedDate && (
                  <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                    <Calendar size={9} />
                    {new Date(cert.issuedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-slate-700 group-hover:text-indigo-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
