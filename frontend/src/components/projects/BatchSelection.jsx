import React, { useEffect, useState } from "react";
import { getProjectBatches, getAvailableProjects } from "../../services/projectService";

const BatchSelection = ({ onSelect }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await getProjectBatches();
        const list = Array.isArray(res) ? res : res?.data || [];
        setBatches(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading batches…</div>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">Select Project Batch</label>
      <select
        className="w-full p-2 bg-gray-800 text-white rounded"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Choose a batch --</option>
        {batches.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name} ({b.academicYear})
          </option>
        ))}
      </select>
    </div>
  );
};

export default BatchSelection;
