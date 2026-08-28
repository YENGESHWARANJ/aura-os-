const logoutService = require("../../services/auth/logoutService");

const logout = async (req, res) => {
    try {
        const result = await logoutService(req.user.id);

        res.json(result);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = logout;