"use client";

import { useState } from "react";
import { getContract, getTxOptions } from "../../lib/contract";
import { UserPlus, Loader, CheckCircle, User, Award, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AddCandidate({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    party: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setTxHash(null);
      const contract = await getContract(true);
      const txOptions = await getTxOptions();

      toast.loading("Sending transaction...");
      const tx = await contract.addCandidate(
        form.name,
        form.party,
        form.description,
        txOptions
      );

      setTxHash(tx.hash);
      toast.dismiss();
      toast.loading("Waiting for confirmation...");

      await tx.wait();

      toast.dismiss();
      toast.success(`${form.name} added successfully!`);
      setForm({ name: "", party: "", description: "" });
      setTxHash(null);
      onSuccess();
    } catch (error) {
      toast.dismiss();
      toast.error(error.reason || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <UserPlus size={20} className="text-green-600" />
        <h2 className="text-lg font-bold text-gray-800">Add Candidate</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <User size={14} />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Smith"
            required
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
        </div>

        {/* Party / Department */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Award size={14} />
            Party / Department
          </label>
          <input
            type="text"
            name="party"
            value={form.party}
            onChange={handleChange}
            placeholder="e.g. Independent / Computing Dept"
            required
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
        </div>

        {/* Description - Key Points */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <FileText size={14} />
            Brief Description
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. 5 years experience, focuses on student welfare"
            required
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
          <p className="text-xs text-gray-400">Keep it short — this is stored on blockchain</p>
        </div>

        {/* Transaction Progress */}
        {loading && (
          <div className="flex flex-col gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
              <Loader size={14} className="animate-spin" />
              {txHash ? "Waiting for block confirmation..." : "Sending to blockchain..."}
            </div>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 underline break-all"
              >
                View on Etherscan: {txHash.slice(0, 20)}...
              </a>
            )}
            <p className="text-xs text-blue-400">
              Sepolia TestNet takes 15-30 seconds. Do not close this page.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          {loading ? (
            <><Loader size={14} className="animate-spin" /> Processing...</>
          ) : (
            <><CheckCircle size={14} /> Add Candidate</>
          )}
        </button>
      </form>
    </div>
  );
}