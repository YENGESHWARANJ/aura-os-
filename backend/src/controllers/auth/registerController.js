const registerService = require("../../services/auth/registerService");

const register = async (req, res) => {
    try {

        const user = await registerService(req.body);

        const userData = user.toObject();

        delete userData.password;
        delete userData.refreshToken;

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: userData
        });

    } catch (error) {

    console.log(error);

    res.status(400).json({
        success: false,
        message: error.message,
        stack: error.stack
    });

}
};

module.exports = register;