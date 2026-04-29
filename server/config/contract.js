const { ethers } = require("ethers");
require("dotenv").config();

const contractAddress = require("../../client/app/contracts/contract-address.json");
const contractABI = require("../../client/app/contracts/VotingSystem.json");

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

const getContract = () => {
  return new ethers.Contract(
    contractAddress.VotingSystem,
    contractABI.abi,
    provider
  );
};

module.exports = { getContract };