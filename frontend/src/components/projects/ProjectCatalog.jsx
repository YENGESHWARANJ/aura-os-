import React, { useEffect, useState } from "react";
import { getAvailableProjects } from "../../services/projectService";

const ProjectCatalog = ({ batchId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAvailableProjects({ batchId });
        const list = Array.isArray(res) ? res : res?.data || [];
        setProjects(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (batchId) fetchProjects();
  }, [batchId]);

  if (loading) {
    return <div className="text-gray-500">Loading projects…</div>;
  }

  if (!projects || projects.length === 0) {
    return <div className="text-gray-400">No projects available for this batch.</div>;
  }

  return (
    <section className="my-6">
      <h3 className="text-xl font-semibold text-white mb-3">Available Projects</h3>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj) => (
          <li
            key={proj._id}
            className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-indigo-500 transition"
          >
            <h4 className="text-lg font-medium text-indigo-200">{proj.title}</h4>
            <p className="text-sm text-gray-300 mt-1">
              {proj.description ? proj.description.slice(0, 120) + "…" : "No description"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectCatalog;
