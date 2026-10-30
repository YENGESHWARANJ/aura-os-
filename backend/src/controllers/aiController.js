const aiService = require("../services/aiService");

exports.chat = async (req, res) => {
  try {
    const { conversationId, message, mode, language } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const data = await aiService.processChat(req.user.id, conversationId, message, mode, language);
    res.json({ success: true, data });
  } catch (err) {
    console.error("AI Chat Controller error:", err);
    res.status(500).json({ success: false, message: "AI Assistant failed to process request" });
  }
};

exports.translate = async (req, res) => {
  try {
    const { text, sourceLang = "en", targetLang = "ta" } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Text to translate is required" });
    }

    const data = await aiService.translateText(text, sourceLang, targetLang);
    res.json({ success: true, data });
  } catch (err) {
    console.error("AI Translate Controller error:", err);
    res.status(500).json({ success: false, message: "Academic Translation failed" });
  }
};

exports.getContext = async (req, res) => {
  try {
    const context = await aiService.getStudentContext(req.user.id);
    res.json({ success: true, data: context });
  } catch (err) {
    console.error("AI Context error:", err);
    res.status(500).json({ success: false, message: "Failed to load context" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await aiService.getConversations(req.user.id);
    res.json({ success: true, data: conversations });
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ success: false, message: "Failed to load conversations" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await aiService.getMessages(req.user.id, req.params.id);
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Failed to load messages" });
  }
};

exports.updateConversation = async (req, res) => {
  try {
    const conversation = await aiService.updateConversation(req.user.id, req.params.id, req.body);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    res.json({ success: true, data: conversation });
  } catch (err) {
    console.error("Update conversation error:", err);
    res.status(500).json({ success: false, message: "Failed to update conversation" });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await aiService.deleteConversation(req.user.id, req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    res.json({ success: true, message: "Conversation deleted" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    res.status(500).json({ success: false, message: "Failed to delete conversation" });
  }
};

exports.setFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const message = await aiService.setFeedback(req.user.id, req.params.id, feedback);
    res.json({ success: true, data: message });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ success: false, message: "Failed to set feedback" });
  }
};
