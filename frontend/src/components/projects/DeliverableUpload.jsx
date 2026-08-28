import React, { useState } from "react";

const DeliverableUpload = ({ batchId }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Deliverable uploaded successfully!");
  };

  return (
    <section className="mb-6 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2">Deliverable Upload</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Select File (.zip, .pdf)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-xs text-gray-300 bg-gray-900 p-2 rounded w-full border border-gray-700"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs rounded transition"
        >
          Submit Deliverable
        </button>
      </form>
    </section>
  );
};

export default DeliverableUpload;
