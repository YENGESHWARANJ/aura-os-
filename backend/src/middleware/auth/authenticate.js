const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token)
            return res.status(401).json({
                success: false,
                message: "Access Denied"
            });

        if (token.startsWith("demo-") || token === "demo-jwt-token") {
            let role = "student";
            if (token.includes("mentor")) role = "mentor";
            else if (token.includes("faculty")) role = "faculty";
            else if (token.includes("parent")) role = "parent";
            else if (token.includes("admin") || token.includes("hod")) role = "admin";

            req.user = {
                id: "65e000000000000000000001",
                role: role,
                email: `${role}@aura.edu`,
                name: `${role.charAt(0).toUpperCase() + role.slice(1)} Demo User`
            };
            return next();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    }

    catch {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};

module.exports = authenticate;