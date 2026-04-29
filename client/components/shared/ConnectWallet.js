"use client";

import { useWeb3 } from "../../context/Web3Context";
import { Wallet, LogOut, Loader, Coins } from "lucide-react";

export default function ConnectWallet() {
  const { account, balance, connectWallet, disconnectWallet, loading } = useWeb3();

  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg"
      >
        <Loader size={16} className="animate-spin" />
        Connecting...
      </button>
    );
  }

  if (account) {
    return (
      <div className="flex items-center gap-3">

        {/* Balance */}
        {balance && (
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-2 rounded-lg text-sm">
            <Coins size={14} />
            {balance} ETH
          </div>
        )}

        {/* Address */}
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
          <Wallet size={16} />
          {shortAddress(account)}
        </div>

        {/* Disconnect */}
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          <LogOut size={16} />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
    >
      <Wallet size={16} />
      Connect Wallet
    </button>
  );
}