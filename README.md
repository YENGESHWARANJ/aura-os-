# AURA OS — AI-Driven Student Academic Performance Monitoring & Personalized Learning Platform

AURA OS is an enterprise AI-driven academic monitoring, performance prediction, and personalized learning system designed for students, teachers, mentors, parents, and administrators.

---

## 📌 Project Concept (IDEA)

AURA OS continuously monitors students' academic performance using multi-input indicators:
* **Marks** (Internal and semester examination results)
* **Attendance** (Session-level & biometric records)
* **Assignments** (Submission speed & accuracy)
* **Quizzes** (Concept retention scores)

The platform analyzes this data using Artificial Intelligence and Machine Learning (Random Forest & Decision Trees) to predict future academic outcomes, identify weak subjects and learning gaps, and generate personalized study recommendations and mentoring schedules.

---

## ⚙️ System Algorithm (13 Steps)

1. **START**
2. **COLLECT** student data (Marks, Attendance, Assignment scores, Quiz scores, Previous GPA).
3. **PREPROCESS** and clean dataset.
4. **DIVIDE** dataset into Training and Testing subsets.
5. **TRAIN** multiple Decision Trees using training data.
6. **PREDICT**: Each Decision Tree predicts student performance.
7. **VOTE**: Combine predictions using Majority Voting (Random Forest Ensemble).
8. **CLASSIFY**: Categorize performance as *Excellent, Good, Average, or Needs Improvement*.
9. **IDENTIFY** subjects where performance is below target threshold.
10. **DETERMINE** Academic Risk Level ($RI$).
11. **GENERATE** personalized study recommendations and mentoring suggestions.
12. **DISPLAY** results on Student, Teacher, Parent, and Admin Dashboards.
13. **STOP**

---

## 🧮 Theoretical & Mathematical Model

### Attendance Formula
$$\text{Attendance (\%)} = \left( \frac{\text{Classes Attended}}{\text{Total Classes}} \right) \times 100$$

### Weighted Academic Score ($S$)
$$S = w_1 M + w_2 A + w_3 AS + w_4 Q$$
* $M$ = Marks, $A$ = Attendance %, $AS$ = Assignment Score, $Q$ = Quiz Score
* Weight constraint: $\sum_{i=1}^{4} w_i = w_1 + w_2 + w_3 + w_4 = 1.0$

### Risk Index ($RI$)
$$RI = (100 - S) + \max(0, 75 - A) \times 1.5$$

---

## 🏗️ Overall Implementation Pipeline

$$\text{Requirement Analysis} \longrightarrow \text{UI/UX Design} \longrightarrow \text{Flutter Development} \longrightarrow \text{Firebase Integration} \longrightarrow \text{AI Model Development} \longrightarrow \text{AI Integration} \longrightarrow \text{Testing} \longrightarrow \text{Deployment}$$

---

## 💻 Hardware Architecture

- **User Devices**: Android Smartphones for Students, Teachers, and Parents.
- **Development Workstation**: Laptop / Desktop PC for development and testing.
- **Network**: Internet / Wi-Fi connection.
- **Cloud Services**: Firebase Authentication, Realtime Database, Cloud Messaging.
- **Testing Environment**: Android Emulator or Physical Android Device.

---

## 🛠️ Technology Stack

- **Mobile App**: Flutter Framework
- **Web Dashboard**: React.js / Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend APIs**: Node.js, Express.js
- **Database & Auth**: Firebase Services & MongoDB
- **AI / ML Pipeline**: Python, Scikit-Learn (Random Forest, Decision Trees)

---

## 📁 Documentation & Files

- [docs/PROJECT_SPECIFICATION_AND_ALGORITHM.md](file:///c:/Users/balas/OneDrive/Desktop/AURA-OS/docs/PROJECT_SPECIFICATION_AND_ALGORITHM.md): Full algorithm, mathematical equations, risk formulas, hardware requirements, and strategy analysis.
- [docs/LITERATURE_REVIEW_AND_PROBLEM_FORMULATION.md](file:///c:/Users/balas/OneDrive/Desktop/AURA-OS/docs/LITERATURE_REVIEW_AND_PROBLEM_FORMULATION.md): Detailed literature review, problem formulation, and supervisor consultation feedback.
