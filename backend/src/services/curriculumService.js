const CurriculumIntelligence = require("../models/CurriculumIntelligence");

class CurriculumService {
  /**
   * Retrieves comprehensive curriculum intelligence & observatory metrics
   */
  async getObservatoryMetrics() {
    let observatory = await CurriculumIntelligence.findOne().sort({ createdAt: -1 }).lean();

    // If no record exists yet in database, provide rich institutional seed data
    if (!observatory) {
      observatory = {
        department: "Artificial Intelligence & Data Science",
        semester: 6,
        academicYear: "2025-2026",
        overallCurriculumHealthScore: 78.4,
        skillGapIndex: 34.2,
        topics: [
          {
            courseCode: "22AI601",
            courseName: "Cloud & Distributed Systems",
            topicName: "Monolithic SOAP Web Services",
            status: "outdated",
            failureRatePercent: 12,
            studentStruggleScore: 45,
            practicalActivityScore: 30,
            industryRelevanceScore: 18,
          },
          {
            courseCode: "22AI601",
            courseName: "Cloud & Distributed Systems",
            topicName: "Kubernetes & Microservices Mesh",
            status: "critical_gap",
            failureRatePercent: 44,
            studentStruggleScore: 82,
            practicalActivityScore: 25,
            industryRelevanceScore: 96,
          },
          {
            courseCode: "22AI602",
            courseName: "Natural Language Processing",
            topicName: "N-gram Statistical Modeling",
            status: "outdated",
            failureRatePercent: 18,
            studentStruggleScore: 35,
            practicalActivityScore: 40,
            industryRelevanceScore: 28,
          },
          {
            courseCode: "22AI602",
            courseName: "Natural Language Processing",
            topicName: "LLM Fine-Tuning & RAG Pipelines",
            status: "emerging",
            failureRatePercent: 52,
            studentStruggleScore: 88,
            practicalActivityScore: 35,
            industryRelevanceScore: 98,
          },
          {
            courseCode: "22AI603",
            courseName: "Deep Learning Foundations",
            topicName: "Vanilla Perceptron Backpropagation",
            status: "current",
            failureRatePercent: 15,
            studentStruggleScore: 30,
            practicalActivityScore: 75,
            industryRelevanceScore: 65,
          },
          {
            courseCode: "22AI604",
            courseName: "Database Engineering",
            topicName: "Relational B-Tree Tuning Only",
            status: "outdated",
            failureRatePercent: 22,
            studentStruggleScore: 40,
            practicalActivityScore: 50,
            industryRelevanceScore: 42,
          },
          {
            courseCode: "22AI604",
            courseName: "Database Engineering",
            topicName: "Vector Databases & Graph Databases",
            status: "critical_gap",
            failureRatePercent: 48,
            studentStruggleScore: 79,
            practicalActivityScore: 20,
            industryRelevanceScore: 94,
          },
        ],
        benchmarks: [
          {
            skillName: "Vector DBs (Pinecone/Milvus/pgvector)",
            domain: "AI Infrastructure",
            marketDemandTrend: "Surging",
            curriculumCoveragePercent: 15,
            studentMasteryPercent: 22,
            gapSeverity: "Critical",
          },
          {
            skillName: "Containerization & Docker Orchestration",
            domain: "DevOps & Cloud",
            marketDemandTrend: "Surging",
            curriculumCoveragePercent: 35,
            studentMasteryPercent: 41,
            gapSeverity: "Critical",
          },
          {
            skillName: "PyTorch & TensorRT Optimization",
            domain: "Deep Learning",
            marketDemandTrend: "Surging",
            curriculumCoveragePercent: 55,
            studentMasteryPercent: 48,
            gapSeverity: "Moderate",
          },
          {
            skillName: "Production REST & GraphQL Microservices",
            domain: "Full-Stack Systems",
            marketDemandTrend: "Stable",
            curriculumCoveragePercent: 60,
            studentMasteryPercent: 58,
            gapSeverity: "Moderate",
          },
          {
            skillName: "Statistical Text Processing (N-Grams)",
            domain: "NLP",
            marketDemandTrend: "Declining",
            curriculumCoveragePercent: 85,
            studentMasteryPercent: 78,
            gapSeverity: "Minor",
          },
        ],
        suggestions: [
          {
            id: "sug-001",
            courseCode: "22AI602",
            title: "Replace N-Grams with Retrieval-Augmented Generation (RAG)",
            category: "outdated_topic_replacement",
            description:
              "Current syllabus dedicates 4 lecture weeks to legacy n-gram statistical language models. Modern industry hiring exclusively seeks Transformer architectures and vector retrieval pipelines.",
            evidence: {
              failureRate: 48,
              industryDemandIncrease: "+312% YoY job mentions in 2025-2026",
              studentSurveyGap: "84% of students reported learning RAG outside classroom",
              sampleJobPostingsCount: 1420,
            },
            recommendedAction:
              "Condense n-grams into 1 foundational lecture; add 3 hands-on weeks on LangChain/LlamaIndex vector embeddings.",
            priority: "High",
            status: "proposed",
            facultyReviews: [],
          },
          {
            id: "sug-002",
            courseCode: "22AI601",
            title: "Mandate Docker & Cloud Deployment Lab Practicals",
            category: "practical_lab_addition",
            description:
              "Students demonstrate solid theoretical comprehension of distributed nodes but 72% fail to build reproducible container environments during internship onboarding tests.",
            evidence: {
              failureRate: 38,
              industryDemandIncrease: "+88% cloud internship requirement",
              studentSurveyGap: "67% lack Docker containerization experience",
              sampleJobPostingsCount: 940,
            },
            recommendedAction:
              "Introduce 4 new guided lab exercises deploying multi-container microservices on local Docker and AWS Free Tier.",
            priority: "High",
            status: "under_faculty_review",
            facultyReviews: [
              {
                reviewerName: "Dr. K. Ramanathan (HOD)",
                decision: "Approved",
                feedback: "Strongly agreed. Incorporate into next academic council revision.",
                reviewedAt: new Date(Date.now() - 86400000 * 2),
              },
            ],
          },
          {
            id: "sug-003",
            courseCode: "22AI604",
            title: "Add Vector Database Querying to Database Systems",
            category: "missing_industry_skill",
            description:
              "Database Engineering syllabus is strictly limited to SQL relations and normalization. Modern AI engineering demands embeddings similarity search.",
            evidence: {
              failureRate: 42,
              industryDemandIncrease: "+180% AI data engineer demand",
              studentSurveyGap: "79% express interest in vector embeddings",
              sampleJobPostingsCount: 680,
            },
            recommendedAction:
              "Add Module 5: Approximate Nearest Neighbors (HNSW/IVF) and pgvector integration.",
            priority: "Medium",
            status: "proposed",
            facultyReviews: [],
          },
        ],
      };
    }

    return observatory;
  }

  /**
   * Faculty reviews and approves or submits feedback for a curriculum suggestion
   */
  async submitFacultyReview(facultyId, facultyName, { suggestionId, decision, feedback }) {
    let observatory = await CurriculumIntelligence.findOne();
    if (!observatory) {
      // Create initial document if not present
      const initial = await this.getObservatoryMetrics();
      observatory = new CurriculumIntelligence(initial);
      await observatory.save();
    }

    const suggestion = observatory.suggestions.find((s) => s.id === suggestionId);
    if (!suggestion) {
      throw new Error(`Curriculum suggestion with ID ${suggestionId} not found`);
    }

    suggestion.facultyReviews.push({
      reviewerId: facultyId,
      reviewerName: facultyName || "Faculty Reviewer",
      decision, // "Approved" | "Needs Revision" | "Rejected"
      feedback: feedback || "Reviewed and evaluated against department academic standards.",
      reviewedAt: new Date(),
    });

    if (decision === "Approved") {
      suggestion.status = "approved";
    } else if (decision === "Needs Revision") {
      suggestion.status = "under_faculty_review";
    } else {
      suggestion.status = "rejected";
    }

    await observatory.save();
    return suggestion;
  }
}

module.exports = new CurriculumService();
