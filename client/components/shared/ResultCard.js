"use client";

import { Trophy, User, Award, ThumbsUp } from "lucide-react";

export default function ResultCard({ candidate, totalVotes, isWinner }) {
  const percentage =
    totalVotes > 0
      ? ((Number(candidate.voteCount) / Number(totalVotes)) * 100).toFixed(1)
      : 0;

  return (
    <div
      className={`bg-white rounded-xl shadow p-6 flex flex-col gap-4 border-2 transition ${
        isWinner ? "border-yellow-400" : "border-transparent"
      }`}
    >
      {/* Winner Badge */}
      {isWinner && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm w-fit font-semibold">
          <Trophy size={14} />
          Winner
        </div>
      )}

      {/* Candidate Info */}
      <div className="flex items-center gap-4">
        <div className={`rounded-full p-4 ${isWinner ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}>
          <User size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{candidate.name}</h3>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Award size={14} />
            {candidate.party}
          </div>
        </div>
      </div>

      {/* Vote Count */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <ThumbsUp size={14} />
        {candidate.voteCount.toString()} votes
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Vote Share</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              isWinner ? "bg-yellow-400" : "bg-blue-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}