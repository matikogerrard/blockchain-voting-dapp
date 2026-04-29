"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "../../context/Web3Context";
import { getContract } from "../../lib/contract";
import CandidateCard from "../../components/voter/CandidateCard";
import VoteButton from "../../components/voter/VoteButton";
import ConnectWallet from "../../components/shared/ConnectWallet";
import {
  Vote,
  Loader,
  AlertCircle,
  CheckCircle,
  Lock,
} from "lucide-react";

export default function VotePage() {
  const { account, isRegistered, hasVoted, checkUserRole } = useWeb3();
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [account]);

  const fetchData = async () => {
    try {
      const contract = await getContract();
      const [data, electionDetails] = await Promise.all([
        contract.getAllCandidates(),
        contract.getElectionDetails(),
      ]);

      const formatted = data.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        party: c.party,
        description: c.description,
        voteCount: c.voteCount.toString(),
        isActive: c.isActive,
      }));

      setCandidates(formatted.filter((c) => c.isActive));
      setElection({
        isActive: electionDetails.isActive,
        isEnded: electionDetails.isEnded,
        name: electionDetails.name,
      });
    } catch (err) {
      setError("Failed to load voting data.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSuccess = async () => {
    if (account) await checkUserRole(account);
    await fetchData();
  };

  // Not connected
  if (!account) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <Lock size={48} className="text-gray-400" />
        <h2 className="text-xl font-bold text-gray-700">Connect Your Wallet</h2>
        <p className="text-gray-500 text-sm">
          You need to connect your MetaMask wallet to vote
        </p>
        <ConnectWallet />
      </div>
    );
  }

  // Not registered
  if (!isRegistered) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={48} className="text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-700">Not Registered</h2>
        <p className="text-gray-500 text-sm">
          Your wallet is not registered as a voter. Contact the admin to get registered.
        </p>
      </div>
    );
  }

  // Already voted
  if (hasVoted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <CheckCircle size={48} className="text-green-500" />
        <h2 className="text-xl font-bold text-gray-700">Vote Cast Successfully</h2>
        <p className="text-gray-500 text-sm">
          Your vote has been recorded on the blockchain. Thank you for participating!
        </p>
      </div>
    );
  }

  // Election not active
  if (election && !election.isActive) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-bold text-gray-700">
          {election.isEnded ? "Election Has Ended" : "Election Not Started Yet"}
        </h2>
        <p className="text-gray-500 text-sm">
          {election.isEnded
            ? "The election has ended. Check the results page."
            : "The election has not started yet. Please wait for the admin to start it."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Vote size={28} className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cast Your Vote</h1>
          <p className="text-gray-500 text-sm">
            Select a candidate below. You can only vote once.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader size={18} className="animate-spin" />
          Loading candidates...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex flex-col gap-3">
              <CandidateCard
                candidate={candidate}
                showVoteButton={false}
                hasVoted={false}
              />
              <VoteButton
                candidateId={candidate.id}
                candidateName={candidate.name}
                onSuccess={handleVoteSuccess}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}