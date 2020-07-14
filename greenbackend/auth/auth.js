const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            console.log("DECODE " + decoded.toString());
            req.userData = decoded;
            next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Auth failed due to token missing"
        });
    }
};