# VoteChain: Blockchain Voting System

A decentralized, transparent and tamper-proof voting system built on Ethereum blockchain. Designed for organizations, institutions and communities to conduct secure elections where every vote is immutably recorded on-chain and publicly verifiable.

This project was developed as part of the CN6035 Mobile and Distributed Systems module at the University of East London (2025/26).

---

## Features

- Admin can create elections, add candidates and register voters
- Voters can cast votes securely using their MetaMask wallet
- One wallet address = one vote enforced by smart contract
- Real-time live results visible to the public
- Winner automatically declared by smart contract on election end
- All transactions publicly verifiable on Etherscan
- Fully decentralized - no central authority controls the votes

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- Tailwind CSS v4
- Ethers.js v6
- Lucide React (icons)
- React Hot Toast (notifications)

### Backend
- Node.js
- Express.js
- Ethers.js v6 (read-only contract interaction)
- CORS
- Dotenv

### Blockchain
- Solidity 0.8.28
- Hardhat 2.22.0
- Hardhat Toolbox 4.0.0
- Ethereum Sepolia TestNet
- MetaMask (wallet)

### Tools
- GitHub (version control)
- Alchemy (RPC provider)
- Etherscan (contract verification)
- Visual Studio Code

---
```

## Project Structure

blockchain-voting-dapp/
  |-- client/                  Next.js frontend
  |     |-- app/               Pages (App Router)
  |     |     |-- admin/       Admin dashboard
  |     |     |-- vote/        Voter page
  |     |     |-- candidates/  Public candidates page
  |     |     |-- results/     Public results page
  |     |     |-- contracts/   ABI and contract address (auto-generated)
  |     |-- components/        Reusable UI components
  |     |     |-- admin/       Admin components
  |     |     |-- voter/       Voter components
  |     |     |-- shared/      Shared components (Navbar, Footer)
  |     |-- context/           Web3Context (global blockchain state)
  |     |-- hooks/             Custom hooks
  |     |-- lib/               Contract connection helpers
  |     |-- utils/             Helper functions
  |
  |-- server/                  Express.js API Gateway
  |     |-- config/            Contract connection config
  |     |-- controllers/       Route controllers
  |     |-- routes/            API routes
  |     |-- middleware/        Express middleware
  |     |-- index.js           Server entry point
  |
  |-- blockchain/              Smart contract
  |     |-- contracts/         Solidity contracts
  |     |-- scripts/           Deployment scripts
  |     |-- test/              Contract tests
  |     |-- hardhat.config.js  Hardhat configuration
  |
  |-- README.md

  ```

---

## Prerequisites

Make sure you have the following installed:

- Node.js v18 or above - https://nodejs.org
- MetaMask browser extension - https://metamask.io
- Git - https://git-scm.com
- Alchemy account (free) - https://alchemy.com
- EatherScan Account (free) - https://etherscan.io/

---

## Installation and Setup

### 1. Clone the Repository

git clone https://github.com/matikogerrard/blockchain-voting-dapp.git
cd blockchain-voting-dapp

### 2. Install Blockchain Dependencies

cd blockchain
npm install

Create .env file inside blockchain/:

SEPOLIA_RPC_URL=your_alchemy_sepolia_url
PRIVATE_KEY=your_metamask_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

### 3. Install Backend Dependencies

cd ../server
npm install

Create .env file inside server/:

PORT=5000
CLIENT_URL=http://localhost:3000
SEPOLIA_RPC_URL=your_alchemy_sepolia_url
CONTRACT_ADDRESS=your_deployed_contract_address

### 4. Install Frontend Dependencies

cd ../client
npm install

Create .env.local file inside client/:

NEXT_PUBLIC_ALCHEMY_RPC_URL=your_alchemy_sepolia_url
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

---

## Running the Project

### Option A: Local Development (Recommended for Testing)

Terminal 1: Start local blockchain:
`cd blockchain`
`npx hardhat node`

Terminal 2: Deploy contract locally:
`cd blockchain`
`npx hardhat run scripts/deploy.js --network localhost`

Terminal 3: Start backend:
`cd server`
`npm run dev`

Terminal 4: Start frontend:
`cd client`
`npm run dev`

Open http://localhost:3000

### Option B: Sepolia TestNet

Deploy to Sepolia:
`cd blockchain`

`npx hardhat compile`

`npx hardhat run scripts/deploy.js --network sepolia`

Start backend and frontend same as above.

---

## Running Tests

`cd blockchain`
`npx hardhat test`

Expected output:

```
VotingSystem
  Deployment
    - Should set the correct admin
    - Should start with zero candidates
    - Should start with zero total votes
  Create Election
    - Should allow admin to create election
    - Should NOT allow non-admin to create election
    - Should fail if end time is before start time
  Add Candidates
    - Should allow admin to add candidate
    - Should store candidate details correctly
    - Should NOT allow non-admin to add candidate
  Register Voters
    - Should allow admin to register voter
    - Should NOT register same voter twice
  Voting
    - Should allow registered voter to cast vote
    - Should increase candidate vote count
    - Should NOT allow voting twice
    - Should NOT allow unregistered voter to vote
    - Should NOT allow voting for invalid candidate
  End Election
    - Should end election and declare winner
    - Should return correct winner

18 passing
```
---

## API Endpoints

Base URL: http://localhost:5000

Election:
GET    /api/election/details        Get election name, org, times, status
GET    /api/election/status         Get isActive and isEnded status
GET    /api/election/winner         Get winner details after election ends

Candidates:
GET    /api/candidates              Get all candidates with vote counts
GET    /api/candidates/:id          Get single candidate by ID

Voters:
GET    /api/voters/status/:address  Get voter registration and vote status

Health Check:
GET    /api/health                  Check if server is running

---

## Smart Contract
```
Contract Name:    VotingSystem
Solidity Version: 0.8.28
Network:          Ethereum Sepolia TestNet
Contract Address: 0x963E6FbbF0cF022028eB38500Ac311139cad3D3f
Etherscan:        https://sepolia.etherscan.io/address/0x963E6FbbF0cF022028eB38500Ac311139cad3D3f
```
Key Functions:
```
createElection()      Admin only   Create a new election
addCandidate()        Admin only   Add a candidate
registerVoter()       Admin only   Whitelist a voter address
startElection()       Admin only   Start the election
endElection()         Admin only   End and declare winner
castVote()            Voters only  Cast one vote
getAllCandidates()     Public       Get all candidates
getElectionDetails()  Public       Get election info
getWinner()           Public       Get winner after election ends
```
---

## User Roles
```
Admin          Full control — deployer wallet is admin
Voter          Must be whitelisted by admin to vote
General Public Can view candidates and results without wallet
```
---

## MetaMask Setup for Local Development

1. Open MetaMask
2. Add Network manually:
   Network Name:    Hardhat Local
   RPC URL:         http://127.0.0.1:8545
   Chain ID:        1337
   Currency Symbol: ETH
3. Import a test account using private key from npx hardhat node output

---

## Environment Variables

blockchain/.env:
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=

server/.env:
PORT=5000
CLIENT_URL=http://localhost:3000
SEPOLIA_RPC_URL=
CONTRACT_ADDRESS=

---

## Author
```
Name:         Matiko Gerald
Student ID:   2644315
Module:       CN6035 Mobile and Distributed Systems
University:   University of East London
Year:         2025/26
```
---

## License

MIT License - free to use for academic purposes.