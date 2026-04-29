// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingSystem {
    // ─── STRUCTS ───────────────────────────────────────────
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string description;
        uint256 voteCount;
        bool isActive;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
        string name;
    }

    struct Election {
        string name;
        string organization;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isEnded;
        uint256 winnerCandidateId;
    }

    // ─── STATE VARIABLES ───────────────────────────────────
    address public admin;
    Election public election;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;

    uint256 public candidateCount;
    uint256 public totalVotes;

    // ─── EVENTS ────────────────────────────────────────────
    event ElectionCreated(string name, string organization);
    event CandidateAdded(uint256 id, string name, string party);
    event VoterRegistered(address voterAddress, string name);
    event VoteCast(address voter, uint256 candidateId);
    event ElectionStarted(uint256 startTime);
    event ElectionEnded(uint256 endTime, uint256 winnerId);

    // ─── MODIFIERS ─────────────────────────────────────────
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionActive() {
        require(election.isActive, "Election is not active");
        require(!election.isEnded, "Election has already ended");
        require(block.timestamp >= election.startTime, "Election has not started yet");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }

    modifier electionNotStarted() {
        require(!election.isActive, "Election already started");
        _;
    }

    // ─── CONSTRUCTOR ───────────────────────────────────────
    constructor() {
        admin = msg.sender;
    }

    // ─── ADMIN FUNCTIONS ───────────────────────────────────

    // Create election
    function createElection(
        string memory _name,
        string memory _organization,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyAdmin {
        require(!election.isActive, "Election already exists");
        require(_endTime > _startTime, "End time must be after start time");

        election = Election({
            name: _name,
            organization: _organization,
            startTime: _startTime,
            endTime: _endTime,
            isActive: false,
            isEnded: false,
            winnerCandidateId: 0
        });

        emit ElectionCreated(_name, _organization);
    }

    // Add candidate
    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _description
    ) public onlyAdmin electionNotStarted {
        candidateCount++;
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            party: _party,
            description: _description,
            voteCount: 0,
            isActive: true
        });

        emit CandidateAdded(candidateCount, _name, _party);
    }

    // Register voter
    function registerVoter(
        address _voterAddress,
        string memory _name
    ) public onlyAdmin {
        require(!voters[_voterAddress].isRegistered, "Voter already registered");

        voters[_voterAddress] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedCandidateId: 0,
            name: _name
        });

        emit VoterRegistered(_voterAddress, _name);
    }

    // Start election
    function startElection() public onlyAdmin {
        require(!election.isActive, "Election already active");
        require(candidateCount >= 2, "Need at least 2 candidates");
        election.isActive = true;

        emit ElectionStarted(block.timestamp);
    }

    // End election
    function endElection() public onlyAdmin {
        require(election.isActive, "Election is not active");
        require(!election.isEnded, "Election already ended");

        election.isActive = false;
        election.isEnded = true;
        election.winnerCandidateId = _calculateWinner();

        emit ElectionEnded(block.timestamp, election.winnerCandidateId);
    }

    // ─── VOTER FUNCTIONS ───────────────────────────────────

    // Cast vote
    function castVote(uint256 _candidateId) public electionActive {
        require(voters[msg.sender].isRegistered, "You are not a registered voter");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        require(candidates[_candidateId].isActive, "Candidate is not active");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit VoteCast(msg.sender, _candidateId);
    }

    // ─── PUBLIC VIEW FUNCTIONS ─────────────────────────────

    // Get all candidates
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }

    // Get election details
    function getElectionDetails() public view returns (Election memory) {
        return election;
    }

    // Get voter status
    function getVoterStatus(address _voterAddress) public view returns (Voter memory) {
        return voters[_voterAddress];
    }

    // Get winner
    function getWinner() public view returns (Candidate memory) {
        require(election.isEnded, "Election has not ended yet");
        return candidates[election.winnerCandidateId];
    }

    // Check if address is admin
    function isAdmin(address _address) public view returns (bool) {
        return _address == admin;
    }

    // ─── INTERNAL FUNCTIONS ────────────────────────────────

    // Calculate winner (highest votes)
    function _calculateWinner() internal view returns (uint256) {
        uint256 highestVotes = 0;
        uint256 winnerId = 1;

        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        return winnerId;
    }
}