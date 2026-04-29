"use client";

import { useState } from "react";
import { getContract } from "../../lib/contract";
import { Vote, Loader, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateElection({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const contract = await getContract(true);

      const startTimestamp = Math.floor(
        new Date(form.startTime).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(form.endTime).getTime() / 1000
      );

      toast.loading("Creating election on blockchain...");
      const tx = await contract.createElection(
        form.name,
        form.organization,
        startTimestamp,
        endTimestamp
      );
      await tx.wait();

      toast.dismiss();
      toast.success("Election created successfully!");
      setForm({ name: "", organization: "", startTime: "", endTime: "" });
      onSuccess();
    } catch (error) {
      toast.dismiss();
      toast.error(error.reason || "Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Vote size={20} className="text-blue-600" />
        <h2 className="text-lg font-bold text-gray-800">Create Election</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Election Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Presidential Election 2026"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Organization</label>
          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="e.g. University of East London"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          {loading ? (
            <><Loader size={14} className="animate-spin" /> Creating...</>
          ) : (
            <><CheckCircle size={14} /> Create Election</>
          )}
        </button>
      </form>
    </div>
  );
}