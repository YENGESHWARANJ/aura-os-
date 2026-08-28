import api from "../client";

export const profileApi = {
  getProfile: async () => {
    const res = await api.get("/profile");
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put("/profile", data);
    return res.data;
  },
  uploadAvatar: async (formData) => {
    const res = await api.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default profileApi;
