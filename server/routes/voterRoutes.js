const express = require("express");
const router = express.Router();
const {
  getVoterStatus,
} = require("../controllers/voterController");

router.get("/status/:address", getVoterStatus);

module.exports = router;