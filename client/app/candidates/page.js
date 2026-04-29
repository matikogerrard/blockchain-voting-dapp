"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import CandidateCard from "../../components/voter/CandidateCard";
import { Users, Loader, AlertCircle } from "lucide-react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const contract = await getContract();
      const data = await contract.getAllCandidates();
      const formatted = data.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        party: c.party,
        description: c.description,
        voteCount: c.voteCount.toString(),
        isActive: c.isActive,
      }));
      setCandidates(formatted.filter((c) => c.isActive));
    } catch (err) {
      setError("Failed to load candidates. Make sure MetaMask is connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users size={28} className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Candidates</h1>
          <p className="text-gray-500 text-sm">All registered candidates for this election</p>
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

      {/* No Candidates */}
      {!loading && !error && candidates.length === 0 && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg">
          <AlertCircle size={16} />
          No candidates have been added yet
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              showVoteButton={false}
              hasVoted={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}