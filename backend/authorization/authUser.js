const jwt = require('jsonwebtoken');
const User = require("../models/User");

const author = async (req, res, next) => {
    let token;
    console.log(req.headers)

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decodedToken.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized");
        }

        if (!token) {
            res.status(401);
            throw new Error("Not authorized");
        }
    }
}

module.exports = { author };

