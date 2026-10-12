const express = require("express");
const router = express.Router();

const {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject
} = require("../../controllers/subject.controller");

const adminAuth = require("../../middlewares/auth.admin");


router.post("/subject", adminAuth, createSubject);

router.get("/subjects", adminAuth, getAllSubjects);

// router.get("/:id", adminAuth, getSubject);

router.patch("/subject/:id", adminAuth, updateSubject);

router.delete("/subject/:id", adminAuth, deleteSubject);


module.exports = router;