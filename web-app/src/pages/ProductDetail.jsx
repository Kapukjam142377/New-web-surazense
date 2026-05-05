import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('Product Information');
  const [flyingItem, setFlyingItem] = useState(null);

  // Find the product
  const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const TABS = ['Product Information', 'Specification', 'Assay Documents'];

  // Animation handler
  const handleAddToCart = (e) => {
    if (flyingItem) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById('global-cart-icon');
    
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      
      setFlyingItem({
        id: Date.now(),
        image: product.image,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2
      });
      
      addToCart(product);
      
      setTimeout(() => {
        setFlyingItem(null);
      }, 1000);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-24 relative overflow-hidden">
      
      {/* Flying Item Animation */}
      {flyingItem && (
        <motion.div
          initial={{ x: flyingItem.startX - 30, y: flyingItem.startY - 30, scale: 1, opacity: 1 }}
          animate={{ x: flyingItem.endX - 30, y: flyingItem.endY - 30, scale: 0.1, opacity: 0.2 }}
          transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
          className="fixed z-[100] w-[60px] h-[60px] rounded-full border-2 border-slate-200 shadow-2xl overflow-hidden bg-white pointer-events-none flex items-center justify-center"
          style={{ top: 0, left: 0 }}
        >
          {flyingItem.image ? (
            <img src={flyingItem.image} alt="flying" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-500"></div>
          )}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>

        {/* Title and Tabs Header */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-blue-700 italic mb-6 tracking-tight font-medium"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
          >
            {product.name.toUpperCase()}
          </motion.h1>
          
          <div className="flex flex-wrap items-center gap-4 text-lg md:text-xl border-b border-slate-200 pb-2">
            {TABS.map((tab, idx) => (
              <React.Fragment key={tab}>
                <button 
                  onClick={() => setActiveTab(tab)}
                  className={`font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer ${
                    activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
                {idx < TABS.length - 1 && (
                  <div className="w-[2px] h-6 bg-blue-700 mx-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Image and Carousel Indicators */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-full aspect-[4/3] relative flex items-center justify-center mb-8">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Carousel Indicators (Mock) */}
            <div className="flex items-center justify-center gap-4">
              {[0, 1, 2, 3, 4].map(idx => (
                <div 
                  key={idx} 
                  className={`h-2.5 transition-colors cursor-pointer ${idx === 0 ? 'w-12 bg-slate-400' : 'w-12 bg-slate-300 hover:bg-slate-400'}`}
                ></div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Description */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'Product Information' && (
                <motion.div 
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900">Product Information</h2>
                  <p className="text-slate-700 leading-relaxed text-lg text-justify">
                    {product.description}
                  </p>
                </motion.div>
              )}
              
              {activeTab === 'Specification' && (
                <motion.div 
                  key="spec"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    
                    {/* Left Column: Model */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">Model</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Model</span>
                          <span className="text-slate-700">Xzense-101</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Portable Devices</span>
                          <span className="text-slate-700">XXX x XX</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Weight</span>
                          <span className="text-slate-700">0.3 kg</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Minimum buying</span>
                          <span className="text-slate-700">1 device</span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="pt-8 flex items-center gap-4">
                        <span className="font-bold text-slate-900 text-lg">Quantity:</span>
                        <div className="relative">
                          <select className="appearance-none border-2 border-slate-900 rounded-md py-1.5 pl-3 pr-10 font-medium text-slate-900 bg-white focus:outline-none w-28 text-center cursor-pointer">
                            {[1, 2, 3, 4, 5, 10].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none bg-slate-900 border-l-2 border-slate-900 rounded-r-md">
                            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Specification */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">Specification</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Principle</span>
                          <span className="text-slate-700">Piezoelectric effect</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Sensor type</span>
                          <span className="text-slate-700">Piezoelectric Quartz Crystal Microbalance (QCM)</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Frequency range</span>
                          <span className="text-slate-700">1 MHz to 100 MHz</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Signal measurement</span>
                          <span className="text-slate-700">Amplitude and real-time frequency monitoring</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Holder design</span>
                          <span className="text-slate-700">Detachable holder for easy liquid media application</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900 whitespace-nowrap">Connection Interface</span>
                          <span className="text-slate-700">Pogo-pin connector</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Power supply</span>
                          <span className="text-slate-700">USB-powered</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
                          <span className="font-bold text-slate-900">Applications</span>
                          <span className="text-slate-700 leading-relaxed">Biosensing, environmental monitoring, material characterization, and more</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeTab === 'Assay Documents' && (
                <motion.div 
                  key="assay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-900">Assay Documents</h2>
                  <p className="text-slate-500 italic text-lg">
                    Manuals, protocols, and whitepapers will be available for download here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Price and Add to Cart Section */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-end justify-between">
              <div>
                <span className="block text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Price</span>
                <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all flex items-center gap-3 cursor-pointer border-none outline-none"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  );
}
