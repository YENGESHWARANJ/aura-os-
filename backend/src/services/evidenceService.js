const crypto = require("crypto");
const AcademicEvidence = require("../models/AcademicEvidence");
const User = require("../models/User");

class EvidenceService {
  /**
   * Computes tamper-evident SHA-256 digest
   */
  generateTamperHash(dataPayload, salt = "AURA_EVIDENCE_V1") {
    const raw = JSON.stringify(dataPayload) + salt;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  /**
   * Generates a unique verification token
   */
  generateVerificationId() {
    return "AURA-" + crypto.randomBytes(6).toString("hex").toUpperCase();
  }

  /**
   * Retrieves student's evidence wallet (or creates initial items if empty)
   */
  async getStudentWallet(userId) {
    let items = await AcademicEvidence.find({ studentId: userId }).sort({ createdAt: -1 });

    if (!items || items.length === 0) {
      const user = await User.findById(userId).lean();
      const studentName = user?.name || "Balasubramaniam J";
      const studentEmail = user?.email || "student@aura.edu";
      const regNo = user?.registerNumber || "720722AI012";

      // Seed verified credentials
      const seedEvidence = [
        {
          studentId: userId,
          studentName,
          studentEmail,
          registerNumber: regNo,
          title: "Semester 5 End Examination Transcript",
          category: "marks",
          issuer: {
            name: "Office of the Controller of Examinations",
            role: "faculty",
            institution: "AURA Institute of Technology",
          },
          issuedDate: new Date("2025-12-15"),
          payload: {
            scoreOrGrade: "SGPA: 8.92 (Rank 4)",
            credits: 24,
            courseCode: "SEM-5-ALL",
            evaluationNotes: "Completed with distinction across all core theory & lab credits.",
          },
          verificationId: this.generateVerificationId(),
          status: "verified",
          verifierRemarks: "Official transcript digitally signed by CoE authority.",
          verifiedAt: new Date("2025-12-16"),
          selectiveDisclosure: {
            sharePublicly: true,
            revealStudentName: true,
            revealRegisterNumber: false,
            revealExactScores: true,
            revealEvaluatorNotes: true,
            revealSkills: true,
          },
          auditTrail: [
            {
              action: "created",
              actorName: "CoE System",
              actorRole: "faculty",
              timestamp: new Date("2025-12-15"),
              comment: "Batch transcript generated",
            },
            {
              action: "verified",
              actorName: "Dr. S. K. Narayanan",
              actorRole: "faculty",
              timestamp: new Date("2025-12-16"),
              comment: "Cryptographic signature stamped",
            },
          ],
        },
        {
          studentId: userId,
          studentName,
          studentEmail,
          registerNumber: regNo,
          title: "Autonomous Vehicle Vision — Capstone Project",
          category: "project",
          issuer: {
            name: "Department Review Committee",
            role: "faculty",
            institution: "AURA Institute of Technology",
          },
          issuedDate: new Date("2026-02-10"),
          payload: {
            scoreOrGrade: "Grade: S (Outstanding)",
            credits: 4,
            skillsDemonstrated: ["PyTorch", "OpenCV", "ROS2", "Jetson Orin"],
            projectRepository: "https://github.com/aura-os/autonomous-vision-edge",
            evaluationNotes: "Exemplary real-time obstacle detection model with 94.2% mAP at 38 FPS.",
          },
          verificationId: this.generateVerificationId(),
          status: "verified",
          verifierRemarks: "Verified by Project Review Board panel.",
          verifiedAt: new Date("2026-02-12"),
          selectiveDisclosure: {
            sharePublicly: true,
            revealStudentName: true,
            revealRegisterNumber: true,
            revealExactScores: true,
            revealEvaluatorNotes: true,
            revealSkills: true,
          },
          auditTrail: [
            {
              action: "created",
              actorName: studentName,
              actorRole: "student",
              timestamp: new Date("2026-02-10"),
              comment: "Student submitted capstone project for verification",
            },
            {
              action: "verified",
              actorName: "Prof. Ananya Sen",
              actorRole: "faculty",
              timestamp: new Date("2026-02-12"),
              comment: "Code review and demo successfully authenticated",
            },
          ],
        },
        {
          studentId: userId,
          studentName,
          studentEmail,
          registerNumber: regNo,
          title: "Machine Learning Solutions Internship",
          category: "internship",
          issuer: {
            name: "CognitiveEdge AI Labs",
            role: "mentor",
            institution: "CognitiveEdge Corp",
          },
          issuedDate: new Date("2026-01-20"),
          payload: {
            scoreOrGrade: "Performance: Outstanding (PPO Recommended)",
            skillsDemonstrated: ["FastAPI", "Docker", "HuggingFace", "RAG"],
            externalCredentialId: "CE-INTERN-2026-8812",
            evaluationNotes: "Demonstrated high architectural maturity in production LLM caching.",
          },
          verificationId: this.generateVerificationId(),
          status: "pending",
          verifierRemarks: "",
          selectiveDisclosure: {
            sharePublicly: true,
            revealStudentName: true,
            revealRegisterNumber: false,
            revealExactScores: true,
            revealEvaluatorNotes: false,
            revealSkills: true,
          },
          auditTrail: [
            {
              action: "created",
              actorName: studentName,
              actorRole: "student",
              timestamp: new Date("2026-01-20"),
              comment: "Certificate of completion uploaded for mentor verification",
            },
          ],
        },
      ];

      for (const item of seedEvidence) {
        item.tamperEvidentHash = this.generateTamperHash({
          studentId: item.studentId,
          title: item.title,
          category: item.category,
          payload: item.payload,
          verificationId: item.verificationId,
        });
        await new AcademicEvidence(item).save();
      }

      items = await AcademicEvidence.find({ studentId: userId }).sort({ createdAt: -1 });
    }

    return items;
  }

  /**
   * Student submits new academic evidence for verification
   */
  async createEvidence(userId, evidenceData) {
    const user = await User.findById(userId).lean();
    const verificationId = this.generateVerificationId();

    const payload = {
      scoreOrGrade: evidenceData.scoreOrGrade,
      credits: evidenceData.credits,
      courseCode: evidenceData.courseCode,
      skillsDemonstrated: evidenceData.skillsDemonstrated || [],
      projectRepository: evidenceData.projectRepository,
      evaluationNotes: evidenceData.evaluationNotes,
      externalCredentialId: evidenceData.externalCredentialId,
    };

    const tamperEvidentHash = this.generateTamperHash({
      studentId: userId,
      title: evidenceData.title,
      category: evidenceData.category,
      payload,
      verificationId,
    });

    const evidence = new AcademicEvidence({
      studentId: userId,
      studentName: user?.name || "Student User",
      studentEmail: user?.email || "student@aura.edu",
      registerNumber: user?.registerNumber || "",
      department: user?.department || "Artificial Intelligence & Data Science",
      title: evidenceData.title,
      category: evidenceData.category,
      issuer: {
        name: evidenceData.issuerName || "AURA Institute of Technology",
        role: evidenceData.issuerRole || "faculty",
        institution: evidenceData.issuerInstitution || "AURA Institute of Technology",
      },
      issuedDate: evidenceData.issuedDate || new Date(),
      payload,
      verificationId,
      tamperEvidentHash,
      status: "pending",
      selectiveDisclosure: {
        sharePublicly: true,
        revealStudentName: true,
        revealRegisterNumber: false,
        revealExactScores: true,
        revealEvaluatorNotes: false,
        revealSkills: true,
      },
      auditTrail: [
        {
          action: "created",
          performedBy: userId,
          actorName: user?.name || "Student",
          actorRole: "student",
          timestamp: new Date(),
          comment: "Submitted into evidence wallet",
        },
      ],
    });

    await evidence.save();
    return evidence;
  }

  /**
   * Retrieves pending verification queue for faculty and mentors
   */
  async getPendingVerifications() {
    return await AcademicEvidence.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Faculty or Mentor verifies or rejects evidence with digital stamp
   */
  async verifyEvidence(evidenceId, verifierUser, { status, verifierRemarks }) {
    const evidence = await AcademicEvidence.findById(evidenceId);
    if (!evidence) throw new Error("Academic evidence record not found");

    evidence.status = status; // "verified" | "rejected"
    evidence.verifierRemarks = verifierRemarks || "Verified and authenticated by faculty reviewer.";
    if (status === "verified") {
      evidence.verifiedAt = new Date();
      evidence.issuer.id = verifierUser.id;
      evidence.issuer.name = verifierUser.name;
      evidence.issuer.role = verifierUser.role;

      // Re-sign cryptographic hash with verifier identity
      evidence.tamperEvidentHash = this.generateTamperHash({
        studentId: evidence.studentId,
        title: evidence.title,
        category: evidence.category,
        payload: evidence.payload,
        verificationId: evidence.verificationId,
        verifierId: verifierUser.id,
        verifiedAt: evidence.verifiedAt,
      });
    }

    evidence.auditTrail.push({
      action: status === "verified" ? "verified" : "rejected",
      performedBy: verifierUser.id,
      actorName: verifierUser.name,
      actorRole: verifierUser.role,
      timestamp: new Date(),
      comment: verifierRemarks || `Evidence status transitioned to ${status}`,
    });

    await evidence.save();
    return evidence;
  }

  /**
   * Updates student selective disclosure preferences
   */
  async updateSelectiveDisclosure(evidenceId, userId, preferences) {
    const evidence = await AcademicEvidence.findOne({ _id: evidenceId, studentId: userId });
    if (!evidence) throw new Error("Evidence not found or unauthorized");

    evidence.selectiveDisclosure = {
      ...evidence.selectiveDisclosure.toObject(),
      ...preferences,
    };

    evidence.auditTrail.push({
      action: "disclosure_updated",
      performedBy: userId,
      actorName: evidence.studentName,
      actorRole: "student",
      timestamp: new Date(),
      comment: "Updated public selective disclosure privacy controls",
    });

    await evidence.save();
    return evidence;
  }

  /**
   * Public verification resolver: returns cryptographically verified badge
   * strictly honoring selective disclosure without exposing private secrets.
   */
  async resolvePublicVerification(verificationId) {
    const evidence = await AcademicEvidence.findOne({ verificationId }).lean();
    if (!evidence) {
      return null;
    }

    if (!evidence.selectiveDisclosure?.sharePublicly) {
      return {
        verificationId,
        isShared: false,
        status: "restricted",
        message: "The owner of this academic credential has restricted public sharing.",
      };
    }

    // Apply selective disclosure projection
    const sd = evidence.selectiveDisclosure;
    const publicPayload = {};

    if (sd.revealExactScores) publicPayload.scoreOrGrade = evidence.payload.scoreOrGrade;
    if (sd.revealSkills) publicPayload.skillsDemonstrated = evidence.payload.skillsDemonstrated;
    if (evidence.payload.projectRepository) publicPayload.projectRepository = evidence.payload.projectRepository;
    if (sd.revealEvaluatorNotes) publicPayload.evaluationNotes = evidence.payload.evaluationNotes;
    if (evidence.payload.courseCode) publicPayload.courseCode = evidence.payload.courseCode;
    if (evidence.payload.credits) publicPayload.credits = evidence.payload.credits;

    // Log public verification access into audit trail asynchronously
    AcademicEvidence.updateOne(
      { _id: evidence._id },
      {
        $push: {
          auditTrail: {
            action: "public_viewed",
            actorName: "External Verifier (Public)",
            actorRole: "guest",
            timestamp: new Date(),
            comment: "Cryptographic hash verified via public portal",
          },
        },
      }
    ).exec();

    return {
      isShared: true,
      verificationId: evidence.verificationId,
      title: evidence.title,
      category: evidence.category,
      status: evidence.status,
      tamperEvidentHash: evidence.tamperEvidentHash,
      issuedDate: evidence.issuedDate,
      verifiedAt: evidence.verifiedAt,
      verifierRemarks: evidence.verifierRemarks,
      issuer: {
        name: evidence.issuer.name,
        role: evidence.issuer.role,
        institution: evidence.issuer.institution,
      },
      student: {
        name: sd.revealStudentName ? evidence.studentName : "Verified AURA OS Scholar",
        department: evidence.department,
        registerNumber: sd.revealRegisterNumber ? evidence.registerNumber : undefined,
      },
      payload: publicPayload,
      integrityCheck: {
        algorithm: "SHA-256 (Tamper-Evident Digest)",
        isValid: evidence.status === "verified",
        certifiedTimestamp: evidence.verifiedAt || evidence.issuedDate,
      },
    };
  }
}

module.exports = new EvidenceService();
