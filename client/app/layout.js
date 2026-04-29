import { Web3Provider } from "../context/Web3Context";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import "./globals.css";

export const metadata = {
  title: "VoteChain - Blockchain Voting System",
  description: "Decentralized Voting DApp - CN6035",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Web3Provider>
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}