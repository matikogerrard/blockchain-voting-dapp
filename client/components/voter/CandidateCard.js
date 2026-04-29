"use client";

import { User, Award, ThumbsUp } from "lucide-react";

export default function CandidateCard({ candidate, onVote, showVoteButton, hasVoted }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-6 flex flex-col gap-4">

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-4">
          <User size={28} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{candidate.name}</h3>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Award size={14} />
            {candidate.party}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500">{candidate.description}</p>

      {/* Vote Count */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        <ThumbsUp size={14} />
        {candidate.voteCount.toString()} votes
      </div>

      {/* Vote Button */}
      {showVoteButton && !hasVoted && (
        <button
          onClick={() => onVote(candidate.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <ThumbsUp size={14} />
          Vote for {candidate.name}
        </button>
      )}

      {hasVoted && (
        <div className="text-center text-green-600 text-sm font-medium bg-green-50 py-2 rounded-lg">
          You have already voted
        </div>
      )}
    </div>
  );
}