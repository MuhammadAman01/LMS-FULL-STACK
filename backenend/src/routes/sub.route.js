const express=require("express")
const  router=express.Router()
const subController=require("../controllers/submission.controller")
const studentMiddleware=require("../middlewares/student.middleware")
const multer=require("multer")
const upload = multer({
    storage: multer.memoryStorage()
})
router.post("/submit",studentMiddleware,upload.single("file"),subController.subAss)
router.patch("/submit/:id",studentMiddleware,upload.single("file"),subController.updAss)
router.delete("/submit/:id",studentMiddleware,subController.delAss)
router.get("/submits",studentMiddleware,subController.getAllAss)
module.exports=router
