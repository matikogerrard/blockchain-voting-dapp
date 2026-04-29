const express = require("express");
const router = express.Router();
const {
  getElectionDetails,
  getElectionStatus,
  getWinner,
} = require("../controllers/electionController");

router.get("/details", getElectionDetails);
router.get("/status", getElectionStatus);
router.get("/winner", getWinner);

module.exports = router;