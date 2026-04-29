const express = require("express");
const router = express.Router();
const {
  getAllCandidates,
  getCandidateById,
} = require("../controllers/candidateController");

router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);

module.exports = router;