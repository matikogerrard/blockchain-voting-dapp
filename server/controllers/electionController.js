const { getContract } = require("../config/contract");

const getElectionDetails = async (req, res) => {
  try {
    const contract = getContract();
    const details = await contract.getElectionDetails();
    res.json({
      name: details.name,
      organization: details.organization,
      startTime: details.startTime.toString(),
      endTime: details.endTime.toString(),
      isActive: details.isActive,
      isEnded: details.isEnded,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getElectionStatus = async (req, res) => {
  try {
    const contract = getContract();
    const details = await contract.getElectionDetails();
    res.json({
      isActive: details.isActive,
      isEnded: details.isEnded,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWinner = async (req, res) => {
  try {
    const contract = getContract();
    const winner = await contract.getWinner();
    res.json({
      id: winner.id.toString(),
      name: winner.name,
      party: winner.party,
      voteCount: winner.voteCount.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getElectionDetails, getElectionStatus, getWinner };