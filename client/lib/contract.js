import { ethers } from "ethers";
import contractAddress from "../app/contracts/contract-address.json";
import contractABI from "../app/contracts/VotingSystem.json";

export const getContract = async (needSigner = false) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  if (needSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(
      contractAddress.VotingSystem,
      contractABI.abi,
      signer
    );
  }

  return new ethers.Contract(
    contractAddress.VotingSystem,
    contractABI.abi,
    provider
  );
};

// Use this for every transaction to avoid stuck txns
export const getTxOptions = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const feeData = await provider.getFeeData();
  return {
    maxFeePerGas: feeData.maxFeePerGas * 2n,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2n,
  };
};