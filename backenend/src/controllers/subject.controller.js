const subjectModel = require("../models/subject.model");



async function createSubject(req, res) {
    try {
        const { subjectName, subjectCode, creditHours, courseId } = req.body;

        const existingSubject = await subjectModel.findOne({
            subjectCode
        });

        if (existingSubject) {
            return res.status(400).json({
                msg: "Subject already exists"
            });
        }

        const subject = await subjectModel.create({
            subjectName,
            subjectCode,
            creditHours,
            courseId
        });

        res.status(201).json({
            msg: "Subject created successfully",
            subject
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error creating subject",
            error: error.message
        });
    }
}


async function getAllSubjects(req, res) {
    try {
        const subjects = await subjectModel.find()
            .populate("courseId").sort({_id:-1});

        res.status(200).json({
            msg: "Subjects fetched successfully",
            subjects
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error fetching subjects",
            error: error.message
        });
    }
}


async function updateSubject(req, res) {
    try {
        const { id } = req.params;
        const { subjectName, subjectCode, creditHours, courseId } = req.body;

        const subject = await subjectModel.findByIdAndUpdate(
            id,
            {
                subjectName,
                subjectCode,
                creditHours,
                courseId
            },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({
                msg: "Subject not found"
            });
        }

        res.status(200).json({
            msg: "Subject updated successfully",
            subject
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error updating subject",
            error: error.message
        });
    }
}


async function deleteSubject(req, res) {
    try {
        const { id } = req.params;

        const subject = await subjectModel.findByIdAndDelete(id);

        if (!subject) {
            return res.status(404).json({
                msg: "Subject not found"
            });
        }

        res.status(200).json({
            msg: "Subject deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error deleting subject",
            error: error.message
        });
    }
}


module.exports = {
    createSubject,
    getAllSubjects,
  
    updateSubject,
    deleteSubject
};