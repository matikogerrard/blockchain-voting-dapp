"use client";

import Link from "next/link";
import { useWeb3 } from "../../context/Web3Context";
import ConnectWallet from "./ConnectWallet";
import { Vote, LayoutDashboard, Users, BarChart2, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { isAdmin } = useWeb3();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/candidates", label: "Candidates", icon: <Users size={16} /> },
    { href: "/vote", label: "Vote", icon: <Vote size={16} /> },
    { href: "/results", label: "Results", icon: <BarChart2 size={16} /> },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: <LayoutDashboard size={16} /> }]
      : []),
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Vote size={24} />
          VoteChain
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition text-sm font-medium"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Connect Wallet */}
        <div className="hidden md:flex">
          <ConnectWallet />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-2 border-b"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <ConnectWallet />
        </div>
      )}
    </nav>
  );
}