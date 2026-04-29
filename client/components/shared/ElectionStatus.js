"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ElectionStatus() {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElection();
  }, []);

  const fetchElection = async () => {
    try {
      const contract = await getContract();
      const details = await contract.getElectionDetails();

      if (!details.name) {
        setLoading(false);
        return;
      }

      setElection({
        name: details.name,
        organization: details.organization,
        startTime: Number(details.startTime),
        endTime: Number(details.endTime),
        isActive: details.isActive,
        isEnded: details.isEnded,
      });
    } catch (error) {
      console.log("No election data yet");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Clock size={16} className="animate-spin" />
        Loading election status...
      </div>
    );
  }

  if (!election || !election.name) {
    return (
      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
        <AlertCircle size={16} />
        No election created yet
      </div>
    );
  }

  const formatDate = (timestamp) =>
    new Date(timestamp * 1000).toLocaleString();

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{election.name}</h2>
      <p className="text-sm text-gray-500 mb-4">{election.organization}</p>

      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          Start: {formatDate(election.startTime)}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          End: {formatDate(election.endTime)}
        </div>
      </div>

      <div className="mt-4">
        {election.isEnded ? (
          <span className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm w-fit">
            <XCircle size={14} />
            Election Ended
          </span>
        ) : election.isActive ? (
          <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm w-fit">
            <CheckCircle size={14} />
            Election Active
          </span>
        ) : (
          <span className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm w-fit">
            <AlertCircle size={14} />
            Not Started Yet
          </span>
        )}
      </div>
    </div>
  );
}