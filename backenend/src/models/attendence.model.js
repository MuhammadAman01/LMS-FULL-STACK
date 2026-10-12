const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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

    date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }

}, { timestamps: true });

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;