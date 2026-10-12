const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    subjectName: {
        type: String,
        required: true
    },

    subjectCode: {
        type: String,
        required: true,
        unique: true
    },

    creditHours: {
        type: Number,
        required: true
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }

}, { timestamps: true });

const subjectModel = mongoose.model("Subject", subjectSchema);

module.exports = subjectModel;