import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import SellItem from './pages/SellItem';
import PairingComponent from './components/PairingComponent';
import HederaService from './services/HederaService';
import './App.css';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeHedera = async () => {
      try {
        const hederaService = HederaService.getInstance();
        await hederaService.initialize();
        setIsInitialized(true);
        setIsConnected(hederaService.isConnected());
      } catch (err) {
        setError('Failed to initialize Hedera connection. Please make sure HashPack wallet is installed.');
        console.error('Initialization error:', err);
      }
    };

    initializeHedera();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {!isInitialized ? (
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Connecting to Hedera network...</p>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="container mx-auto px-4 py-8">
            <PairingComponent />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/sell" element={<SellItem />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
