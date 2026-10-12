const {uploadFileByteacher}=require("../services/image.upload")
const  assignmentModel=require("../models/assignment.model")
 const submissionModel = require("../models/submission.model");
async function uploadAss(req,res){
 
const {title,description,courseId,subjectId,teacherId,dueDate}=req.body
const file=req.file
const tId=req.user._id
const result= await uploadFileByteacher(file.buffer.toString("base64"))
console.log(result.url)
 const assignment=await assignmentModel.create({
    title,description,courseId,subjectId
    ,teacherId:tId,dueDate,fileUrl:result.url
 })


 return res.status(200).json({
    msg:"assignment created sucesfulyy",
   assignment
 })

}
async function delAss(req, res) {
    try {
        const { id } = req.params;

        const assignment = await assignmentModel.findByIdAndDelete(id);

        if (!assignment) {
            return res.status(404).json({
                msg: "Assignment not found"
            });
        }

        res.status(200).json({
            msg: "Assignment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error deleting assignment",
            error: error.message
        });
    }
}
async function updAss(req, res) {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            courseId,
            subjectId,
            dueDate
        } = req.body;

        const assignment = await assignmentModel.findOne({
            _id: id,
            teacherId: req.user._id
        });

        if (!assignment) {
            return res.status(404).json({
                msg: "Assignment not found"
            });
        }

        assignment.title = title;
        assignment.description = description;
        assignment.courseId = courseId;
        assignment.subjectId = subjectId;
        assignment.dueDate = dueDate;

        // Agar new file bheji gayi hai
        if (req.file) {
            const result = await uploadFileByteacher(
                req.file.buffer.toString("base64")
            );

            assignment.fileUrl = result.url;
        }

        await assignment.save();

        res.status(200).json({
            msg: "Assignment updated successfully",
            assignment
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error updating assignment",
            error: error.message
        });
    }
}


async function getAss(req, res) {
    try {
        const assignments = await assignmentModel.find()
            .populate("courseId")
            .populate("subjectId")
            .populate("teacherId", "-password");

        res.status(200).json({
            msg: "Assignments fetched successfully",
            assignments
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error fetching assignments",
            error: error.message
        });
    }
}
async function getMyAssignments(req, res) {

    try {

        const assignments = await assignmentModel.find({
            teacherId: req.user._id
        })
        // .populate("courseId")
        // .populate("subjectId")
        // .populate("teacherId");

        res.status(200).json({
            msg: "My assignments fetched successfully",
            assignments
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}
async function getSubmission(req, res) {
    try {

        const { courseId, subjectId } = req.query;

        if (!courseId || !subjectId) {
            return res.status(400).json({
                msg: "courseId and subjectId are required"
            });
        }

        const assignments = await assignmentModel.find({
            teacherId: req.user._id,
            courseId: courseId,
            subjectId: subjectId
        });

        const assignmentIds = assignments.map(
            assignment => assignment._id
        );

        const submissions = await submissionModel.find({
            assignmentId: { $in: assignmentIds }
        })
        .populate("studentId", "-password")
        .populate("assignmentId");

        res.status(200).json({
            msg: "Submissions fetched successfully",
            submissions
        });

    } catch (error) {

        res.status(500).json({
            msg: "Error fetching submissions",
            error: error.message
        });

    }
}
async function gradeSubmission(req, res) {

    try {

        const { id } = req.params;
        const { marks, feedback } = req.body;

        // Teacher ki assignments
        const assignments = await assignmentModel.find({
            teacherId: req.user._id
        });

        const assignmentIds = assignments.map(
            assignment => assignment._id
        );

        // Specific submission update
        const submission = await submissionModel.findOneAndUpdate(
            {
                _id: id,
                assignmentId: { $in: assignmentIds }
            },
            {
                marks,
                feedback,
                status: "Graded"
            },
            {
                new: true
            }
        );

        if (!submission) {
            return res.status(404).json({
                msg: "Submission not found"
            });
        }

        res.status(200).json({
            msg: "Submission graded successfully",
            submission
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}

module.exports={uploadAss,delAss,updAss,getAss,getSubmission,getMyAssignments,gradeSubmission}