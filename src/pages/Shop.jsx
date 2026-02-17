import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShoppingBag,
  X,
  Filter,
  Package,
  Truck,
  CreditCard,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  Tag,
  Search,
  ChevronRight,
  TrendingUp,
  Droplet,
  Coffee,
  Store,
  ArrowRight,
  Star
} from 'lucide-react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const PRODUCTS = [
  {
    id: 'kulikuli-small',
    name: 'Renee Kulikuli',
    category: 'Snacks',
    tagline: 'Traditional Groundnut Cookies',
    size: 'Small Pack',
    description: 'Crunchy, authentic groundnut cookies. Perfectly spiced for a light, healthy snack.',
    price: 500,
    image: '/images/Renee Kulikuli-S.jpg',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'kulikuli-medium',
    name: 'Renee Kulikuli',
    category: 'Snacks',
    tagline: 'Traditional Groundnut Cookies',
    size: 'Family Pack',
    description: 'Larger pack of our signature crunchy cookies, ideal for sharing with family.',
    price: 900,
    image: '/images/Renee Kulikuli-M.jpg',
    rating: 4.9,
    reviews: 86
  },
  {
    id: 'kulikuli-regular',
    name: 'Renee Kulikuli',
    category: 'Snacks',
    tagline: 'Traditional Groundnut Cookies',
    size: 'Premium Pack',
    description: 'The standard premium pack. Carefully packaged to retain that fresh, spicy crunch.',
    price: 1500,
    image: '/images/ReneeKulikuli-R.jpg',
    rating: 5.0,
    reviews: 215
  },
  {
    id: 'emi-kuli-oil',
    name: 'Renee Oils',
    category: 'Oils',
    tagline: '100% Pure Groundnut Oil',
    size: '1 Litre Bottle',
    description: 'Cholesterol-free, cold-pressed groundnut oil. Perfectly clear and heart-healthy.',
    price: 3500,
    image: '/images/Renee Oil1.jpg',
    rating: 4.9,
    reviews: 98
  },
  {
    id: 'tigernut-drink',
    name: 'Renee Tigernut',
    category: 'Drinks',
    tagline: 'Natural Energy Boost',
    size: '500ml Bottle',
    description: 'Creamy, refreshing tigernut drink. Rich in fiber and natural nutrients.',
    price: 2000,
    image: '/images/Renee Tigernut.jpg',
    rating: 4.7,
    reviews: 142
  },
  {
    id: 'rice',
    name: 'Renee Rice',
    category: 'Staples',
    tagline: 'Premium Parboiled Rice',
    size: '5kg Bag',
    description: 'Stone-free, long-grain parboiled rice. Polished and ready for your delicious meals.',
    price: 8000,
    image: '/images/renee Rice.jpg',
    rating: 5.0,
    reviews: 310
  },
  {
    id: 'honey',
    name: 'Renee Honey',
    category: 'Sweeteners',
    tagline: '100% Raw Wild Honey',
    size: '500g Bottle',
    description: 'Directly from the hive. Unadulterated raw honey with all its natural goodness.',
    price: 3000,
    image: '/images/Renee Honey.jpg',
    rating: 4.9,
    reviews: 167
  },
];

const CURRENCY = '₦';
const API_URL = 'https://renee-global.vercel.app/api';

