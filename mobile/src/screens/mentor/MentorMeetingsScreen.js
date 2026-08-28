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
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const INITIAL_MEETINGS = [
  {
    id: "mt-1",
    student: "Deepak Kumar",
    roll: "21CS103",
    date: "Aug 30, 2026",
    time: "03:30 PM",
    room: "Cabin 204",
    topic: "Attendance Recovery & Internal 2 Preparation Strategy",
    status: "Upcoming",
  },
  {
    id: "mt-2",
    student: "Rahul Varma",
    roll: "21CS108",
    date: "Sep 01, 2026",
    time: "10:00 AM",
    room: "Cabin 204",
    topic: "Remedial Coaching Plan & Parent Consultation",
    status: "Upcoming",
  },
  {
    id: "mt-3",
    student: "Alex Johnson",
    roll: "21CS101",
    date: "Aug 18, 2026",
    time: "02:00 PM",
    room: "Cabin 204",
    topic: "Capstone Project Phase 2 Review & Internship Discussion",
    status: "Completed",
  },
];

export default function MentorMeetingsScreen({ navigation }) {
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [meetingDate, setMeetingDate] = useState("2026-09-03");
  const [meetingTopic, setMeetingTopic] = useState("");

  const handleCreateMeeting = () => {
    if (!studentName.trim() || !meetingTopic.trim()) {
      Alert.alert("Error", "Please provide student name and meeting agenda.");
      return;
    }

    const newMeeting = {
      id: `mt-${Date.now()}`,
      student: studentName.trim(),
      roll: "21CS...",
      date: meetingDate,
      time: "03:00 PM",
      room: "Cabin 204",
      topic: meetingTopic.trim(),
      status: "Upcoming",
    };

    setMeetings([newMeeting, ...meetings]);
    Alert.alert("Meeting Scheduled", `1-on-1 Mentoring session invitation sent to ${studentName}.`);
    setShowModal(false);
    setStudentName("");
    setMeetingTopic("");
  };

  return (
    <View style={styles.container}>
      <Header
        title="Mentoring Meetings"
        subtitle="1-on-1 Counseling & Check-ins"
        onBack={() => navigation.goBack()}
        role="Mentor"
        rightIcon="add-circle-outline"
        onRightPress={() => setShowModal(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Scheduled Sessions ({meetings.length})</Text>
          <Button
            title="Book Session"
            size="sm"
            icon="calendar-outline"
            onPress={() => setShowModal(true)}
          />
        </View>

        {meetings.map((meeting) => {
          const isUpcoming = meeting.status === "Upcoming";

          return (
            <Card key={meeting.id} style={styles.meetingCard}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.studentName}>{meeting.student}</Text>
                  <Text style={styles.roll}>{meeting.roll}</Text>
                </View>
                <Badge
                  label={meeting.status}
                  size="sm"
                  color={isUpcoming ? colors.warning : colors.success}
                  icon={isUpcoming ? "time-outline" : "checkmark-done-outline"}
                />
              </View>

              <Text style={styles.topicText}>{meeting.topic}</Text>

              <View style={styles.cardBottom}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.secondaryLight} />
                  <Text style={styles.infoText}>{meeting.date} • {meeting.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textDark} />
                  <Text style={styles.infoText}>{meeting.room}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Book Meeting Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Mentoring Session</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Input
              label="Mentee Name / Roll"
              value={studentName}
              onChangeText={setStudentName}
              placeholder="e.g. Deepak Kumar (21CS103)"
              icon="person-outline"
            />

            <Input
              label="Meeting Date"
              value={meetingDate}
              onChangeText={setMeetingDate}
              placeholder="YYYY-MM-DD"
              icon="calendar-outline"
            />

            <Input
              label="Meeting Agenda & Discussion Topics"
              value={meetingTopic}
              onChangeText={setMeetingTopic}
              placeholder="e.g. Remedial tutoring plan & attendance status"
              multiline
              numberOfLines={3}
              icon="document-text-outline"
            />

            <Button
              title="Confirm & Send Invite"
              onPress={handleCreateMeeting}
              icon="checkmark-circle-outline"
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  meetingCard: {
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  studentName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  roll: {
    color: colors.secondaryLight,
    fontSize: 10,
    marginTop: 1,
  },
  topicText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    color: colors.textDark,
    fontSize: 10,
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
