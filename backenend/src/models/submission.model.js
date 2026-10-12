const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    comment: {
        type: String
    },

    submittedAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Submitted", "Late", "Graded"],
        default: "Submitted"
    },

    marks: {
        type: Number,
        default: null
    },

    feedback: {
        type: String,
        default: null
    }

}, { timestamps: true });

const submissionModel = mongoose.model("Submission", submissionSchema);

module.exports = submissionModel;