const PromoBanner = ({ promos }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!promos || promos.length === 0) return;

    // Find earliest END date for urgency
    const endDates = promos.map(p => new Date(p.endDate).getTime());
    const targetDate = Math.min(...endDates);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft("Few moments");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [promos]);

  if (!promos || promos.length === 0) return null;

  // Highest discount
  const maxDiscount = Math.max(...promos.map(p => p.discountPercent));

  return (
    <div className="promo-banner-container" style={{
      background: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 50%, #B91C1C 100%)',
      color: '#FFFFFF',
      padding: '12px 20px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
      marginBottom: '2rem',
      borderRadius: '8px',
      animation: 'pulse 2s infinite'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.2rem' }}>🔥</span>
        <span style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>HOT SALE IS LIVE!</span>
        <span style={{ background: '#FFF', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>UP TO {maxDiscount}% OFF</span>
        <span style={{ fontWeight: '600', opacity: 0.9 }}>Ends in: <span style={{ fontFamily: 'monospace', fontSize: '1.1em' }}>{timeLeft}</span></span>
      </div>
    </div>
  );
};

/* Product Details Modal Component */
const ProductDetailsModal = ({ product, similarProducts, onClose, onAddToCart, onProductClick }) => {
  if (!product) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#FFF', width: '100%', maxWidth: '900px',
        borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }} onClick={e => e.stopPropagation()}>

        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#f3f4f6' }}>
            <X size={24} color="#374151" />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            {/* Image */}
            <div>
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
            </div>

            {/* Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#1A1A1A', color: '#D4AF37', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  {product.category}
                </span>
                {product.isNewArrival && (
                  <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#10B981', color: '#FFF', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    New Arrival
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '0.5rem', color: '#111827' }}>
                {product.name}
              </h2>
              <p style={{ fontSize: '1.25rem', color: '#6B7280', marginBottom: '2rem' }}>
                {product.tagline}
              </p>

              <div style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#4B5563', marginBottom: '2rem' }}>
                {product.description}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#D4AF37' }}>
                  ₦{product.price.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.1rem', color: '#6B7280' }}>
                  / {product.size}
                </span>
              </div>

              <button
                onClick={() => { onAddToCart(product); onClose(); }}
                style={{
                  width: '100%', padding: '1rem 2rem', backgroundColor: '#D4AF37', color: '#1A1A1A',
                  border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                <Plus size={24} /> Add to Basket
              </button>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div style={{ borderTop: '1px solid #eee', paddingTop: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>
                You Might Also Like
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {similarProducts.map(p => (
                  <div key={p.id}
                    onClick={() => onProductClick(p)}
                    style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: '150px', overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontWeight: '700', marginBottom: '0.25rem', color: '#111827' }}>{p.name}</h4>
                      <p style={{ color: '#D4AF37', fontWeight: '700' }}>₦{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('renee_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState([]);
  const [activePromos, setActivePromos] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch products and active promos
  useEffect(() => {
    document.title = "Shop | Renee Golden - Premium Natural Honey, Kuli-Kuli & Agricultural Products";
    const fetchData = async () => {
      try {
        const [prodRes, promoRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/promos/active`)
        ]);
        setProducts(prodRes.data);
        setActivePromos(promoRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('renee_cart', JSON.stringify(cart));
  }, [cart]);

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    paymentMethod: 'transfer',
  });
  const [orderStatus, setOrderStatus] = useState(null); // 'success', 'error', null
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
  const [viewingProduct, setViewingProduct] = useState(null);
  const [pendingOrderId, setPendingOrderId] = useState(null);



  const filteredProducts = useMemo(() => {
    const results = products.filter((product) => {
      const matchesFilter = filter === 'All' ||
        (filter === 'Kulikuli' ? product.id.startsWith('kulikuli-') : product.category === filter);
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    // Sort by New Arrival (true comes first)
    return results.sort((a, b) => {
      if (a.isNewArrival && !b.isNewArrival) return -1;
      if (!a.isNewArrival && b.isNewArrival) return 1;
      return 0; // Maintain original order otherwise
    });
  }, [filter, searchQuery, products]);

  const getProductPrice = (product) => {
    const applicable = activePromos.filter(p =>
      p.applicableProducts.length === 0 || p.applicableProducts.includes(product.id)
    );

    if (applicable.length === 0) return { original: product.price, current: product.price, isPromo: false };

    // Sort by best discount
    applicable.sort((a, b) => b.discountPercent - a.discountPercent);
    const bestPromo = applicable[0];
    const discount = (product.price * bestPromo.discountPercent) / 100;

    return {
      original: product.price,
      current: product.price - discount,
      discountPercent: bestPromo.discountPercent,
      isPromo: true
    };
  };

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = cart.length > 0 ? 1500 : 0;

    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.applicableProducts.length > 0) {
        // Discount only on specific products
        const discountableAmount = cart.reduce((sum, item) => {
          if (activeCoupon.applicableProducts.includes(item.id)) {
            return sum + (item.price * item.quantity);
          }
          return sum;
        }, 0);
        discount = (discountableAmount * activeCoupon.discountPercent) / 100;
      } else {
        // Discount on entire subtotal
        discount = (subtotal * activeCoupon.discountPercent) / 100;
      }
    }

    const total = Math.max(0, subtotal + delivery - discount);
    return { subtotal, delivery, discount, total };
  }, [cart, activeCoupon]);

  const flutterwaveConfig = useMemo(() => ({
    public_key: 'FLWPUBK_TEST-1f887ca9f241fd06e18bb705c9ae73c9-X',
    tx_ref: pendingOrderId || `temp-ref`,
    amount: cartTotals.total,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: checkoutForm.email,
      phone_number: checkoutForm.phone,
      name: checkoutForm.fullName,
    },
    customizations: {
      title: 'Renee Shop',
      description: `Payment for ${cart.length} items`,
      logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
    },
  }), [pendingOrderId, cartTotals, checkoutForm, cart.length]);

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

  useEffect(() => {
    if (pendingOrderId) {
      handleFlutterwavePayment({
        callback: (response) => {
          closePaymentModal();
          if (response.status === "successful") {
            // Verify
            axios.post(`${API_URL}/payment/verify`, {
              transaction_id: response.transaction_id,
              order_id: pendingOrderId
            })
              .then(res => {
                if (res.data.status === 'success') {
                  setOrderStatus('success');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  clearCart();
                  setTimeout(() => {
                    setOrderStatus(null);
                    setPendingOrderId(null);
                    setCheckoutForm({ fullName: '', email: '', phone: '', address: '', state: '', paymentMethod: 'transfer' });
                  }, 5000);
                } else {
                  alert('Payment verification failed. Please contact support.');
                }
              })
              .catch(err => {
                console.error(err);
                alert('Error verifying payment.');
              });
          }
        },
        onClose: () => {
          setPendingOrderId(null);
        },
      });
    }
  }, [pendingOrderId, handleFlutterwavePayment]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    setCouponCode('');
    setCouponMessage({ type: '', text: '' });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponMessage({ type: 'loading', text: 'Verifying...' });

    try {
      const response = await axios.post(`${API_URL}/coupons/validate`, {
        code: couponCode,
        email: checkoutForm.email,
        productIds: cart.map(item => item.id)
      });

      const { valid, discountPercent, applicableProducts, message } = response.data;

      if (valid) {
        setActiveCoupon({ code: couponCode, discountPercent, applicableProducts });
        setCouponMessage({ type: 'success', text: message });
      } else {
        setActiveCoupon(null);
        setCouponMessage({ type: 'error', text: message });
      }
    } catch (error) {
      console.error('Coupon error:', error);
      setActiveCoupon(null);
      setCouponMessage({ type: 'error', text: error.response?.data?.message || 'Invalid coupon' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Please add at least one product to your cart.');
      return;
    }
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address || !checkoutForm.email) {
      alert('Please fill in your shipping details including email.');
      return;
    }

    try {
      const orderNumber = `RENEE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const orderData = {
        orderNumber,
        customerName: checkoutForm.fullName,
        customerEmail: checkoutForm.email,
        customerPhone: checkoutForm.phone,
        items: cart.map(item => ({
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotals.total,
        couponCode: activeCoupon ? activeCoupon.code : undefined,
        discountAmount: activeCoupon ? cartTotals.discount : 0,
        status: 'pending',
        paymentStatus: 'unpaid'
      };

      await axios.post(`${API_URL}/orders`, orderData);

      // Order Created. Open Flutterwave.
      setPendingOrderId(orderNumber);

    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <div className="shop-page">
      <Navbar />

      {/* Stunning Shop Hero */}
      <section className="shop-hero">
        <div className="shop-hero-bg"></div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center py-12">
            <div className="shop-pill animate-fade-in flex items-center gap-2 mb-4">
              <ShoppingBag size={14} className="text-gold" />
              <span>Premium Food Hub • Quality Guaranteed</span>
            </div>
            <h1 className="shop-title animate-fade-in-up">The Renee Marketplace</h1>
            <p className="shop-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Bring the best of the farm directly to your kitchen.
              Authentic, professionally processed, and delivered to your doorstep.
            </p>

            <div className="shop-search-bar animate-fade-in-up mt-8" style={{ animationDelay: '0.2s' }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products (Kulikuli, Honey, Rice...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light-gray-alt">
        <div className="container">

          {orderStatus === 'success' && (
            <div className="order-success-banner animate-fade-in mb-8">
              <div className="flex items-center gap-4">
                <div className="success-icon">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3>Order Received Successfully!</h3>
                  <p>Thank you for shopping with Renee. An agent will contact you shortly at {checkoutForm.phone} with payment instructions.</p>
                </div>
              </div>
            </div>
          )}

          <div className="shop-layout">
            {/* Main Shop Area */}
            <main className="shop-main">

              {/* Promo Banner */}
              <PromoBanner promos={activePromos} />

              {/* Category Filter Pills */}
              <div className="shop-filters-container flex items-center gap-4 mb-8 overflow-x-auto pb-4">
                <div className="flex items-center gap-2 text-dark font-semibold mr-4">
                  <Filter size={18} />
                  <span>Filter:</span>
                </div>
                {[
                  { id: 'All', label: 'All Items', icon: <Package size={16} /> },
                  { id: 'Kulikuli', label: 'Kulikuli', icon: <TrendingUp size={16} /> },
                  { id: 'Oils', label: 'Pure Oils', icon: <Droplet size={16} /> },
                  { id: 'Drinks', label: 'Beverages', icon: <Coffee size={16} /> },
                  { id: 'Staples', label: 'Staples', icon: <Store size={16} /> },
                  { id: 'Sweeteners', label: 'Natural Honey', icon: <Star size={16} /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`filter-pill ${filter === item.id ? 'active' : ''}`}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Shop Highlights / Features */}
              <div className="shop-features grid grid-cols-3 gap-4 mb-12">
                <div className="shop-feature-card">
                  <div className="f-icon-box"><Truck size={24} /></div>
                  <div>
                    <h4>Fast Delivery</h4>
                    <p>Lagos & Nationwide</p>
                  </div>
                </div>
                <div className="shop-feature-card">
                  <div className="f-icon-box"><CreditCard size={24} /></div>
                  <div>
                    <h4>Easy Payment</h4>
                    <p>Transfer or Pay on Delivery</p>
                  </div>
                </div>
                <div className="shop-feature-card">
                  <div className="f-icon-box"><CheckCircle size={24} /></div>
                  <div>
                    <h4>100% Organic</h4>
                    <p>No artificial additives</p>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="shop-grid">
                {isLoadingProducts ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '4rem 0',
                    color: '#D4AF37',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    Loading products...
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const { original, current, isPromo, discountPercent } = getProductPrice(product);

                    // New Arrival Logic: Manual Flag Only
                    const isNew = product.isNewArrival;
                    const isOutOfStock = product.stockStatus === 'out_of_stock';
                    const isLowStock = product.stockStatus === 'low_stock';

                    return (
                      <div key={product.id} className="modern-product-card animate-fade-in-up" style={{ opacity: isOutOfStock ? 0.8 : 1 }}>
                        <div className="product-image-wrapper" style={{ position: 'relative' }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ filter: isOutOfStock ? 'grayscale(100%)' : 'none', transition: 'filter 0.3s ease', cursor: 'pointer' }}
                            onClick={() => setViewingProduct(product)}
                          />

                          {/* Badges (Top Left) */}
                          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
                            <div className="product-badge" style={{ position: 'static', marginBottom: 0 }}>{product.category}</div>
                            {isNew && !isOutOfStock && (
                              <div style={{
                                backgroundColor: '#10B981', color: '#FFF',
                                padding: '4px 8px', borderRadius: '4px',
                                fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'
                              }}>
                                New
                              </div>
                            )}
                            {isLowStock && !isOutOfStock && (
                              <div style={{
                                backgroundColor: '#F59E0B', color: '#FFF',
                                padding: '4px 8px', borderRadius: '4px',
                                fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'
                              }}>
                                Low Stock
                              </div>
                            )}
                          </div>

                          {/* Promo Badge (Top Right) */}
                          {isPromo && !isOutOfStock && (
                            <div style={{
                              position: 'absolute', top: '10px', right: '10px',
                              backgroundColor: '#DC2626', color: '#FFF',
                              padding: '4px 8px', borderRadius: '4px',
                              fontSize: '12px', fontWeight: '800', zIndex: 10,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                              -{discountPercent}%
                            </div>
                          )}

                          {/* Out of Stock Overlay */}
                          {isOutOfStock && (
                            <div style={{
                              position: 'absolute', inset: 0,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              backdropFilter: 'grayscale(1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              zIndex: 20
                            }}>
                              <span style={{
                                backgroundColor: '#1A1A1A', color: '#FFF',
                                padding: '0.6rem 1.2rem', borderRadius: '4px',
                                fontWeight: '800', textTransform: 'uppercase',
                                letterSpacing: '1.5px', fontSize: '0.9rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                              }}>
                                Sold Out
                              </span>
                            </div>
                          )}

                          <button
                            className="quick-add-btn"
                            disabled={isOutOfStock}
                            onClick={() => !isOutOfStock && addToCart({ ...product, price: current })}
                            style={{
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              opacity: isOutOfStock ? 0 : 1,
                              visibility: isOutOfStock ? 'hidden' : 'visible'
                            }}
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="product-info-wrapper">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="product-name">{product.name}</h3>
                              <p className="product-tagline">{product.tagline}</p>
                            </div>
                            <div className="product-rating flex items-center gap-1">
                              <Star size={12} className="fill-gold text-gold" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          <p className="product-desc">{product.description}</p>
                          <div className="product-meta flex items-center justify-between mt-4">
                            <div className="product-price-box">
                              {isPromo && !isOutOfStock ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.9rem' }}>
                                    {CURRENCY}{original.toLocaleString()}
                                  </span>
                                  <span style={{ color: '#D4AF37', fontWeight: '800', fontSize: '1.2rem' }}>
                                    {CURRENCY}{current.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="currency">{CURRENCY}</span>
                                  <span className="amount">{current.toLocaleString()}</span>
                                  <span className="size">/ {product.size}</span>
                                </div>
                              )}
                            </div>
                            <button
                              className="shop-cart-btn"
                              disabled={isOutOfStock}
                              onClick={() => !isOutOfStock && addToCart({ ...product, price: current })}
                              style={{
                                backgroundColor: isOutOfStock ? '#E5E7EB' : undefined,
                                color: isOutOfStock ? '#9CA3AF' : undefined,
                                borderColor: isOutOfStock ? '#E5E7EB' : undefined,
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {isOutOfStock ? 'Sold Out' : 'Add'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-results py-20 text-center">
                    <Search size={48} className="mx-auto mb-4 text-gray opacity-30" />
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </main>

            {/* Sidebar / Cart and Checkout */}
            <aside className="shop-sidebar">
              {/* Cart Summary Card */}
              <div className="glass-card cart-sidebar-card mb-6">
                <div className="card-header flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2">
                    <ShoppingBag size={20} className="text-gold" />
                    Your Basket
                  </h2>
                  <span className="cart-count">{cart.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                </div>

                {cart.length === 0 ? (
                  <div className="empty-cart text-center py-10">
                    <Package size={40} className="mx-auto mb-4 text-gray opacity-20" />
                    <p>Your basket is empty. Start shopping!</p>
                  </div>
                ) : (
                  <div className="cart-content">
                    <div className="cart-item-list max-h-[400px] overflow-y-auto mb-6 pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item-modern flex items-center gap-4 mb-4">
                          <div className="cart-item-img">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm m-0 leading-tight">{item.name}</h4>
                            <p className="text-white/60 text-xs mt-1 m-0">{item.size} • {CURRENCY}{item.price.toLocaleString()}</p>
                          </div>
                          <div className="cart-item-qty flex items-center gap-2 bg-white/5 rounded px-2 py-1 border border-white/10">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/70 hover:text-white transition-colors"><Minus size={12} /></button>
                            <span className="text-white text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/70 hover:text-white transition-colors"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 transition-colors p-1"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>

                    <div className="cart-totals-area pt-4 border-t border-white/20">
                      <div className="totals-row flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span className="font-semibold">{CURRENCY}{cartTotals.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="totals-row flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>Delivery Fee</span>
                          <div className="tooltip-icon"><Truck size={12} /></div>
                        </div>
                        <span>{CURRENCY}{cartTotals.delivery.toLocaleString()}</span>
                      </div>

                      {/* Coupon Section */}
                      <div className="my-4 pt-2 border-t border-dashed border-white/20">
                        {!activeCoupon ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Have a coupon? Enter code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-gold"
                              />
                              <button
                                onClick={handleApplyCoupon}
                                disabled={!couponCode || couponMessage.type === 'loading'}
                                className="bg-gold text-black px-4 py-2 rounded text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                              >
                                {couponMessage.type === 'loading' ? '...' : 'Apply'}
                              </button>
                            </div>
                            {couponMessage.type === 'error' && (
                              <div className="text-red-400 text-xs bg-red-900/20 border border-red-500/30 p-2 rounded text-center">
                                {couponMessage.text}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gold/10 border border-gold/30 rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Tag size={16} className="text-gold" />
                              <div>
                                <span className="block text-gold font-semibold text-xs uppercase tracking-wider">Coupon Applied</span>
                                <span className="text-xs text-white/90">
                                  Code <strong>{activeCoupon.code}</strong> • {activeCoupon.discountPercent}% OFF
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setActiveCoupon(null);
                                setCouponCode('');
                                setCouponMessage({ type: '', text: '' });
                              }}
                              className="text-white/40 hover:text-white transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      {activeCoupon && (
                        <div className="totals-row flex justify-between mb-2 text-gold">
                          <span>Discount ({activeCoupon.discountPercent}%)</span>
                          <span>- {CURRENCY}{cartTotals.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="totals-row flex justify-between items-center mt-4 pt-4 border-t border-white/30 text-lg font-bold">
                        <span>Grand Total</span>
                        <span className="text-gold">{CURRENCY}{cartTotals.total.toLocaleString()}</span>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button className="btn btn-clear flex-1" onClick={clearCart}>Restart</button>
                        {/* The checkout trigger is the form below */}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure Checkout Card */}
              <div className="glass-card checkout-sidebar-card">
                <div className="card-header mb-6">
                  <h2 className="flex items-center gap-2">
                    <CreditCard size={20} className="text-gold" />
                    Secure Checkout
                  </h2>
                  <p className="text-xs text-white/60">Fill details to place your order</p>
                </div>

                <form onSubmit={handlePlaceOrder} className="modern-form">
                  <div className="form-group">
                    <label>Receiver's Name</label>
                    <input
                      name="fullName"
                      required
                      value={checkoutForm.fullName}
                      onChange={handleFormChange}
                      placeholder="Yinka Michael"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={checkoutForm.email}
                      onChange={handleFormChange}
                      placeholder="anthony@renee-global.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      name="phone"
                      required
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={handleFormChange}
                      placeholder="+234..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea
                      name="address"
                      required
                      value={checkoutForm.address}
                      onChange={handleFormChange}
                      placeholder="Flat, Street, Area, LGA..."
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group mb-6">
                    <label>State</label>
                    <select
                      name="state"
                      value={checkoutForm.state}
                      onChange={handleFormChange}
                    >
                      <option value="">Select State</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Ogun">Ogun</option>
                      <option value="Kwara">Kwara</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <button type="submit" className="place-order-btn flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gold text-black font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" disabled={cart.length === 0}>
                    Place Your Order
                    <ArrowRight size={18} />
                  </button>

                  <div className="security-footer flex items-center justify-center gap-4 mt-6 text-[10px] uppercase tracking-tighter text-white/40">
                    <span className="flex items-center gap-1"><CheckCircle size={10} /> Secure SSL</span>
                    <span className="flex items-center gap-1"><CheckCircle size={10} /> Data Encrypted</span>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="section bg-white border-t border-gray-100">
        <div className="container">
          <div className="grid grid-cols-4 gap-8">
            <div className="trust-item flex flex-col items-center text-center">
              <div className="trust-icon"><CheckCircle /></div>
              <h5>Quality Assured</h5>
              <p className="text-xs">Every product is tested</p>
            </div>
            <div className="trust-item flex flex-col items-center text-center">
              <div className="trust-icon"><Truck /></div>
              <h5>Swift Logistics</h5>
              <p className="text-xs">Tracked delivery service</p>
            </div>
            <div className="trust-item flex flex-col items-center text-center">
              <div className="trust-icon"><Package /></div>
              <h5>Safe Packaging</h5>
              <p className="text-xs">Hygienically sealed</p>
            </div>
            <div className="trust-item flex flex-col items-center text-center">
              <div className="trust-icon"><TrendingUp /></div>
              <h5>Farmer Support</h5>
              <p className="text-xs">Direct from local farms</p>
            </div>
          </div>
        </div>
      </section>

      <Footer
        companyName="Renee Golden Multi-ventures Limited"
        registration="RC 1506925"
        address="Okewande Street, Budo Nuhu Village, Airport Area, Asa L.G.A., Kwara State"
        email="info@reneegoldenmultiventures.com"
        phone="+234-XXX-XXX-XXXX"
        aboutText="A diversified agricultural, industrial, and investment company committed to long-term value creation."
        quickLinks={[
          { label: 'Home', url: '/' },
          { label: 'Shop', url: '/shop' },
          { label: 'Investments', url: '/investments' },
          { label: 'Partners', url: '/partners' },
          { label: 'Contact', url: '/contact' },
          { label: 'Privacy Policy', url: '/privacy' },
          { label: 'Terms', url: '/terms' },
        ]}
        ctaText="Partner With Us"
        ctaLink="/contact"
      />
      {/* Product Details Modal */}
      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          similarProducts={products.filter(p =>
            p.category === viewingProduct.category &&
            p.id !== viewingProduct.id
          ).slice(0, 3)}
          onClose={() => setViewingProduct(null)}
          onAddToCart={addToCart}
          onProductClick={setViewingProduct}
        />
      )}
      {/* Floating Cart Bubble */}
      <a
        href="#cart-section"
        className={`floating-cart-bubble ${cart.length > 0 ? 'has-items' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          const target = document.querySelector('.shop-sidebar');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        style={{ textDecoration: 'none' }}
      >
        <ShoppingBag size={28} />
        {cart.length > 0 && (
          <span className="item-count">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </a>
    </div>
  );
};

export default Shop;
