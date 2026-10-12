const express = require("express")
const router = express.Router()
const stController=require("../controllers/st.controller")
const studentMiddleware=require("../middlewares/student.middleware")
const subController=require("../controllers/submission.controller")
const multer=require("multer")

router.post("/login", stController.studentLogin);

router.get("/profile", studentMiddleware, stController.getProfile);

router.get("/dashboard", studentMiddleware, stController.dashboard);

router.get("/Assignments", studentMiddleware, stController.getAllAssignment);

router.get("/my-attendance", studentMiddleware, stController.getMyAttendance);

router.get("/my-course", studentMiddleware, stController.getMyCourses);
router.post("/logout", studentMiddleware, stController.logout);

module.exports=router