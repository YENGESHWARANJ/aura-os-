import api from "./api";

const BASE = "/study-planner";

// ─── Overview ────────────────────────────────────────────
export const getOverview = async () => {
  const res = await api.get(`${BASE}/overview`);
  return res.data;
};

// ─── Tasks ───────────────────────────────────────────────
export const getTasks = async (params = {}) => {
  const res = await api.get(`${BASE}/tasks`, { params });
  return res.data;
};

export const createTask = async (data) => {
  const res = await api.post(`${BASE}/tasks`, data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await api.put(`${BASE}/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`${BASE}/tasks/${id}`);
  return res.data;
};

// ─── Sessions ────────────────────────────────────────────
export const getTodayPlan = async () => {
  const res = await api.get(`${BASE}/today`);
  return res.data;
};

export const getSchedule = async (params = {}) => {
  const res = await api.get(`${BASE}/schedule`, { params });
  return res.data;
};

export const createSession = async (data) => {
  const res = await api.post(`${BASE}/sessions`, data);
  return res.data;
};

export const updateSession = async (id, data) => {
  const res = await api.put(`${BASE}/sessions/${id}`, data);
  return res.data;
};

export const startSession = async (id) => {
  const res = await api.post(`${BASE}/sessions/${id}/start`);
  return res.data;
};

export const completeSession = async (id, data = {}) => {
  const res = await api.post(`${BASE}/sessions/${id}/complete`, data);
  return res.data;
};

// ─── Deadlines ───────────────────────────────────────────
export const getDeadlines = async () => {
  const res = await api.get(`${BASE}/deadlines`);
  return res.data;
};

// ─── Analytics ───────────────────────────────────────────
export const getAnalytics = async (params = {}) => {
  const res = await api.get(`${BASE}/analytics`, { params });
  return res.data;
};

// ─── Goals ───────────────────────────────────────────────
export const getGoals = async () => {
  const res = await api.get(`${BASE}/goals`);
  return res.data;
};

export const createGoal = async (data) => {
  const res = await api.post(`${BASE}/goals`, data);
  return res.data;
};

export const updateGoal = async (id, data) => {
  const res = await api.put(`${BASE}/goals/${id}`, data);
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await api.delete(`${BASE}/goals/${id}`);
  return res.data;
};

// ─── Smart Plan ──────────────────────────────────────────
export const generatePlan = async () => {
  const res = await api.post(`${BASE}/generate-plan`);
  return res.data;
};

// ─── Needs Attention ─────────────────────────────────────
export const getNeedsAttention = async () => {
  const res = await api.get(`${BASE}/needs-attention`);
  return res.data;
};

// ─── Insights ────────────────────────────────────────────
export const getInsights = async () => {
  const res = await api.get(`${BASE}/insights`);
  return res.data;
};
