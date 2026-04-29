const { getContract } = require("../config/contract");

const getVoterStatus = async (req, res) => {
  try {
    const contract = getContract();
    const voter = await contract.getVoterStatus(req.params.address);
    res.json({
      isRegistered: voter.isRegistered,
      hasVoted: voter.hasVoted,
      votedCandidateId: voter.votedCandidateId.toString(),
      name: voter.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getVoterStatus };