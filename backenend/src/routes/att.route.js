const express = require("express")
const router = express.Router()
const attController=require("../controllers/attendence.controller")
const teacherAuth=require("../middlewares/teacher.auth")

router.post("/attendence",teacherAuth,attController.createAtt)
router.patch("/attendence/:id",teacherAuth,attController.updAtt)
router.delete("/attendence/:id",teacherAuth,attController.deleteAtt)
router.get("/attendences",teacherAuth,attController.getAllAtt)
module.exports = router