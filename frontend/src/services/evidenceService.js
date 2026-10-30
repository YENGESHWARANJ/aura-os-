import api from "./api";

const evidenceService = {
  // Get student evidence wallet
  getWallet: async () => {
    const response = await api.get("/evidence/wallet");
    return response.data;
  },

  // Submit new evidence item
  createEvidence: async (evidenceData) => {
    const response = await api.post("/evidence", evidenceData);
    return response.data;
  },

  // Faculty/Mentor: get pending verification queue
  getPendingQueue: async () => {
    const response = await api.get("/evidence/pending");
    return response.data;
  },

  // Faculty/Mentor: verify or reject evidence record
  verifyEvidence: async (evidenceId, status, verifierRemarks) => {
    const response = await api.patch(`/evidence/${evidenceId}/verify`, {
      status,
      verifierRemarks,
    });
    return response.data;
  },

  // Student: update selective disclosure settings
  updateDisclosure: async (evidenceId, preferences) => {
    const response = await api.patch(`/evidence/${evidenceId}/disclosure`, preferences);
    return response.data;
  },

  // Public: resolve external verification link (no auth token required)
  getPublicVerification: async (verificationId) => {
    const response = await api.get(`/evidence/public/${verificationId}`);
    return response.data;
  },
};

export default evidenceService;
