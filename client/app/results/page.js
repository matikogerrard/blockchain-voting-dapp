"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import ResultCard from "../../components/shared/ResultCard";
import {
  BarChart2,
  Loader,
  AlertCircle,
  Trophy,
  Users,
} from "lucide-react";

export default function ResultsPage() {
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [winner, setWinner] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
    // Auto refresh every 10 seconds if election is active
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      const contract = await getContract();
      const [data, electionDetails, total] = await Promise.all([
        contract.getAllCandidates(),
        contract.getElectionDetails(),
        contract.totalVotes(),
      ]);

      const formatted = data.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        party: c.party,
        description: c.description,
        voteCount: c.voteCount.toString(),
        isActive: c.isActive,
      }));

      // Sort by vote count descending
      formatted.sort((a, b) => Number(b.voteCount) - Number(a.voteCount));

      setCandidates(formatted);
      setTotalVotes(Number(total));
      setElection({
        name: electionDetails.name,
        organization: electionDetails.organization,
        isActive: electionDetails.isActive,
        isEnded: electionDetails.isEnded,
        winnerCandidateId: electionDetails.winnerCandidateId.toString(),
      });

      // Get winner if election ended
      if (electionDetails.isEnded) {
        const w = await contract.getWinner();
        setWinner({
          id: w.id.toString(),
          name: w.name,
          party: w.party,
          voteCount: w.voteCount.toString(),
        });
      }
    } catch (err) {
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart2 size={28} className="text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Election Results</h1>
          <p className="text-gray-500 text-sm">
            {election?.isActive ? "Live results — updates every 10 seconds" : "Final results"}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader size={18} className="animate-spin" />
          Loading results...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Winner Banner */}
      {winner && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 mb-8 flex items-center gap-4">
          <Trophy size={40} className="text-yellow-500" />
          <div>
            <p className="text-sm text-yellow-600 font-medium">Election Winner</p>
            <h2 className="text-2xl font-bold text-gray-800">{winner.name}</h2>
            <p className="text-gray-500 text-sm">{winner.party} — {winner.voteCount} votes</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-3 rounded-lg mb-6 w-fit">
          <Users size={16} />
          Total Votes Cast: <span className="font-bold ml-1">{totalVotes}</span>
        </div>
      )}

      {/* Results Grid */}
      {!loading && candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <ResultCard
              key={candidate.id}
              candidate={candidate}
              totalVotes={totalVotes}
              isWinner={winner?.id === candidate.id}
            />
          ))}
        </div>
      )}

      {/* No data */}
      {!loading && candidates.length === 0 && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg">
          <AlertCircle size={16} />
          No results available yet
        </div>
      )}
    </div>
  );
}