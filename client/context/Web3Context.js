"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../lib/contract";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null); // ADD THIS

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      setAccount(accounts[0]);
      setChainId(network.chainId.toString());

      await checkUserRole(accounts[0]);
      await fetchBalance(accounts[0]); // ADD THIS

    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS FUNCTION
  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const raw = await provider.getBalance(address);
      const formatted = parseFloat(ethers.formatEther(raw)).toFixed(4);
      setBalance(formatted);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsAdmin(false);
    setIsRegistered(false);
    setHasVoted(false);
    setBalance(null); // ADD THIS
  };

  const checkUserRole = async (address) => {
    try {
      const contract = await getContract();
      const adminStatus = await contract.isAdmin(address);
      setIsAdmin(adminStatus);
      const voterStatus = await contract.getVoterStatus(address);
      setIsRegistered(voterStatus.isRegistered);
      setHasVoted(voterStatus.hasVoted);
    } catch (error) {
      console.error("Error checking role:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          checkUserRole(accounts[0]);
          fetchBalance(accounts[0]); // ADD THIS
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isAdmin,
        isRegistered,
        hasVoted,
        loading,
        chainId,
        balance, // ADD THIS
        connectWallet,
        disconnectWallet,
        checkUserRole,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);