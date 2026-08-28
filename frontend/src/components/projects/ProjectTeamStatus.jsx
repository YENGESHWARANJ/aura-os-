import React from "react";

const ProjectTeamStatus = ({ batchId }) => {
  return (
    <section className="mb-6 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2">Team Status</h3>
      <p className="text-xs text-gray-400">Team Status: <span className="text-green-400 font-semibold">Active & Approved</span></p>
    </section>
  );
};

export default ProjectTeamStatus;
