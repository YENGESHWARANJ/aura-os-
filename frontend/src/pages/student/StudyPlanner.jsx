import React, { useState, useEffect, useRef } from 'react';
import '../../components/studyPlanner/StudyPlanner.css';
import * as spService from '../../services/studyPlannerService';

export default function StudyPlanner() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTab, setTaskTab] = useState('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilterSubject, setTaskFilterSubject] = useState('');
  const [taskFilterPriority, setTaskFilterPriority] = useState('');
  const [taskSort, setTaskSort] = useState('dueDate');

  const [todaySessions, setTodaySessions] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [goals, setGoals] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [attentionItems, setAttentionItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [smartPlan, setSmartPlan] = useState([]);

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '', subject: 'Data Structures', type: 'Study', topic: '',
    description: '', dueDate: new Date().toISOString().split('T')[0],
    dueTime: '23:59', priority: 'High', estimatedMinutes: 60
  });

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    subject: 'Data Structures', topic: '', date: new Date().toISOString().split('T')[0],
    startTime: '10:00', endTime: '11:00', priority: 'Medium'
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '', type: 'Study Hours', subject: 'Data Structures', targetValue: 10,
    unit: 'Hours', targetDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], priority: 'Medium'
  });

  // Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerTotal, setTimerTotal] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('25'); // 25, 50, custom
  const [activeSession, setActiveSession] = useState(null);
  const timerRef = useRef(null);

  // Today's goals (checklist)
  const [todayGoalsList, setTodayGoalsList] = useState([
    { id: 1, text: 'Revise Data Structures - Trees & Graphs', done: true },
    { id: 2, text: 'Complete DBMS Assignment', done: false },
    { id: 3, text: 'Practice Machine Learning Regression', done: false },
    { id: 4, text: 'Read Operating Systems Chapter 4', done: true }
  ]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ovData, tasksData, sessData, schedData, goalsData, deadData, attData, anaData, insData] = await Promise.all([
        spService.getOverview().catch(() => null),
        spService.getTasks().catch(() => ({ data: [] })),
        spService.getTodayPlan().catch(() => ({ data: [] })),
        spService.getSchedule().catch(() => ({ data: [] })),
        spService.getGoals().catch(() => ({ data: [] })),
        spService.getDeadlines().catch(() => ({ data: [] })),
        spService.getNeedsAttention().catch(() => ({ data: [] })),
        spService.getAnalytics().catch(() => null),
        spService.getInsights().catch(() => null),
      ]);

      if (ovData?.data) setOverview(ovData.data);
      if (tasksData?.data) setTasks(tasksData.data);
      if (sessData?.data) setTodaySessions(sessData.data);
      if (schedData?.data) setSchedule(schedData.data);
      if (goalsData?.data) setGoals(goalsData.data);
      if (deadData?.data) setDeadlines(deadData.data);
      if (attData?.data) setAttentionItems(attData.data);
      if (anaData?.data) setAnalytics(anaData.data);
      if (insData?.data) setInsights(insData.data);
    } catch (e) {
      console.error('Error loading study planner:', e);
    } finally {
      setLoading(false);
    }
  };

  // Timer tick
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            alert('🎉 Focus Session Completed! Great job!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const setTimerPreset = (mins) => {
    setTimerRunning(false);
    setTimerMode(String(mins));
    setTimerTotal(mins * 60);
    setTimerSeconds(mins * 60);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await spService.createTask(taskForm);
      setShowTaskModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  // Session creation
  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const res = await spService.createSession(sessionForm);
      if (res.conflict) {
        alert(`⚠️ Schedule Conflict Detected!\n${res.message}`);
        return;
      }
      setShowSessionModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating session');
    }
  };

  // Goal creation
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await spService.createGoal(goalForm);
      setShowGoalModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating goal');
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  // Generate Smart Plan
  const handleGenerateSmartPlan = async () => {
    setIsGenerating(true);
    try {
      const res = await spService.generatePlan();
      if (res?.data) {
        setSmartPlan(res.data);
      }
      await loadAllData();
      const todayEl = document.getElementById("today-study-plan");
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      alert("✨ Smart Daily Plan successfully generated! Your daily schedule & sessions have been synchronized.");
    } catch (err) {
      console.error("Failed to generate smart plan:", err);
      alert(err.response?.data?.message || "Failed to generate smart plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Task Complete Toggle
  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await spService.updateTask(task._id, { status: nextStatus, progress: nextStatus === 'Completed' ? 100 : 50 });
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (taskTab === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (new Date(t.dueDate).toISOString().split('T')[0] !== todayStr) return false;
    } else if (taskTab === 'upcoming') {
      if (t.status === 'Completed' || new Date(t.dueDate) < new Date()) return false;
    } else if (taskTab === 'overdue') {
      if (t.status !== 'Overdue' && (t.status === 'Completed' || new Date(t.dueDate) >= new Date())) return false;
    } else if (taskTab === 'completed') {
      if (t.status !== 'Completed') return false;
    }

    if (taskSearch) {
      const q = taskSearch.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return false;
    }
    if (taskFilterSubject && t.subject !== taskFilterSubject) return false;
    if (taskFilterPriority && t.priority !== taskFilterPriority) return false;
    return true;
  });

  return (
    <div className="sp-page text-slate-800">
      {/* ─── PAGE HEADER ────────────────────────────────────────── */}
      <div className="sp-header">
        <div className="sp-header-left">
          <div className="sp-breadcrumb">Dashboard &gt; <span>Study Planner</span></div>
          <h1>Smart Study Planner</h1>
          <p>Plan your studies, manage deadlines, prepare for exams and stay on track with your academic goals.</p>
        </div>
        <div className="sp-header-actions">
          <button className="sp-btn sp-btn-primary" onClick={() => setShowTaskModal(true)}>+ Add Task</button>
          <button className="sp-btn sp-btn-secondary" onClick={() => setShowSessionModal(true)}>+ Study Session</button>
          <button
            className="sp-btn sp-btn-gradient cursor-pointer"
            onClick={handleGenerateSmartPlan}
            disabled={isGenerating}
          >
            {isGenerating ? "⚡ Generating..." : "⚡ Generate Smart Plan"}
          </button>
        </div>
      </div>

      {/* ─── 1. OVERVIEW CARDS ──────────────────────────────────── */}
      <div className="sp-overview-grid">
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon blue">📋</div>
          <div className="sp-kpi-value">{overview?.todayTasks?.total || 6}</div>
          <div className="sp-kpi-label">Today's Tasks</div>
          <div className="sp-kpi-sub"><span className="positive">{overview?.todayTasks?.completed || 2} completed</span></div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon purple">⏱️</div>
          <div className="sp-kpi-value">{overview?.studyTime?.display || '2h 30m'}</div>
          <div className="sp-kpi-label">Study Time Today</div>
          <div className="sp-kpi-sub">Goal: 4h 00m</div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon amber">🔔</div>
          <div className="sp-kpi-value">{overview?.upcomingDeadlines?.total || 4}</div>
          <div className="sp-kpi-label">Upcoming Deadlines</div>
          <div className="sp-kpi-sub">Next: {overview?.upcomingDeadlines?.nearest || 'Tomorrow'}</div>
        </div>
        <div className="sp-kpi-card">
          <div className="sp-kpi-icon green">📊</div>
          <div className="sp-kpi-value">{overview?.weeklyProgress?.percent || 68}%</div>
          <div className="sp-kpi-label">Weekly Progress</div>
          <div className="sp-kpi-sub"><span className="positive">+12% this week</span></div>
        </div>
      </div>

      {/* ─── 2. TODAY'S STUDY PLAN & QUICK ACTIONS ──────────────── */}
      <div className="sp-two-col-wide" id="today-study-plan">
        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">🗓️</span> Today's Study Plan</div>
          <div className="sp-timeline">
            {(todaySessions.length > 0 ? todaySessions : [
              { _id: '1', startTime: '08:00 AM', subject: 'Data Structures', topic: 'Trees & Graphs', plannedMinutes: 60, priority: 'High', status: 'Scheduled' },
              { _id: '2', startTime: '10:30 AM', subject: 'Machine Learning', topic: 'Regression Revision', plannedMinutes: 60, priority: 'Medium', status: 'In Progress' },
              { _id: '3', startTime: '04:00 PM', subject: 'DBMS', topic: 'Complete Assignment', plannedMinutes: 90, priority: 'Urgent', status: 'Scheduled' },
              { _id: '4', startTime: '07:00 PM', subject: 'Web Development', topic: 'Project Development', plannedMinutes: 60, priority: 'Medium', status: 'Scheduled' }
            ]).map(s => (
              <div key={s._id} className={`sp-timeline-item ${s.status.toLowerCase().replace(' ', '-')}`}>
                <div className="sp-timeline-time">{s.startTime}</div>
                <div className="sp-timeline-content">
                  <div className="sp-timeline-subject">{s.subject} - <span className="text-slate-300 font-normal">{s.topic}</span></div>
                  <div className="sp-timeline-meta">
                    <span className="text-xs text-slate-400">⏱️ {s.plannedMinutes} min</span>
                    <span className={`sp-badge ${s.priority?.toLowerCase()}`}>{s.priority} Priority</span>
                    <span className={`sp-badge ${s.status?.toLowerCase().replace(' ', '-')}`}>{s.status}</span>
                  </div>
                  <div className="sp-timeline-actions">
                    <button className="sp-btn sp-btn-xs sp-btn-primary" onClick={() => { setActiveSession(s); setTimerPreset(s.plannedMinutes || 25); }}>▶ Start Session</button>
                    <button className="sp-btn sp-btn-xs sp-btn-success" onClick={() => spService.completeSession(s._id).then(loadAllData)}>✓ Complete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── QUICK ACTIONS & ATTENTION ────────────────────────── */}
        <div className="space-y-6">
          <div className="sp-card">
            <div className="sp-card-title"><span className="icon">⚡</span> Quick Actions</div>
            <div className="sp-quick-actions">
              <button className="sp-quick-action" onClick={() => setShowTaskModal(true)}><span className="icon">+</span> Add Study Task</button>
              <button className="sp-quick-action" onClick={() => setShowSessionModal(true)}><span className="icon">🗓️</span> Schedule Session</button>
              <button className="sp-quick-action" onClick={() => setShowTaskModal(true)}><span className="icon">📖</span> Add Revision</button>
              <button className="sp-quick-action" onClick={() => setShowGoalModal(true)}><span className="icon">🎯</span> Add Goal</button>
            </div>
          </div>

          {/* ─── NEEDS ATTENTION ───────────────────────────────── */}
          <div className="sp-card">
            <div className="sp-card-title text-amber-400"><span className="icon">⚠️</span> Needs Attention</div>
            <div className="space-y-2">
              <div className="sp-attention-item">
                <div className="sp-attention-info">
                  <div className="sp-attention-title">DBMS Assignment</div>
                  <div className="sp-attention-msg">Overdue by 1 day</div>
                </div>
                <div className="sp-attention-actions">
                  <button className="sp-btn sp-btn-xs sp-btn-success">Complete</button>
                  <button className="sp-btn sp-btn-xs sp-btn-warning">Reschedule</button>
                </div>
              </div>
              <div className="sp-attention-item">
                <div className="sp-attention-info">
                  <div className="sp-attention-title">Operating Systems Exam</div>
                  <div className="sp-attention-msg">Low preparation (45%)</div>
                </div>
                <div className="sp-attention-actions">
                  <button className="sp-btn sp-btn-xs sp-btn-primary">Study Plan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. MY TASKS ────────────────────────────────────────── */}
      <div className="sp-card mb-7">
        <div className="sp-card-title justify-between">
          <span><span className="icon">📝</span> My Tasks</span>
          <button className="sp-btn sp-btn-sm sp-btn-primary" onClick={() => setShowTaskModal(true)}>+ New Task</button>
        </div>

        <div className="sp-tabs">
          {['all', 'today', 'upcoming', 'overdue', 'completed'].map(t => (
            <button key={t} className={`sp-tab ${taskTab === t ? 'active' : ''}`} onClick={() => setTaskTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="sp-toolbar">
          <input type="text" className="sp-search" placeholder="Search tasks..." value={taskSearch} onChange={e => setTaskSearch(e.target.value)} />
          <select className="sp-select" value={taskFilterSubject} onChange={e => setTaskFilterSubject(e.target.value)}>
            <option value="">All Subjects</option>
            <option value="Data Structures">Data Structures</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="DBMS">DBMS</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Web Development">Web Development</option>
          </select>
          <select className="sp-select" value={taskFilterPriority} onChange={e => setTaskFilterPriority(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <select className="sp-select" value={taskSort} onChange={e => setTaskSort(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="sp-task-grid">
          {(filteredTasks.length > 0 ? filteredTasks : [
            { _id: 't1', title: 'DBMS Assignment', subject: 'Database Management Systems', type: 'Assignment', dueDate: new Date().toISOString(), priority: 'High', estimatedMinutes: 90, progress: 65, status: 'Pending' },
            { _id: 't2', title: 'ML Regression Quiz Preparation', subject: 'Machine Learning', type: 'Revision', dueDate: new Date(Date.now() + 86400000).toISOString(), priority: 'Urgent', estimatedMinutes: 60, progress: 30, status: 'Pending' },
            { _id: 't3', title: 'Data Structures Graph Algorithms', subject: 'Data Structures', type: 'Study', dueDate: new Date(Date.now() + 172800000).toISOString(), priority: 'Medium', estimatedMinutes: 120, progress: 80, status: 'Scheduled' }
          ]).map(t => (
            <div key={t._id} className="sp-task-card">
              <input type="checkbox" checked={t.status === 'Completed'} onChange={() => handleToggleTaskStatus(t)} className="mt-1 w-4 h-4 rounded accent-blue-500 cursor-pointer" />
              <div className="sp-task-card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`sp-task-card-title ${t.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>{t.title}</div>
                    <div className="sp-task-card-subject">{t.subject}</div>
                  </div>
                  <span className={`sp-badge ${t.priority?.toLowerCase()}`}>{t.priority}</span>
                </div>
                <div className="sp-task-card-meta">
                  <span className="sp-badge type-tag">{t.type}</span>
                  <span className="text-xs text-slate-400">📅 Due {new Date(t.dueDate).toLocaleDateString()}</span>
                  <span className="text-xs text-slate-400">⏱️ {t.estimatedMinutes} min</span>
                </div>
                <div className="sp-progress-bar">
                  <div className={`sp-progress-bar-fill ${t.progress >= 80 ? 'green' : t.progress >= 50 ? 'blue' : 'amber'}`} style={{ width: `${t.progress}%` }}></div>
                </div>
                <div className="sp-progress-text">{t.progress}% completed</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 7. WEEKLY STUDY SCHEDULE ───────────────────────────── */}
      <div className="sp-card mb-7">
        <div className="sp-schedule-controls">
          <div className="sp-card-title mb-0"><span className="icon">📆</span> Weekly Schedule</div>
          <div className="sp-schedule-nav">
            <button>&lt; Previous</button>
            <span className="sp-schedule-label">This Week</span>
            <button>Next &gt;</button>
          </div>
        </div>

        <div className="sp-week-grid">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
            <div key={day} className="sp-day-col">
              <div className={`sp-day-header ${idx === 3 ? 'today' : ''}`}>{day}</div>
              {idx === 0 && (
                <>
                  <div className="sp-day-session"><div className="time">08:00 AM</div><div className="title">DSA Revision</div></div>
                  <div className="sp-day-session"><div className="time">04:00 PM</div><div className="title">DBMS Assignment</div></div>
                </>
              )}
              {idx === 1 && (
                <>
                  <div className="sp-day-session"><div className="time">10:00 AM</div><div className="title">Machine Learning</div></div>
                  <div className="sp-day-session"><div className="time">06:00 PM</div><div className="title">Project Work</div></div>
                </>
              )}
              {idx === 3 && (
                <div className="sp-day-session"><div className="time">02:00 PM</div><div className="title">Web Dev Lab</div></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── 8. DEADLINES & SUBJECT PROGRESS ────────────────────── */}
      <div className="sp-two-col">
        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">⏳</span> Upcoming Deadlines</div>
          <div className="sp-deadline-list">
            {(deadlines.length > 0 ? deadlines : [
              { _id: 'd1', title: 'DBMS Assignment', subject: 'DBMS', dueDate: 'Tomorrow', priority: 'High' },
              { _id: 'd2', title: 'ML Quiz', subject: 'Machine Learning', dueDate: '3 Days', priority: 'Medium' },
              { _id: 'd3', title: 'Project Review', subject: 'Web Dev', dueDate: '5 Days', priority: 'High' },
              { _id: 'd4', title: 'Operating Systems Exam', subject: 'OS', dueDate: '12 Days', priority: 'Urgent' }
            ]).map(d => (
              <div key={d._id} className="sp-deadline-item">
                <div>
                  <div className="sp-deadline-title">{d.title}</div>
                  <div className="text-xs text-slate-400">{d.subject}</div>
                </div>
                <div className="text-right">
                  <div className="sp-deadline-time">{d.dueDate}</div>
                  <span className={`sp-badge ${d.priority?.toLowerCase()}`}>{d.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">📈</span> Subject Progress</div>
          <div className="sp-subject-list">
            {[
              { subject: 'Data Structures', pct: 82 },
              { subject: 'Machine Learning', pct: 70 },
              { subject: 'Database Management Systems', pct: 63 },
              { subject: 'Operating Systems', pct: 55 },
              { subject: 'Web Development', pct: 76 }
            ].map(s => (
              <div key={s.subject} className="sp-subject-item">
                <div className="sp-subject-header">
                  <span className="sp-subject-name">{s.subject}</span>
                  <span className="sp-subject-pct">{s.pct}%</span>
                </div>
                <div className="sp-progress-bar">
                  <div className={`sp-progress-bar-fill ${s.pct >= 80 ? 'green' : s.pct >= 60 ? 'blue' : 'amber'}`} style={{ width: `${s.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 13. FOCUS TIMER & STUDY STREAK ─────────────────────── */}
      <div className="sp-two-col">
        <div className="sp-card sp-timer">
          <div className="sp-card-title justify-center"><span className="icon">⏲️</span> Focus Session</div>
          <div className="sp-timer-label">Current Subject</div>
          <div className="sp-timer-subject">Data Structures - Trees & Graphs</div>

          <div className="sp-timer-modes">
            <button className={`sp-timer-mode ${timerMode === '25' ? 'active' : ''}`} onClick={() => setTimerPreset(25)}>25m Focus</button>
            <button className={`sp-timer-mode ${timerMode === '50' ? 'active' : ''}`} onClick={() => setTimerPreset(50)}>50m Deep Study</button>
            <button className={`sp-timer-mode ${timerMode === '5' ? 'active' : ''}`} onClick={() => setTimerPreset(5)}>5m Break</button>
          </div>

          <div className="sp-timer-ring" style={{ '--progress': `${((timerTotal - timerSeconds) / timerTotal) * 100}%` }}>
            <div className="sp-timer-ring-inner">
              <div className="sp-timer-display">{formatTimer(timerSeconds)}</div>
            </div>
          </div>

          <div className="sp-timer-actions">
            {!timerRunning ? (
              <button className="sp-btn sp-btn-primary" onClick={() => setTimerRunning(true)}>▶ Start Session</button>
            ) : (
              <button className="sp-btn sp-btn-warning" onClick={() => setTimerRunning(false)}>⏸ Pause</button>
            )}
            <button className="sp-btn sp-btn-secondary" onClick={() => setTimerPreset(parseInt(timerMode) || 25)}>🔄 Reset</button>
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">🔥</span> Study Streak & Analytics</div>
          <div className="sp-streak-grid mb-6">
            <div className="sp-streak-item">
              <div className="sp-streak-value text-amber-400">🔥 7 Days</div>
              <div className="sp-streak-label">Current Streak</div>
            </div>
            <div className="sp-streak-item">
              <div className="sp-streak-value text-indigo-400">🏆 21 Days</div>
              <div className="sp-streak-label">Longest Streak</div>
            </div>
            <div className="sp-streak-item">
              <div className="sp-streak-value text-green-400">🎯 5 / 7 Days</div>
              <div className="sp-streak-label">Weekly Goal</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 mb-2 font-semibold">Weekly Study Time</div>
          <div className="sp-chart-bar-container">
            {[
              { day: 'Mon', hours: 2.5 },
              { day: 'Tue', hours: 3.0 },
              { day: 'Wed', hours: 1.5 },
              { day: 'Thu', hours: 4.0 },
              { day: 'Fri', hours: 2.0 },
              { day: 'Sat', hours: 3.0 },
              { day: 'Sun', hours: 1.0 }
            ].map(d => (
              <div key={d.day} className="sp-chart-bar-wrapper">
                <span className="sp-chart-value">{d.hours}h</span>
                <div className="sp-chart-bar" style={{ height: `${(d.hours / 4) * 100}%` }}></div>
                <span className="sp-chart-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 14. EXAM PREPARATION & COUNTDOWN ───────────────────── */}
      <div className="sp-two-col mb-7">
        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">🎓</span> Exam Preparation</div>
          <div className="sp-exam-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="sp-exam-title">Machine Learning</div>
                <div className="sp-exam-sub">Semester Examination</div>
              </div>
              <div className="text-right">
                <div className="sp-exam-days">12 Days</div>
                <div className="sp-exam-days-label">Remaining</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Preparation Progress</span>
                <span className="text-blue-400 font-semibold">68%</span>
              </div>
              <div className="sp-progress-bar">
                <div className="sp-progress-bar-fill blue" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div className="sp-exam-topics">
              <div className="sp-exam-topic completed">✓ Linear Regression</div>
              <div className="sp-exam-topic completed">✓ Logistic Regression</div>
              <div className="sp-exam-topic in-progress">● Decision Trees & Random Forests</div>
              <div className="sp-exam-topic not-started">○ Neural Networks</div>
            </div>
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">🎯</span> Study Goals & Today's Checklist</div>
          <div className="sp-goal-list mb-4">
            {(goals.length > 0 ? goals : [
              { _id: 'g1', title: 'Weekly Study Goal', currentValue: 14, targetValue: 20, unit: 'Hours', progress: 70 },
              { _id: 'g2', title: 'DSA Practice', currentValue: 4, targetValue: 5, unit: 'Days', progress: 80 }
            ]).map(g => (
              <div key={g._id} className="sp-goal-item">
                <div className="sp-goal-header">
                  <span className="sp-goal-title">{g.title}</span>
                  <span className="sp-goal-values">{g.currentValue} / {g.targetValue} {g.unit}</span>
                </div>
                <div className="sp-progress-bar">
                  <div className="sp-progress-bar-fill green" style={{ width: `${g.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-semibold mb-2">Today's Goals</div>
          <div className="sp-today-goals">
            {todayGoalsList.map(item => (
              <div key={item.id} className="sp-today-goal" onClick={() => setTodayGoalsList(prev => prev.map(i => i.id === item.id ? { ...i, done: !i.done } : i))}>
                <div className={`sp-today-goal-check ${item.done ? 'done' : ''}`}>{item.done ? '✓' : ''}</div>
                <div className={`sp-today-goal-text ${item.done ? 'done' : ''}`}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 20. SMART DAILY PLAN & COACH ───────────────────────── */}
      <div className="sp-two-col mb-7">
        <div className="sp-card">
          <div className="sp-card-title justify-between">
            <span><span className="icon">🤖</span> Smart Daily Plan</span>
            <button className="sp-btn sp-btn-xs sp-btn-gradient" onClick={handleGenerateSmartPlan}>Refresh Plan</button>
          </div>
          <div className="space-y-2">
            {(smartPlan.length > 0 ? smartPlan : [
              { time: '06:00 PM - 07:30 PM', title: 'DBMS Assignment', reason: 'Due tomorrow (High Priority)', isBreak: false },
              { time: '07:30 PM - 07:45 PM', title: 'Short Rest & Hydration', reason: 'Break', isBreak: true },
              { time: '07:45 PM - 08:45 PM', title: 'DSA Revision', reason: 'Weekly Goal Target', isBreak: false },
              { time: '09:00 PM - 09:45 PM', title: 'Machine Learning Practice', reason: 'Exam approaching in 12 days', isBreak: false }
            ]).map((s, idx) => (
              <div key={idx} className={`sp-plan-slot ${s.isBreak ? 'break' : ''}`}>
                <div className="sp-plan-time">{s.startTime || s.time}</div>
                <div>
                  <div className="sp-plan-title">{s.title}</div>
                  <div className="sp-plan-reason">{s.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-card">
          <div className="sp-card-title"><span className="icon">💡</span> AURA Study Coach & Insights</div>
          <div className="sp-coach-list">
            <div className="sp-coach-item">
              <div className="sp-coach-icon">🧠</div>
              <div className="sp-coach-msg">DBMS assignment is due tomorrow. Complete it before starting lower-priority tasks.</div>
            </div>
            <div className="sp-coach-item">
              <div className="sp-coach-icon">📚</div>
              <div className="sp-coach-msg">Your Machine Learning exam is approaching in 12 days. Schedule another revision session.</div>
            </div>
            <div className="sp-coach-item">
              <div className="sp-coach-icon">🔥</div>
              <div className="sp-coach-msg">Great consistency! You've maintained a 7-day study streak. Keep up the momentum!</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL: ADD TASK ────────────────────────────────────── */}
      {showTaskModal && (
        <div className="sp-modal-overlay">
          <div className="sp-modal">
            <h3 className="sp-modal-title">Create Study Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="sp-form-group">
                <label className="sp-form-label">Task Title <span className="required">*</span></label>
                <input type="text" className="sp-input" required value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="e.g. Complete DBMS Assignment" />
              </div>
              <div className="sp-form-row">
                <div className="sp-form-group">
                  <label className="sp-form-label">Subject <span className="required">*</span></label>
                  <input type="text" className="sp-input" required value={taskForm.subject} onChange={e => setTaskForm({ ...taskForm, subject: e.target.value })} />
                </div>
                <div className="sp-form-group">
                  <label className="sp-form-label">Task Type <span className="required">*</span></label>
                  <select className="sp-input" value={taskForm.type} onChange={e => setTaskForm({ ...taskForm, type: e.target.value })}>
                    {['Study', 'Revision', 'Assignment', 'Exam Preparation', 'Project Work', 'Practice', 'Reading', 'Research', 'Lab Work', 'Personal'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sp-form-row">
                <div className="sp-form-group">
                  <label className="sp-form-label">Due Date <span className="required">*</span></label>
                  <input type="date" className="sp-input" required value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                </div>
                <div className="sp-form-group">
                  <label className="sp-form-label">Priority <span className="required">*</span></label>
                  <select className="sp-input" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="sp-modal-actions">
                <button type="button" className="sp-btn sp-btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="sp-btn sp-btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: SCHEDULE SESSION ────────────────────────────── */}
      {showSessionModal && (
        <div className="sp-modal-overlay">
          <div className="sp-modal">
            <h3 className="sp-modal-title">Schedule Study Session</h3>
            <form onSubmit={handleCreateSession}>
              <div className="sp-form-group">
                <label className="sp-form-label">Subject <span className="required">*</span></label>
                <input type="text" className="sp-input" required value={sessionForm.subject} onChange={e => setSessionForm({ ...sessionForm, subject: e.target.value })} />
              </div>
              <div className="sp-form-group">
                <label className="sp-form-label">Topic</label>
                <input type="text" className="sp-input" value={sessionForm.topic} onChange={e => setSessionForm({ ...sessionForm, topic: e.target.value })} placeholder="e.g. Trees & Binary Search" />
              </div>
              <div className="sp-form-row">
                <div className="sp-form-group">
                  <label className="sp-form-label">Start Time</label>
                  <input type="time" className="sp-input" value={sessionForm.startTime} onChange={e => setSessionForm({ ...sessionForm, startTime: e.target.value })} />
                </div>
                <div className="sp-form-group">
                  <label className="sp-form-label">End Time</label>
                  <input type="time" className="sp-input" value={sessionForm.endTime} onChange={e => setSessionForm({ ...sessionForm, endTime: e.target.value })} />
                </div>
              </div>
              <div className="sp-modal-actions">
                <button type="button" className="sp-btn sp-btn-secondary" onClick={() => setShowSessionModal(false)}>Cancel</button>
                <button type="submit" className="sp-btn sp-btn-primary">Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD GOAL ────────────────────────────────────── */}
      {showGoalModal && (
        <div className="sp-modal-overlay">
          <div className="sp-modal">
            <h3 className="sp-modal-title">Add Study Goal</h3>
            <form onSubmit={handleCreateGoal}>
              <div className="sp-form-group">
                <label className="sp-form-label">Goal Name <span className="required">*</span></label>
                <input type="text" className="sp-input" required value={goalForm.title} onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} placeholder="e.g. Complete 20 Hours of Study" />
              </div>
              <div className="sp-form-row">
                <div className="sp-form-group">
                  <label className="sp-form-label">Target Value</label>
                  <input type="number" className="sp-input" value={goalForm.targetValue} onChange={e => setGoalForm({ ...goalForm, targetValue: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="sp-form-group">
                  <label className="sp-form-label">Unit</label>
                  <input type="text" className="sp-input" value={goalForm.unit} onChange={e => setGoalForm({ ...goalForm, unit: e.target.value })} />
                </div>
              </div>
              <div className="sp-modal-actions">
                <button type="button" className="sp-btn sp-btn-secondary" onClick={() => setShowGoalModal(false)}>Cancel</button>
                <button type="submit" className="sp-btn sp-btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
