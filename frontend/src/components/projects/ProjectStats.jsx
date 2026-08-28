import React from "react";

const ProjectStats = ({ batchId }) => {
  return (
    <section className="mb-6 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2">Project Performance & Stats</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-4">
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
          <span className="block text-2xl font-bold text-sky-400">85%</span>
          <span className="text-xs text-gray-400">Average Grade</span>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
          <span className="block text-2xl font-bold text-emerald-400">Phase 2</span>
          <span className="text-xs text-gray-400">Current Phase</span>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
          <span className="block text-2xl font-bold text-indigo-400">1</span>
          <span className="text-xs text-gray-400">Pending Review</span>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
          <span className="block text-2xl font-bold text-purple-400">2</span>
          <span className="text-xs text-gray-400">Completed Reviews</span>
        </div>
      </div>
    </section>
  );
};

export default ProjectStats;
