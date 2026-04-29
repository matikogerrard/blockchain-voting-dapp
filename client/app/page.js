"use client";

import Link from "next/link";
import { useWeb3 } from "../context/Web3Context";
import ConnectWallet from "../components/shared/ConnectWallet";
import ElectionStatus from "../components/shared/ElectionStatus";
import { Vote, Users, BarChart2, Shield, ChevronRight, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  const { account, isAdmin, isRegistered } = useWeb3();

  const features = [
    {
      icon: <Shield size={24} className="text-blue-600" />,
      title: "Tamper-Proof",
      desc: "Every vote is recorded on the blockchain and cannot be altered",
    },
    {
      icon: <Vote size={24} className="text-green-600" />,
      title: "Transparent",
      desc: "All votes are publicly verifiable on the blockchain explorer",
    },
    {
      icon: <Users size={24} className="text-purple-600" />,
      title: "Secure",
      desc: "Only whitelisted wallet addresses can participate in voting",
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="bg-white/20 p-4 rounded-full">
            <Vote size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Blockchain Voting System
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            A transparent, secure and decentralized voting platform.
            Your vote is immutably recorded on the Ethereum blockchain.
          </p>

          {!account ? (
            <ConnectWallet />
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                  <ChevronRight size={16} />
                </Link>
              )}
              {isRegistered && (
                <Link
                  href="/vote"
                  className="flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition"
                >
                  <Vote size={18} />
                  Cast Your Vote
                  <ChevronRight size={16} />
                </Link>
              )}
              <Link
                href="/candidates"
                className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/30 transition"
              >
                <Users size={18} />
                View Candidates
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Election Status */}
      <section className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Current Election</h2>
        <ElectionStatus />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Why Blockchain Voting?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3">
              <div className="bg-gray-50 rounded-full p-3 w-fit">{f.icon}</div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/candidates" className="bg-blue-50 hover:bg-blue-100 rounded-xl p-6 flex items-center justify-between transition">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-blue-600" />
              <span className="font-medium text-blue-800">View Candidates</span>
            </div>
            <ChevronRight size={18} className="text-blue-600" />
          </Link>
          <Link href="/vote" className="bg-green-50 hover:bg-green-100 rounded-xl p-6 flex items-center justify-between transition">
            <div className="flex items-center gap-3">
              <Vote size={20} className="text-green-600" />
              <span className="font-medium text-green-800">Cast Your Vote</span>
            </div>
            <ChevronRight size={18} className="text-green-600" />
          </Link>
          <Link href="/results" className="bg-purple-50 hover:bg-purple-100 rounded-xl p-6 flex items-center justify-between transition">
            <div className="flex items-center gap-3">
              <BarChart2 size={20} className="text-purple-600" />
              <span className="font-medium text-purple-800">View Results</span>
            </div>
            <ChevronRight size={18} className="text-purple-600" />
          </Link>
        </div>
      </section>
    </div>
  );
}