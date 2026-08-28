import api from "../client";

export const aiApi = {
  chat: async (message, conversationId, context) => {
    const response = await api.post("/ai/chat", {
      message,
      conversationId,
      context,
    });
    return response.data;
  },

  getContext: async () => {
    const response = await api.get("/ai/context");
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get("/ai/conversations");
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/ai/conversations/${conversationId}`);
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/ai/conversations/${conversationId}`);
    return response.data;
  },
};

export default aiApi;
