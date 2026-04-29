const { getContract } = require("../config/contract");

const getAllCandidates = async (req, res) => {
  try {
    const contract = getContract();
    const candidates = await contract.getAllCandidates();
    const formatted = candidates.map((c) => ({
      id: c.id.toString(),
      name: c.name,
      party: c.party,
      description: c.description,
      voteCount: c.voteCount.toString(),
      isActive: c.isActive,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const contract = getContract();
    const candidate = await contract.candidates(req.params.id);
    res.json({
      id: candidate.id.toString(),
      name: candidate.name,
      party: candidate.party,
      description: candidate.description,
      voteCount: candidate.voteCount.toString(),
      isActive: candidate.isActive,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCandidates, getCandidateById };