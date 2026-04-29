const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log(" Starting deployment...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(" Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(" Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  console.log("\n Deploying VotingSystem contract...");
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();
  await votingSystem.waitForDeployment();

  const contractAddress = await votingSystem.getAddress();
  console.log(" VotingSystem deployed to:", contractAddress);

  // Save contract address + ABI to client folder automatically
  saveContractData(contractAddress);

  console.log("\n Deployment complete!");
  console.log(" Contract Address:", contractAddress);
  console.log(" View on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);
}

function saveContractData(contractAddress) {
  // Paths
  const contractsDir = path.join(__dirname, "../../client/app/contracts");

  // Create contracts folder in client if not exists
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ VotingSystem: contractAddress }, null, 2)
  );

  // Save ABI
  const artifact = require("../artifacts/contracts/VotingSystem.sol/VotingSystem.json");
  fs.writeFileSync(
    path.join(contractsDir, "VotingSystem.json"),
    JSON.stringify(artifact, null, 2)
  );

  console.log("\n Contract data saved to client/app/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });