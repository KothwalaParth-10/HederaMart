import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';

const Navbar: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [accountId, setAccountId] = useState<string>('');
  const [hashConnect] = useState<HashConnect>(new HashConnect());

  const connectWallet = async () => {
    try {
      const appMetadata: HashConnectTypes.AppMetadata = {
        name: "HederaMart",
        description: "Decentralized Marketplace on Hedera",
        icon: "https://www.hedera.com/logo-capital-hbar-wordmark.png",
        url: window.location.origin
      };

      // Initialize HashConnect
      await hashConnect.init(appMetadata, "testnet", false);
      
      // Connect to local wallet
      await hashConnect.connectToLocalWallet();

      // Listen for connection events
      hashConnect.connectionStatusChangeEvent.on((state) => {
        if (state === "Connected") {
          setIsWalletConnected(true);
        }
      });

      // Listen for pairing events
      hashConnect.pairingEvent.on((data: MessageTypes.ApprovePairing) => {
        if (data.accountIds && data.accountIds.length > 0) {
          setAccountId(data.accountIds[0]);
        }
      });

    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center">
          <span className="text-yellow-400">Hedera</span>Mart
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/marketplace" className="text-white hover:text-yellow-200 transition-colors">
            Marketplace
          </Link>
          <Link to="/sell" className="text-white hover:text-yellow-200 transition-colors">
            Sell Item
          </Link>
          <Link to="/dashboard" className="text-white hover:text-yellow-200 transition-colors">
            Dashboard
          </Link>
          
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              className="bg-yellow-400 text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-colors transform hover:scale-105"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-white bg-purple-700 px-4 py-2 rounded-full">
              {accountId.slice(0, 6)}...{accountId.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 