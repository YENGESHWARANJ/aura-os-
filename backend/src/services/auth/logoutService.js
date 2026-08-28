const User = require("../../models/User");

const logoutService = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        refreshToken: null,
        lastLogout: new Date()
    });

    return {
        success: true,
        message: "Logout Successful"
    };
};

module.exports = logoutService;