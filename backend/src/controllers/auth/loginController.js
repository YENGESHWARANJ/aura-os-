const loginService = require("../../services/auth/loginService");

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await loginService(email, password);

        const user = result.user.toObject();

        delete user.password;
        delete user.refreshToken;

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token: result.token,
            user
        });

    }

    catch (error) {

        res.status(401).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = login;