import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function SubmissionModal({
  assignment,
  isOpen,
  onClose,
  onSubmit
}) {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError("File size exceeds maximum 10MB limit.");
        setFile(null);
        return;
      }
      setError("");
      setFile(selected);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setConfirmStep(true);
  };

  const handleFinalConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(assignment._id, file, notes);
      setConfirmStep(false);
      setFile(null);
      setNotes("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit assignment.");
      setConfirmStep(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Assignment Submission
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{assignment.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!confirmStep ? (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* File Upload Drop Area */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Attach File <span className="text-rose-400">*</span> (PDF, DOCX, ZIP, PNG, max 10MB)
              </label>

              {!file ? (
                <label className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-sky-500/50 transition cursor-pointer p-4 text-center">
                  <Upload className="h-8 w-8 text-sky-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-200">
                    Click to browse or drag and drop
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    PDF, DOC, DOCX, ZIP, PNG, JPG supported
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="h-6 w-6 text-sky-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs font-semibold text-rose-400 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Submission Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Submission Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any comments or explanations for faculty..."
                rows={3}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200 outline-none transition focus:border-sky-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file}
                className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-xs font-semibold text-white transition shadow-lg shadow-sky-600/20"
              >
                Continue to Submit
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Dialog Step */
          <div className="space-y-6 text-center py-2">
            <div className="p-4 rounded-full bg-sky-500/10 text-sky-400 inline-block mx-auto border border-sky-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Submit this assignment?</h4>
              <p className="text-xs text-slate-400">
                You are submitting <strong className="text-slate-200">{file?.name}</strong> for{" "}
                <strong className="text-slate-200">{assignment.title}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setConfirmStep(false)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleFinalConfirm}
                disabled={submitting}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
