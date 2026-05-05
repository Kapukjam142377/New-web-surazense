import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "x-ZENSE-101",
    category: "Biosensors",
    price: 150.00,
    description: "x-ZENSE-101, a portable cancer screening device leveraging a piezoelectric biosensor.",
    image: "/product-drawing-2.jpg",
    status: "In Stock"
  },
  {
    id: 2,
    name: "5MHz QCM Sensor Chip",
    category: "Biosensors",
    price: 135.00,
    description: "Standard 5MHz quartz crystal for broader mass detection range applications.",
    image: "/qcmgroupe.jpg",
    status: "Low Stock"
  },
  {
    id: 3,
    name: "Standard Flow Cell",
    category: "Modules",
    price: 450.00,
    description: "Acrylic flow cell optimized for uniform liquid flow over the sensor surface.",
    image: null,
    status: "In Stock"
  },
  {
    id: 4,
    name: "Advanced Data Acquisition Hub",
    category: "Modules",
    price: 1200.00,
    description: "Real-time frequency and dissipation monitoring unit with USB interface.",
    image: null,
    status: "In Stock"
  },
  {
    id: 5,
    name: "Teflon Tubing Set",
    category: "Accessories",
    price: 45.00,
    description: "Chemical-resistant teflon tubing with standardized connectors (2 meters).",
    image: null,
    status: "In Stock"
  },
  {
    id: 6,
    name: "O-Ring Replacement Pack",
    category: "Accessories",
    price: 25.00,
    description: "Pack of 10 viton O-rings for sealing the flow cell module.",
    image: null,
    status: "In Stock"
  }
];

const CATEGORIES = ["All", "Biosensors", "Modules", "Accessories"];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [flyingItem, setFlyingItem] = useState(null);
  const { addToCart } = useCart();

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product, e) => {
    // Prevent multiple animations at once to avoid glitches
    if (flyingItem) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById('global-cart-icon');
    
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      
      // Calculate coordinates relative to viewport
      setFlyingItem({
        id: Date.now(),
        image: product.image,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2
      });
      
      // Add to cart immediately so the number updates during the flight
      addToCart(product);
      
      // Remove the flying element after the animation duration (1000ms)
      setTimeout(() => {
        setFlyingItem(null);
      }, 1000);
    } else {
      // Fallback if cart icon is not found
      addToCart(product);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 relative">
      
      {/* Flying Item Animation */}
      {flyingItem && (
        <motion.div
          initial={{ 
            x: flyingItem.startX - 30, // -30 to center the 60px element
            y: flyingItem.startY - 30, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            x: flyingItem.endX - 30, 
            y: flyingItem.endY - 30, 
            scale: 0.1, 
            opacity: 0.2 
          }}
          transition={{ 
            duration: 1.0, 
            ease: [0.32, 0.72, 0, 1] // Elegant ease-out curve
          }}
          className="fixed z-[100] w-[60px] h-[60px] rounded-full border-2 border-white shadow-2xl overflow-hidden bg-white pointer-events-none flex items-center justify-center"
          style={{ top: 0, left: 0 }}
        >
          {flyingItem.image ? (
            <img src={flyingItem.image} alt="flying" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-500"></div>
          )}
        </motion.div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Surazense <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Store</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Explore our premium range of QCM sensors, advanced analytical modules, and accessories designed for high-precision research.
          </p>
        </motion.div>
      </div>

      {/* Controls Section (Filters & Search) */}
      <div className="max-w-7xl mx-auto px-6 mb-10 sticky top-[80px] z-30">
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-sm shadow-blue-900/5 border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Categories */}
          <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === category 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-transparent rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-900"
            />
          </div>

        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter.</p>
            <button 
              onClick={() => {setActiveCategory("All"); setSearchQuery("");}}
              className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-full hover:bg-blue-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  
                  {/* Image Placeholder (User will replace src later) */}
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                        <ImageIcon className="w-12 h-12 mb-3 opacity-50 stroke-[1.5px]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full">Add Image Later</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                        product.status === 'In Stock' 
                          ? 'bg-green-100/80 text-green-700 border border-green-200/50' 
                          : 'bg-orange-100/80 text-orange-700 border border-orange-200/50'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{product.category}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-8 line-clamp-2 flex-1 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-2xl font-black text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all group/btn"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-6 h-6 stroke-[2px] group-hover/btn:scale-110 group-hover/btn:-rotate-6 transition-all duration-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  );
}
