import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  category: string;
}

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - Replace with actual Hedera smart contract calls
  useEffect(() => {
    const fetchProducts = async () => {
      // TODO: Implement actual product fetching from Hedera
      const mockProducts = [
        {
          id: '1',
          name: 'Vintage Watch',
          description: 'Luxury vintage timepiece in excellent condition',
          price: 100,
          image: 'https://example.com/watch.jpg',
          seller: '0.0.123456',
          category: 'accessories'
        },
        // Add more mock products
      ];
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleBuy = async (productId: string) => {
    // TODO: Implement purchase logic with Hedera smart contract
    console.log('Buying product:', productId);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Marketplace</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="art">Digital Art</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onBuy={handleBuy}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace; 