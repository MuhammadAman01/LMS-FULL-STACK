const attendenceModel = require("../models/attendence.model");
const adminModel = require("../models/admin.model");

async function createAtt(req, res) {
    try {
        const {
            date,
            studentId,
            status,
            courseId,
            subjectId
        } = req.body;

        const user = req.user;

        // Check teacher assigned to this course
        const hasCourse = user.courseIds.some(
            course => course._id.toString() === courseId
        );

        if (!hasCourse) {
            return res.status(403).json({
                msg: "You are not assigned to this course"
            });
        }

        // Check teacher assigned to this subject
        const hasSubject = user.subjectIds.some(
            subject => subject._id.toString() === subjectId
        );

        if (!hasSubject) {
            return res.status(403).json({
                msg: "You are not assigned to this subject"
            });
        }

        // Check student belongs to this course and subject
        const student = await adminModel.findOne({
            _id: studentId,
            role: "student",
            courseIds: courseId,
            subjectIds: subjectId
        });

        if (!student) {
            return res.status(404).json({
                msg: "Student is not assigned to this course and subject"
            });
        }

        // Check duplicate attendance
        const existingAttendance = await attendenceModel.findOne({
            studentId: student._id,
            courseId: courseId,
            subjectId: subjectId,
            date: date
        });

        if (existingAttendance) {
            return res.status(400).json({
                msg: "Attendance already marked for this student on this date"
            });
        }

        // Create attendance
        const attendance = await attendenceModel.create({
            studentId: student._id,
            courseId: courseId,
            subjectId: subjectId,
            teacherId: user._id,
            date: date,
            status: status
        });

        res.status(201).json({
            msg: "Attendance marked successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}
async function updAtt(req, res) {

    const { id } = req.params;
    const { status, date } = req.body;

    const attendance = await attendenceModel.findOneAndUpdate(
        {
            _id: id,
            teacherId: req.user._id
        },
        {
            status,
            date
        },
        {
            new: true
        }
    );

    if (!attendance) {
        return res.status(404).json({
            msg: "Attendance not found"
        });
    }

    res.status(200).json({
        msg: "Attendance updated successfully",
        attendance
    });
}
async function deleteAtt(req, res) {

    const { id } = req.params;

    const attendance = await attendenceModel.findOneAndDelete({
        _id: id,
        teacherId: req.user._id
    });

    if (!attendance) {
        return res.status(404).json({
            msg: "Attendance not found"
        });
    }

    res.status(200).json({
        msg: "Attendance deleted successfully"
    });
}
async function getAllAtt(req, res) {
    try {

        const { courseId, subjectId, date } = req.query;

        if (!courseId || !subjectId || !date) {
            return res.status(400).json({
                msg: "courseId, subjectId and date are required"
            });
        }

        const teacherId = req.user._id;

        // Check teacher is assigned to this course
        const hasCourse = req.user.courseIds.some(
            course => course._id.toString() === courseId
        );

        if (!hasCourse) {
            return res.status(403).json({
                msg: "You are not assigned to this course"
            });
        }

        // Check teacher is assigned to this subject
        const hasSubject = req.user.subjectIds.some(
            subject => subject._id.toString() === subjectId
        );

        if (!hasSubject) {
            return res.status(403).json({
                msg: "You are not assigned to this subject"
            });
        }

        // Find attendance using all 4 conditions
        const attendance = await attendenceModel.find({
            teacherId: teacherId,
            courseId: courseId,
            subjectId: subjectId,
            date: date
        })
        .populate("studentId", "-password")
        .populate("courseId")
        .populate("subjectId");

        res.status(200).json({
            msg: "Attendance fetched successfully",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}



module.exports = { createAtt,updAtt,deleteAtt,getAllAtt };