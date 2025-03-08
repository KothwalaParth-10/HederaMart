import React, { useEffect, useState } from "react";
import HederaService from "../services/HederaService";

const PairingComponent: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    const service = HederaService.getInstance();
    if (service.isConnected()) {
      window.location.reload(); // Refresh if already connected
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const service = HederaService.getInstance();
      await service.initialize();
      
      // Check if connection was successful
      if (service.isConnected()) {
        window.location.reload(); // Refresh to update app state
      } else {
        setError("Connection failed. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to HashPack wallet. Please make sure it's installed and try again.");
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Connect Wallet</h2>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-gray-600 text-center">
          Connect your HashPack wallet to start using HederaMart
        </p>
        
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Connecting...
            </div>
          ) : (
            "Connect HashPack Wallet"
          )}
        </button>

        {!error && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 text-center">
              Don't have HashPack?{" "}
              <a
                href="https://www.hashpack.app/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700"
              >
                Download here
              </a>
            </p>
            <p className="text-xs text-gray-400 text-center">
              Make sure to select an account when the HashPack popup appears
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PairingComponent; 