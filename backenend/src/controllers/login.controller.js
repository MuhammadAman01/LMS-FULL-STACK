const adminModel=require("../models/admin.model")
const assignmentModel=require("../models/assignment.model")
const submissionModel=require("../models/submission.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
async function loginTeacher(req,res) {
const {email,password}=req.body

const isTeacherExist = await adminModel.findOne({
    email,
    role: "teacher"
});
if(isTeacherExist==null){
    return res.send({
        msg:"teacher doest not exist"
    })
}

const valid=await bcrypt.compare(password,isTeacherExist.password)
if(!valid){
    return  res.status(401).json({
            message: "invalid credientials",
        });
}
const token= await jwt.sign({
    id:isTeacherExist._id
},process.env.JWT_SECRECT)
// console.log(token)
res.cookie("token",token)

    res.status(200).send({
        msg:"login sucessfuly",
        teacher:isTeacherExist
    })
}

async function dashboard(req, res) {
    try {
        const teacherId = req.user._id;

        // Total Courses
        const totalCourses = req.user.courseIds.length;

        // Total Subjects
        const totalSubjects = req.user.subjectIds.length;

        // Total Students
        const students = await adminModel.find({
            role: "student",
            courseIds: {
                $in: req.user.courseIds.map(course => course._id)
            },
            subjectIds: {
                $in: req.user.subjectIds.map(subject => subject._id)
            }
        });

        const totalStudents = students.length;

        // Total Assignments
        const assignments = await assignmentModel.find({
            teacherId: teacherId
        });

        const totalAssignments = assignments.length;

        // Assignment IDs
        const assignmentIds = assignments.map(
            assignment => assignment._id
        );

        // Total Submissions
        const submissions = await submissionModel.find({
            assignmentId: { $in: assignmentIds }
        });

        const totalSubmissions = submissions.length;

        // Pending Submissions
        const pendingSubmissions = submissions.filter(
            submission => submission.status !== "Graded"
        ).length;

        res.status(200).json({
            msg: "Teacher dashboard data fetched successfully",

            dashboard: {
                totalCourses,
                totalSubjects,
                totalStudents,
                totalAssignments,
                totalSubmissions,
                pendingSubmissions
            }
        });

    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}
async function getProfile(req,res) {
console.log(req.user)
const teacher=req.user
    res.status(200).json({
        msg:"profile get sucesfully",
        teacher
    })
}

async function myCourses(req, res) {

    const courses = req.user.courseIds;

    res.status(200).json({
        msg: "my courses",
        courses
    });
}


async function myStudents(req, res) {
    try {
        const { courseId, subjectId } = req.query;

        if (!courseId || !subjectId) {
            return res.status(400).json({
                msg: "courseId and subjectId are required"
            });
        }

        const hasCourse = req.user.courseIds.some(
            course => course._id.toString() === courseId
        );

        if (!hasCourse) {
            return res.status(403).json({
                msg: "You are not assigned to this course"
            });
        }

        const hasSubject = req.user.subjectIds.some(
            subject => subject._id.toString() === subjectId
        );

        if (!hasSubject) {
            return res.status(403).json({
                msg: "You are not assigned to this subject"
            });
        }

        const students = await adminModel.find({
            role: "student",
            courseIds: courseId,
            subjectIds: subjectId
        })
        .select("-password")
        .populate("courseIds")
        .populate("subjectIds");

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
async function logout(req, res) {
    try {
        res.clearCookie("token");

        res.status(200).json({
            msg: "Teacher logout successfully"
        });

    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}
module.exports={loginTeacher,getProfile,myCourses,myStudents,dashboard,logout}