const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true
    },

    courseCode: {
        type: String,
        required: true,
        unique: true
    },

    department: {
        type: String,
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }

}, { timestamps: true });


const courseModel= mongoose.model("Course", courseSchema);
module.exports =courseModel
