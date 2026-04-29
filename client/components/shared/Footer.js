import { Vote, GithubIcon ,  Shield, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Vote size={20} />
            VoteChain
          </div>
          <p className="text-sm">
            A decentralized voting system built on blockchain technology.
            Transparent, secure and tamper-proof.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold mb-1">Quick Links</h3>
          <Link href="/candidates" className="text-sm hover:text-white transition">Candidates</Link>
          <Link href="/vote" className="text-sm hover:text-white transition">Vote</Link>
          <Link href="/results" className="text-sm hover:text-white transition">Results</Link>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-semibold mb-1">Technology</h3>
          <div className="flex items-center gap-2 text-sm">
            <Shield size={14} />
            Secured by Ethereum Blockchain
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe size={14} />
            Deployed on Sepolia TestNet
          </div>
          {/* <div className="flex items-center gap-2 text-sm">
            <GithubIcon size={14} />
            Open Source — CN6035 Project
          </div> */}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 text-center py-4 text-xs">
        Built for CN6035 Mobile & Distributed Systems — University of East London
      </div>
    </footer>
  );
}