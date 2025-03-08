import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  onBuy: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  seller,
  onBuy,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
          ℏ {price}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Seller: {seller.slice(0, 6)}...{seller.slice(-4)}
          </div>
          <button
            onClick={() => onBuy(id)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 