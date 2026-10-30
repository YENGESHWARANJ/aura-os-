const evidenceService = require("../services/evidenceService");

/**
 * Controller for Verifiable Academic Evidence Wallet
 */
class EvidenceController {
  // GET /api/v1/evidence/wallet
  async getWallet(req, res) {
    try {
      const data = await evidenceService.getStudentWallet(req.user.id);
      res.json({ success: true, data });
    } catch (err) {
      console.error("Evidence getWallet error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to load evidence wallet" });
    }
  }

  // POST /api/v1/evidence
  async createEvidence(req, res) {
    try {
      const { title, category } = req.body;
      if (!title || !category) {
        return res.status(400).json({ success: false, message: "Title and Category are required" });
      }

      const evidence = await evidenceService.createEvidence(req.user.id, req.body);
      res.status(201).json({ success: true, data: evidence, message: "Evidence record submitted for verification" });
    } catch (err) {
      console.error("Evidence createEvidence error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to create evidence record" });
    }
  }

  // GET /api/v1/evidence/pending (Faculty / Mentor / Admin only)
  async getPendingQueue(req, res) {
    try {
      const data = await evidenceService.getPendingVerifications();
      res.json({ success: true, data });
    } catch (err) {
      console.error("Evidence getPendingQueue error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to load pending queue" });
    }
  }

  // PATCH /api/v1/evidence/:id/verify (Faculty / Mentor / Admin only)
  async verifyEvidence(req, res) {
    try {
      const { status, verifierRemarks } = req.body;
      if (!["verified", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Status must be 'verified' or 'rejected'" });
      }

      const evidence = await evidenceService.verifyEvidence(req.params.id, req.user, {
        status,
        verifierRemarks,
      });

      res.json({
        success: true,
        data: evidence,
        message: `Evidence has been ${status} successfully with cryptographic seal`,
      });
    } catch (err) {
      console.error("Evidence verifyEvidence error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to update evidence status" });
    }
  }

  // PATCH /api/v1/evidence/:id/disclosure (Student only)
  async updateDisclosure(req, res) {
    try {
      const evidence = await evidenceService.updateSelectiveDisclosure(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({
        success: true,
        data: evidence,
        message: "Selective disclosure preferences updated",
      });
    } catch (err) {
      console.error("Evidence updateDisclosure error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to update disclosure settings" });
    }
  }

  // GET /api/v1/evidence/public/:verificationId (PUBLIC - No Auth Required)
  async getPublicVerification(req, res) {
    try {
      const { verificationId } = req.params;
      const data = await evidenceService.resolvePublicVerification(verificationId);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Verification ID ${verificationId} was not found in the AURA OS Academic Registry`,
        });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Evidence getPublicVerification error:", err);
      res.status(500).json({ success: false, message: "Failed to resolve public verification" });
    }
  }
}

module.exports = new EvidenceController();
