"use client";

import { UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useWeb3 } from "../../context/Web3Context";
import { getContract } from "../../lib/contract";
import CreateElection from "../../components/admin/CreateElection";
import AddCandidate from "../../components/admin/AddCandidate";
import RegisterVoter from "../../components/admin/RegisterVoter";
import ElectionControl from "../../components/admin/ElectionControl";
import ConnectWallet from "../../components/shared/ConnectWallet";
import {
  LayoutDashboard,
  Lock,
  Users,
  Vote,
  BarChart2,
  RefreshCw,
} from "lucide-react";

export default function AdminPage() {
  const { account, isAdmin } = useWeb3();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("election");

  useEffect(() => {
    if (account && isAdmin) fetchData();
  }, [account, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const [electionDetails, candidateData, total] = await Promise.all([
        contract.getElectionDetails(),
        contract.getAllCandidates(),
        contract.totalVotes(),
      ]);

      setElection({
        name: electionDetails.name,
        organization: electionDetails.organization,
        isActive: electionDetails.isActive,
        isEnded: electionDetails.isEnded,
      });

      setCandidates(candidateData.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        party: c.party,
        voteCount: c.voteCount.toString(),
      })));

      setTotalVotes(Number(total));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "election", label: "Election", icon: <Vote size={16} /> },
    { id: "candidates", label: "Candidates", icon: <Users size={16} /> },
    { id: "voters", label: "Voters", icon: <UserCheck size={16} /> },
    { id: "control", label: "Control", icon: <BarChart2 size={16} /> },
  ];

  // Not connected
  if (!account) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <Lock size={48} className="text-gray-400" />
        <h2 className="text-xl font-bold text-gray-700">Connect Your Wallet</h2>
        <p className="text-gray-500 text-sm">Admin access requires wallet connection</p>
        <ConnectWallet />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <Lock size={48} className="text-red-400" />
        <h2 className="text-xl font-bold text-gray-700">Access Denied</h2>
        <p className="text-gray-500 text-sm">
          Only the contract owner can access the admin dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={28} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage the entire election system</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-2 rounded-lg transition"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Vote size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Election Status</p>
            <p className="font-bold text-gray-800">
              {election?.isEnded ? "Ended" : election?.isActive ? "Active" : "Not Started"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Candidates</p>
            <p className="font-bold text-gray-800">{candidates.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
            <BarChart2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Votes</p>
            <p className="font-bold text-gray-800">{totalVotes}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "election", label: "Election", icon: <Vote size={16} /> },
          { id: "candidates", label: "Candidates", icon: <Users size={16} /> },
          { id: "voters", label: "Voters", icon: <Users size={16} /> },
          { id: "control", label: "Control", icon: <BarChart2 size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === "election" && (
          <CreateElection onSuccess={fetchData} />
        )}
        {activeTab === "candidates" && (
          <AddCandidate onSuccess={fetchData} />
        )}
        {activeTab === "voters" && (
          <RegisterVoter onSuccess={fetchData} />
        )}
        {activeTab === "control" && (
          <ElectionControl election={election} onSuccess={fetchData} />
        )}
      </div>
    </div>
  );
}