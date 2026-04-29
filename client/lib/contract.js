import { ethers } from "ethers";
import contractABI from "../app/contracts/VotingSystem.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const READ_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;

export const getContract = async (needSigner = false) => {
  if (needSigner) {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI.abi,
      signer
    );
  }

  // Read calls use Alchemy directly
  const provider = new ethers.JsonRpcProvider(READ_RPC_URL);
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI.abi,
    provider
  );
};

export const getTxOptions = async () => {
  try {
    // Use Alchemy for fee data - not MetaMask
    const provider = new ethers.JsonRpcProvider(READ_RPC_URL);
    const feeData = await provider.getFeeData();

    return {
      maxFeePerGas: feeData.maxFeePerGas
        ? feeData.maxFeePerGas * 2n
        : undefined,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
        ? feeData.maxPriorityFeePerGas * 2n
        : undefined,
    };
  } catch (error) {
    // Fallback - let MetaMask handle gas automatically
    return {};
  }
};