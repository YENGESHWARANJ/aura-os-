import React, { useState, useEffect } from "react";
import { getBatchById } from "../../services/projectService";
import WelcomeBanner from "../../components/projects/WelcomeBanner";
import BatchSelection from "../../components/projects/BatchSelection";
import ProjectCatalog from "../../components/projects/ProjectCatalog";
import TeamFormation from "../../components/projects/TeamFormation";
import DeliverableUpload from "../../components/projects/DeliverableUpload";
import ProjectTeamStatus from "../../components/projects/ProjectTeamStatus";
import ProjectStats from "../../components/projects/ProjectStats";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { FolderGit2, ArrowLeft } from "lucide-react";

export default function Projects() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchInfo, setBatchInfo] = useState(null);

  useEffect(() => {
    if (selectedBatch) {
      getBatchById(selectedBatch)
        .then((res) => setBatchInfo(res.data || res))
        .catch(console.error);
    }
  }, [selectedBatch]);

  return (
    <div className="aura-page">
      <div className="aura-container">
        <PageHeader
          eyebrow="Projects"
          title="Project Hub"
          description="Manage your academic projects, team formation, deliverables, and milestones."
          actions={
            selectedBatch ? (
              <Button
                variant="secondary"
                icon={ArrowLeft}
                onClick={() => { setSelectedBatch(null); setBatchInfo(null); }}
              >
                Back to Batches
              </Button>
            ) : null
          }
        />

        <WelcomeBanner />

        {!selectedBatch && (
          <div className="mt-6">
            <BatchSelection onSelect={setSelectedBatch} />
          </div>
        )}

        {selectedBatch && batchInfo && (
          <div className="mt-6 space-y-6">
            <ProjectStats batchId={selectedBatch} />
            <ProjectCatalog batchId={selectedBatch} />
            <TeamFormation batchId={selectedBatch} />
            <ProjectTeamStatus batchId={selectedBatch} />
            <DeliverableUpload batchId={selectedBatch} />
          </div>
        )}
      </div>
    </div>
  );
}
