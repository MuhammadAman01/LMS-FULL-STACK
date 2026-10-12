const express = require("express")
const router = express.Router()
const multer = require("multer")
const teacherAuth=require("../middlewares/teacher.auth")
const upload = multer({
    storage: multer.memoryStorage()
})
const authTeacher = require("../middlewares/teacher.auth")
const assController = require("../controllers/ass.controller")
router.post("/assignment", authTeacher, upload.single("file"), assController.uploadAss)
router.delete("/assignment/:id", authTeacher, assController.delAss)
router.patch( "/assignment/:id", authTeacher,upload.single("file"),assController.updAss);
router.get("/assignments", authTeacher, assController.getAss)
router.get("/Myassignments", authTeacher, assController.getMyAssignments)
router.get("/submission", authTeacher, assController.getSubmission)
router.post("/submission/:id", authTeacher, assController.gradeSubmission)
module.exports = router