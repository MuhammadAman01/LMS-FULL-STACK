const { uploadFile } = require("../services/image.upload");
const submissionModel = require("../models/submission.model");
const assignmentModel = require("../models/assignment.model");

async function subAss(req, res) {

    try {

        const { comment, assignmentId } = req.body;

        const studentId = req.user._id;
        const file = req.file;

        if (!assignmentId) {
            return res.status(400).json({
                msg: "Assignment ID is required"
            });
        }

     
        if (!file) {
            return res.status(400).json({
                msg: "Assignment file is required"
            });
        }

     
        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                msg: "Assignment not found"
            });
        }


        const isEnrolled = req.user.courseIds.some(
            course => course._id.toString() === assignment.courseId.toString()
        );

        if (!isEnrolled) {
            return res.status(403).json({
                msg: "You are not enrolled in this course"
            });
        }

        
        const alreadySubmitted = await submissionModel.findOne({
            studentId,
            assignmentId
        });

        if (alreadySubmitted) {
            return res.status(400).json({
                msg: "You have already submitted this assignment"
            });
        }

  
        const result = await uploadFile(
            file.buffer.toString("base64")
        );

        console.log(result.url);

    
        const submission = await submissionModel.create({

            studentId,
            assignmentId,
            comment,
            fileUrl: result.url

        });

        return res.status(201).json({

            msg: "Assignment submitted successfully",
            submission

        });

    } catch (error) {

        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}
async function updAss(req, res) {

    try {

        const { id } = req.params;
        const { comment } = req.body;
        const file = req.file;

        const submission = await submissionModel.findOne({
            _id: id,
            studentId: req.user._id
        });

        if (!submission) {
            return res.status(404).json({
                msg: "Submission not found"
            });
        }

        if (file) {

            const result = await uploadFile(
                file.buffer.toString("base64")
            );

            submission.fileUrl = result.url;
        }

        if (comment) {
            submission.comment = comment;
        }

        await submission.save();

        res.status(200).json({
            msg: "Submission updated successfully",
            submission
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}
async function delAss(req, res) {

    try {

        const { id } = req.params;

        const submission = await submissionModel.findOneAndDelete({
            _id: id,
            studentId: req.user._id
        });

        if (!submission) {
            return res.status(404).json({
                msg: "Submission not found"
            });
        }

        res.status(200).json({
            msg: "Submission deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            msg: "Server error",
            error: error.message
        });

    }
}
async function getAllAss(req, res) {

    try {

        const submissions = await submissionModel.find({
            studentId: req.user._id
        })
        .populate("assignmentId")
        .populate("studentId", "-password");

        res.status(200).json({
            msg: "Submissions fetched successfully",
            submissions
        });

    } catch (error) {

        res.status(500).json({       
            msg: "Server error",
            error: error.message
        });

    }
}
module.exports = {
    subAss,updAss,delAss,getAllAss
};