import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
    attendance: [],
    academics: [],
    assignments: [],
    projects: [],
    skills: [],
    loading: false,
    error: null,
};

const studentSlice = createSlice({
    name: "student",

    initialState,

    reducers: {
        setStudentProfile: (state, action) => {
            state.profile = action.payload;
        },

        setAttendance: (state, action) => {
            state.attendance = action.payload;
        },

        setAcademics: (state, action) => {
            state.academics = action.payload;
        },

        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },

        setProjects: (state, action) => {
            state.projects = action.payload;
        },

        setSkills: (state, action) => {
            state.skills = action.payload;
        },

        setStudentLoading: (state, action) => {
            state.loading = action.payload;
        },

        setStudentError: (state, action) => {
            state.error = action.payload;
        },

        clearStudentData: (state) => {
            state.profile = null;
            state.attendance = [];
            state.academics = [];
            state.assignments = [];
            state.projects = [];
            state.skills = [];
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setStudentProfile,
    setAttendance,
    setAcademics,
    setAssignments,
    setProjects,
    setSkills,
    setStudentLoading,
    setStudentError,
    clearStudentData,
} = studentSlice.actions;

export default studentSlice.reducer;