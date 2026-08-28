import React, { useEffect, useState } from "react";

// Placeholder for Team Formation component. In a full implementation this would fetch and display
// the student's team members, allow forming/joining teams, etc. For now it simply shows a themed
// section with a loading state.

const TeamFormation = ({ batchId }) => {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    // Simulate async fetch – replace with real API call when available
    const timer = setTimeout(() => {
      // Dummy data
      setTeam({ name: "Team Alpha", members: ["Alice", "Bob", "Charlie"] });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [batchId]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-lg animate-pulse">
        <p className="text-gray-400">Loading team information…</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-lg">
        <p className="text-gray-400">No team assigned yet. Form a team to get started.</p>
      </div>
    );
  }

  return (
    <section className="p-6 bg-gradient-to-r from-indigo-900 to-slate-800 rounded-xl shadow-xl backdrop-blur-sm border border-indigo-600">
      <h2 className="text-2xl font-bold text-white mb-2">{team.name}</h2>
      <ul className="list-disc list-inside text-indigo-200">
        {team.members.map((member, idx) => (
          <li key={idx}>{member}</li>
        ))}
      </ul>
    </section>
  );
};

export default TeamFormation;
