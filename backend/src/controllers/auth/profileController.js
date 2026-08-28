const User = require("../../models/User");

const profile = async (req, res) => {

    const user = await User.findById(req.user.id)
        .select("-password -refreshToken");

    res.json({
        success: true,
        user
    });

};

module.exports = profile;