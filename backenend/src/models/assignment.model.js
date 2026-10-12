const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    fileUrl: {
        type: String
    }

}, { timestamps: true });

const assignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = assignmentModel;