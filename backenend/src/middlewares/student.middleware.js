const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");

async function studentAuth(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            msg: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRECT
        );

        const student = await User.findById(decoded.id)
            .populate("courseIds subjectIds");

        if (!student || student.role !== "student") {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        req.user = student;

        next();

    } catch (error) {

        return res.status(401).json({
            msg: "Invalid or expired token"
        });
    }
}

module.exports = studentAuth;