"use client";

import { useState } from "react";
import { getContract } from "../../lib/contract";
import { Vote, Loader, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function VoteButton({ candidateId, candidateName, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    try {
      setLoading(true);
      const contract = await getContract(true);

      toast.loading("Sending vote to blockchain...");
      const tx = await contract.castVote(candidateId);

      toast.loading("Waiting for confirmation...");
      await tx.wait();

      toast.dismiss();
      toast.success(`Vote cast for ${candidateName} successfully!`);
      onSuccess();
    } catch (error) {
      toast.dismiss();
      if (error.message.includes("already voted")) {
        toast.error("You have already voted!");
      } else if (error.message.includes("not registered")) {
        toast.error("You are not a registered voter!");
      } else {
        toast.error("Transaction failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-medium transition"
    >
      {loading ? (
        <>
          <Loader size={14} className="animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Vote size={14} />
          Vote for {candidateName}
        </>
      )}
    </button>
  );
}