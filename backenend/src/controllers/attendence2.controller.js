const User = require("../models/admin.model");

async function getStudentsForAttendance(req, res) {

    try {

        const { courseId, subjectId } = req.body;

        // Check teacher has this course
        const hasCourse = req.user.courseIds.some(
            course => course._id.toString() === courseId
        );

        // Check teacher has this subject
        const hasSubject = req.user.subjectIds.some(
            subject => subject._id.toString() === subjectId
        );

        if (!hasCourse || !hasSubject) {
            return res.status(403).json({
                msg: "You are not assigned to this course or subject"
            });
        }

        // Get students
        const students = await User.find({
            role: "student",
            courseIds: courseId,
            subjectIds: subjectId
        }).select("-password");

        res.status(200).json({
            msg: "Students fetched successfully",
            students
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}

module.exports = {
    getStudentsForAttendance
};