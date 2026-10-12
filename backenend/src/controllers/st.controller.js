const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");
const  assignmentModel=require("../models/assignment.model")
const  attendenceModel=require("../models/attendence.model")

const submissionModel = require("../models/submission.model");
async function studentLogin(req, res) {

    const { email, password } = req.body;

    try {

                const student = await User.findOne({
            email,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                msg: "Student not found"
            });
        }


        const isMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!isMatch) {
            return res.status(401).json({
                msg: "Invalid password"
            });
        }

       
        const token = jwt.sign({
                id: student._id },process.env.JWT_SECRECT );

      
        res.cookie("token", token);

        res.status(200).json({
            msg: "Student login successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role
            }
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function getProfile(req, res) {

    const student = req.user;

    res.status(200).json({
        msg: "Student profile fetched successfully",
        student
    });
}
async function getMyCourses(req, res) {
    try {
        const courses = req.user.courseIds;

        res.status(200).json({
            msg: "My courses fetched successfully",
            courses
        });

    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function getAllAssignment(req,res) {
    const user=req.user.courseIds
  const assignment= await  assignmentModel.find({
        courseId: { $in: user }
    })  .populate("courseId")
    .populate("subjectId")
    .populate("teacherId", "-password");
    res.status(200).json({
        msg:"assignment fetched sucesfully",
        assignment
        
        

    })
    
}
async function getMyAttendance(req, res) {
    try {
        const attendance = await attendenceModel.find({
            studentId: req.user._id
        })
        .populate("courseId")
        .populate("subjectId")
        .populate("teacherId", "-password")
        .sort({ date: -1 });

        res.status(200).json({
            msg: "My attendance fetched successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}
async function dashboard(req, res) {
    try {
        const studentId = req.user._id;

        // Total courses
        const totalCourses = req.user.courseIds.length;

        // Total subjects
        const totalSubjects = req.user.subjectIds.length;

        // Student ke courses ki assignments
        const assignments = await assignmentModel.find({
            courseId: { $in: req.user.courseIds }
        });

        const totalAssignments = assignments.length;

        // Student ki submissions
        const submissions = await submissionModel.find({
            studentId: studentId
        });

        const totalSubmissions = submissions.length;

        // Pending assignments
        const submittedAssignmentIds = submissions.map(
            submission => submission.assignmentId.toString()
        );

        const pendingAssignments = assignments.filter(
            assignment =>
                !submittedAssignmentIds.includes(
                    assignment._id.toString()
                )
        ).length;

        res.status(200).json({
            msg: "Student dashboard fetched successfully",
            dashboard: {
                totalCourses,
                totalSubjects,
                totalAssignments,
                totalSubmissions,
                pendingAssignments
            }
        });

    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }


}
    async function logout(req, res) {
    try {
        res.clearCookie("token");

        res.status(200).json({
            msg: "Student logout successfully"
        });
    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

module.exports = { studentLogin,getProfile,getAllAssignment,getMyCourses,getMyAttendance,dashboard,logout};
