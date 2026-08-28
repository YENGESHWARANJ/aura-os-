const User = require("../../models/User");
const { comparePassword } = require("../../utils/password");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/jwt");

const loginService = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = generateAccessToken({
        id: user._id,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        id: user._id,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
        token,
        refreshToken,
        user,
    };
};

module.exports = loginService;
