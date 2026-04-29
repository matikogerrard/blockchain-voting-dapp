"use client";

import { useState } from "react";
import { getContract } from "../../lib/contract";
import { UserCheck, Loader, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterVoter({ onSuccess }) {
  const [form, setForm] = useState({ address: "", name: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const contract = await getContract(true);

      toast.loading("Registering voter on blockchain...");
      const tx = await contract.registerVoter(form.address, form.name);
      await tx.wait();

      toast.dismiss();
      toast.success(`${form.name} registered successfully!`);
      setForm({ address: "", name: "" });
      onSuccess();
    } catch (error) {
      toast.dismiss();
      if (error.reason?.includes("already registered")) {
        toast.error("This voter is already registered!");
      } else {
        toast.error(error.reason || "Failed to register voter");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck size={20} className="text-purple-600" />
        <h2 className="text-lg font-bold text-gray-800">Register Voter</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Voter Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Wallet Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="0x..."
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          {loading ? (
            <><Loader size={14} className="animate-spin" /> Registering...</>
          ) : (
            <><CheckCircle size={14} /> Register Voter</>
          )}
        </button>
      </form>
    </div>
  );
}