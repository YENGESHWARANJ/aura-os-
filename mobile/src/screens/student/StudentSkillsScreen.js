import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import ProgressBar from "../../components/common/ProgressBar";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const INITIAL_SKILLS = [
  { id: "sk-1", name: "Machine Learning & Scikit-Learn", category: "AI/ML", proficiency: 88, verified: true, level: "Advanced" },
  { id: "sk-2", name: "Distributed Systems (Raft/Paxos)", category: "Systems", proficiency: 75, verified: true, level: "Proficient" },
  { id: "sk-3", name: "React Native & Expo", category: "Mobile Dev", proficiency: 82, verified: false, level: "Proficient" },
  { id: "sk-4", name: "Docker & Kubernetes Deployment", category: "DevOps", proficiency: 65, verified: false, level: "Intermediate" },
  { id: "sk-5", name: "Data Structures & Algorithms", category: "Core CS", proficiency: 92, verified: true, level: "Expert" },
];

export default function StudentSkillsScreen({ navigation }) {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newCategory, setNewCategory] = useState("AI/ML");
  const [evidenceLink, setEvidenceLink] = useState("");

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      Alert.alert("Error", "Please enter a skill name");
      return;
    }

    const newSkill = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newCategory,
      proficiency: 70,
      verified: false,
      level: "Intermediate",
    };

    setSkills([newSkill, ...skills]);
    Alert.alert("Success", "Skill added and submitted for faculty endorsement!");
    setShowAddModal(false);
    setNewSkillName("");
    setEvidenceLink("");
  };

  return (
    <View style={styles.container}>
      <Header
        title="Skill Matrix"
        subtitle="Competency & Verification Badges"
        onBack={() => navigation.goBack()}
        rightIcon="add-circle-outline"
        onRightPress={() => setShowAddModal(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Skill Readiness Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>Placement Readiness</Text>
              <Text style={styles.summarySub}>Tier-1 Tech Role Alignment</Text>
            </View>
            <Badge label="85% Ready" color={colors.success} />
          </View>

          <ProgressBar
            progress={85}
            color={colors.success}
            label="Industry Skill Benchmark"
            showLabel
            style={{ marginVertical: 10 }}
          />

          <Button
            title="Add Skill / Submit Evidence"
            size="sm"
            icon="ribbon-outline"
            onPress={() => setShowAddModal(true)}
          />
        </Card>

        {/* Skill Cards */}
        <Text style={styles.sectionTitle}>My Verified Competencies</Text>

        {skills.map((skill) => (
          <Card key={skill.id} style={styles.skillCard}>
            <View style={styles.skillHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Badge label={skill.category} size="sm" color={colors.primary} />
                  {skill.verified && (
                    <Badge label="Verified" size="sm" color={colors.success} icon="checkmark-circle" />
                  )}
                </View>
                <Text style={styles.skillName}>{skill.name}</Text>
              </View>
              <View style={styles.levelWrap}>
                <Text style={styles.levelText}>{skill.level}</Text>
                <Text style={styles.percentText}>{skill.proficiency}%</Text>
              </View>
            </View>

            <ProgressBar
              progress={skill.proficiency}
              color={
                skill.proficiency >= 80
                  ? colors.primary
                  : skill.proficiency >= 60
                  ? colors.secondary
                  : colors.warning
              }
              style={{ marginTop: 8 }}
            />
          </Card>
        ))}
      </ScrollView>

      {/* Add Skill Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Skill & Evidence</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Skill Name"
              value={newSkillName}
              onChangeText={setNewSkillName}
              placeholder="e.g. PyTorch, GraphQL, Microservices"
              icon="flash-outline"
            />

            <Input
              label="Category"
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="e.g. AI/ML, Cloud, Web, Security"
              icon="layers-outline"
            />

            <Input
              label="Evidence URL (Certificate or GitHub)"
              value={evidenceLink}
              onChangeText={setEvidenceLink}
              placeholder="https://coursera.org/verify/..."
              icon="link-outline"
            />

            <Button
              title="Save & Submit for Review"
              onPress={handleAddSkill}
              icon="checkmark-outline"
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  summarySub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  skillCard: {
    padding: 14,
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  skillName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  levelWrap: {
    alignItems: "flex-end",
  },
  levelText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  percentText: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
