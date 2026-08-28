const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { generateAccessToken } = require("../../utils/jwt");

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.id).select("-password -refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const token = generateAccessToken({
            id: user._id,
            role: user.role,
        });

        return res.json({
            success: true,
            message: "Token refreshed successfully",
            token,
            user,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token",
        });
    }
};

module.exports = refresh;
