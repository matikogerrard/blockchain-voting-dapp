"use client";

import { useState } from "react";
import { getContract } from "../../lib/contract";
import { Play, Square, Loader, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ElectionControl({ election, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);
      const contract = await getContract(true);
      toast.loading("Starting election...");
      const tx = await contract.startElection();
      await tx.wait();
      toast.dismiss();
      toast.success("Election started successfully!");
      onSuccess();
    } catch (error) {
      toast.dismiss();
      toast.error(error.reason || "Failed to start election");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    try {
      setLoading(true);
      const contract = await getContract(true);
      toast.loading("Ending election...");
      const tx = await contract.endElection();
      await tx.wait();
      toast.dismiss();
      toast.success("Election ended! Winner declared.");
      onSuccess();
    } catch (error) {
      toast.dismiss();
      toast.error(error.reason || "Failed to end election");
    } finally {
      setLoading(false);
    }
  };

  if (!election?.name) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg">
          <AlertCircle size={16} />
          Create an election first before controlling it
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Play size={20} className="text-orange-600" />
        <h2 className="text-lg font-bold text-gray-800">Election Control</h2>
      </div>

      {/* Election Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">{election.name}</p>
        <p className="text-xs text-gray-500">{election.organization}</p>
        <div className="mt-1">
          {election.isEnded ? (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Ended</span>
          ) : election.isActive ? (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Not Started</span>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col gap-3">
        {!election.isActive && !election.isEnded && (
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? (
              <><Loader size={16} className="animate-spin" /> Processing...</>
            ) : (
              <><Play size={16} /> Start Election</>
            )}
          </button>
        )}

        {election.isActive && !election.isEnded && (
          <button
            onClick={handleEnd}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? (
              <><Loader size={16} className="animate-spin" /> Processing...</>
            ) : (
              <><Square size={16} /> End Election</>
            )}
          </button>
        )}

        {election.isEnded && (
          <div className="text-center text-gray-500 text-sm py-2">
            Election has ended. View results on the Results page.
          </div>
        )}
      </div>
    </div>
  );
}