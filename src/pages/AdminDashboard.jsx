import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Activity, Download, Calendar, DollarSign, Eye, CheckCircle, Clock, XCircle, ChevronDown, Edit, Save, X, Ticket, Tag, Zap, Plus, Trash2,
    LayoutDashboard, LogOut, ShoppingCart, TrendingUp, Package, Users, Search
} from 'lucide-react';

const API_URL = 'https://renee-global.vercel.app/api';

// Product Inventory - Now fetched from database

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('renee_user'));

    const [analytics, setAnalytics] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    // SuperAdmin State
    const [adminsList, setAdminsList] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [selectedAdminName, setSelectedAdminName] = useState('');
    const [tokens, setTokens] = useState([]);
    const [isGeneratingToken, setIsGeneratingToken] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [showProductInventory, setShowProductInventory] = useState(false);
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        price: '',
        isNewArrival: false,
        stockStatus: 'in_stock'
    });

    // Coupon management state
    const [coupons, setCoupons] = useState([]);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [showCouponSection, setShowCouponSection] = useState(false);
    const [couponForm, setCouponForm] = useState({
        code: '',
        discountPercent: 5,
        applicableProducts: [],
        startDate: '',
        endDate: '',
        usageLimit: 1
    });

    // Custom Modals & Notifications
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: () => { } });
    const [notify, setNotify] = useState({ show: false, message: '', type: 'success' });

    const triggerConfirm = (title, message, callback) => {
        setConfirmModal({
            show: true,
            title,
            message,
            onConfirm: () => {
                callback();
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const triggerNotify = (message, type = 'success') => {
        setNotify({ show: true, message, type });
        setTimeout(() => setNotify(prev => ({ ...prev, show: false })), 4000);
    };

    // Promo management state
    const [promos, setPromos] = useState([]);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [showPromoSection, setShowPromoSection] = useState(false);
    const [promoForm, setPromoForm] = useState({
        title: '',
        discountPercent: 5,
        applicableProducts: [],
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            navigate('/login');
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Fetch Products (Public, failure shouldn't block admin check but usually vital)
            try {
                const productsRes = await axios.get(`${API_URL}/products`);
                console.log('Fetched products:', productsRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                // Fallback: try initialize if empty? No, dangerous.
            }

            // 2. Fetch Admin Data
            const [analyticsRes, customersRes, ordersRes] = await Promise.all([
                axios.get(`${API_URL}/admin/analytics`, config),
                axios.get(`${API_URL}/admin/customers`, config),
                axios.get(`${API_URL}/admin/orders`, config)
            ]);

            setAnalytics(analyticsRes.data);
            setCustomers(customersRes.data);
            fetchCoupons();
            setRecentOrders(ordersRes.data);

            // Fetch Admins & Tokens for SuperAdmin
            if (user.role === 'superadmin') {
                try {
                    const params = { headers: { Authorization: `Bearer ${token}` } };
                    const [adminsRes, tokensRes] = await Promise.all([
                        axios.get(`${API_URL}/admin/users`, params),
                        axios.get(`${API_URL}/admin/tokens`, params)
                    ]);
                    setAdminsList(adminsRes.data);
                    setTokens(tokensRes.data);
                } catch (e) { console.error('Failed to fetch superadmin data'); }
            }

            // Fetch Promos
            try {
                const promosRes = await axios.get(`${API_URL}/admin/promos`, config);
                setPromos(promosRes.data);
            } catch (err) {
                console.warn("Promos fetch warning:", err);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const viewCustomerOrders = async (customerEmail) => {
        try {
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/admin/customers?action=orders&email=${customerEmail}`, config);
            setCustomerOrders(response.data);
            setSelectedCustomer(customers.find(c => c.email === customerEmail));
        } catch (error) {
            console.error('Error fetching customer orders:', error);
        }
    };

    const startEditProduct = (product) => {
        setEditingProduct(product);
        setEditForm({
            price: product.price,
            isNewArrival: product.isNewArrival || false,
            stockStatus: product.stockStatus || 'in_stock'
        });
    };

    const saveProductDetails = async () => {
        if (!editingProduct) return;

        try {
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                price: parseFloat(editForm.price),
                isNewArrival: editForm.isNewArrival,
                stockStatus: editForm.stockStatus
            };

            await axios.patch(
                `${API_URL}/admin/products/${editingProduct.id}`,
                payload,
                config
            );

            // Update local state
            setProducts(products.map(p =>
                p.id === editingProduct.id ? { ...p, ...payload } : p
            ));

            setEditingProduct(null);
            triggerNotify('✅ Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            triggerNotify('❌ Failed to update product details', 'error');
        }
    };

    const downloadReport = async () => {
        try {
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endDate = now.toISOString();

            const response = await axios.get(
                `${API_URL}/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`,
                config
            );

            const data = response.data;

            // Create Excel workbook
            const wb = XLSX.utils.book_new();

            // Sheet 1: Summary
            const summaryData = [
                ['Sales Report', ''],
                ['Report Date', new Date().toLocaleDateString()],
                ['Period', `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`],
                [''],
                ['Metric', 'Value'],
                ['Total Revenue', `₦${data.totalRevenue ? data.totalRevenue.toLocaleString() : 0}`],
                ['Total Orders', data.totalOrders || 0],
                ['Completed Orders', data.completedOrders || 0],
                ['Pending Orders', data.pendingOrders || 0],
                ['Total Customers', data.totalCustomers || 0],
            ];
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            summarySheet['!cols'] = [{ wch: 20 }, { wch: 20 }];
            XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

            // Sheet 2: Orders
            if (data.orders && data.orders.length > 0) {
                const ordersData = data.orders.map(order => ({
                    'Order Number': order.orderNumber,
                    'Customer': order.customerName,
                    'Email': order.customerEmail,
                    'Total Amount': `₦${order.totalAmount.toLocaleString()}`,
                    'Status': order.status,
                    'Payment Status': order.paymentStatus,
                    'Date': new Date(order.createdAt).toLocaleDateString()
                }));
                const ordersSheet = XLSX.utils.json_to_sheet(ordersData);
                ordersSheet['!cols'] = [
                    { wch: 15 }, { wch: 20 }, { wch: 25 },
                    { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }
                ];
                XLSX.utils.book_append_sheet(wb, ordersSheet, 'Orders');
            }

            // Sheet 3: Top Customers
            if (data.topCustomers && data.topCustomers.length > 0) {
                const customersData = data.topCustomers.map(customer => ({
                    'Name': customer.name,
                    'Email': customer.email,
                    'Phone': customer.phone || 'N/A',
                    'Total Orders': customer.totalOrders,
                    'Total Spent': `₦${customer.totalSpent.toLocaleString()}`
                }));
                const customersSheet = XLSX.utils.json_to_sheet(customersData);
                customersSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 15 }];
                XLSX.utils.book_append_sheet(wb, customersSheet, 'Top Customers');
            }

            // Sheet 4: Product Performance
            if (data.productPerformance && data.productPerformance.length > 0) {
                const productsData = data.productPerformance.map(product => ({
                    'Product': product.productName,
                    'Units Sold': product.quantitySold,
                    'Revenue': `₦${product.revenue.toLocaleString()}`
                }));
                const productsSheet = XLSX.utils.json_to_sheet(productsData);
                productsSheet['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 15 }];
                XLSX.utils.book_append_sheet(wb, productsSheet, 'Products');
            }

            // Download Excel file
            const fileName = `sales-report-${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            triggerNotify('✅ Excel report downloaded successfully!');
        } catch (error) {
            console.error('Error downloading report:', error);
            triggerNotify('❌ Failed to generate report', 'error');
        }
    };

    // Coupon Management Functions
    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/admin/coupons`, config);
            setCoupons(response.data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${API_URL}/admin/coupons`, couponForm, config);

            triggerNotify('✅ Coupon created successfully!');
            setShowCouponModal(false);
            setCouponForm({
                code: '',
                discountPercent: 5,
                applicableProducts: [],
                startDate: '',
                endDate: '',
                usageLimit: 1
            });
            fetchCoupons();
        } catch (error) {
            console.error('Error creating coupon:', error);
            triggerNotify(error.response?.data?.message || '❌ Failed to create coupon', 'error');
        }
    };

    const handleDeleteCoupon = (id) => {
        triggerConfirm('Delete Coupon', 'Are you sure you want to delete this coupon? This action cannot be undone.', async () => {
            try {
                const token = localStorage.getItem('renee_token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_URL}/admin/coupons?id=${id}`, config);
                triggerNotify('✅ Coupon deleted successfully!');
                fetchCoupons();
            } catch (error) {
                console.error('Error deleting coupon:', error);
                triggerNotify('❌ Failed to delete coupon', 'error');
            }
        });
    };

    const handleToggleCoupon = async (id) => {
        try {
            const token = localStorage.getItem('renee_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.patch(`${API_URL}/admin/coupons?id=${id}&action=toggle`, {}, config);
            triggerNotify(`✅ Coupon ${res.data.isActive ? 'activated' : 'deactivated'} successfully!`);
            fetchCoupons();
        } catch (error) {
            console.error('Error toggling coupon:', error);
            triggerNotify('❌ Failed to toggle coupon status', 'error');
        }
    };

    const handleProductSelection = (productId) => {
        setCouponForm(prev => {
            const isSelected = prev.applicableProducts.includes(productId);
            return {
                ...prev,
                applicableProducts: isSelected
                    ? prev.applicableProducts.filter(id => id !== productId)
                    : [...prev.applicableProducts, productId]
            };
        });
    };

    const handleLogout = () => {
        console.log('Logging out Admin...');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    // PROMO HANDLERS
    const fetchPromos = async () => {
        try {
            const token = localStorage.getItem('renee_token');
            const res = await axios.get(`${API_URL}/admin/promos`, { headers: { Authorization: `Bearer ${token}` } });
            setPromos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createPromo = async () => {
        try {
            const token = localStorage.getItem('renee_token');
            triggerNotify('✅ Promo created successfully!');
            setShowPromoModal(false);
            setPromoForm({ title: '', discountPercent: '', applicableProducts: [], startDate: '', endDate: '' });
            fetchPromos();
        } catch (error) {
            triggerNotify(error.response?.data?.message || '❌ Error creating promo', 'error');
        }
    };

    const togglePromo = async (id) => {
        try {
            const token = localStorage.getItem('renee_token');
            await axios.patch(`${API_URL}/admin/promos?id=${id}&action=toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchPromos();
        } catch (error) {
            console.error(error);
        }
    };

    const deletePromo = (id) => {
        triggerConfirm('Delete Promo', 'Delete this promotion? This will immediately stop the discount for all customers.', async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await axios.delete(`${API_URL}/admin/promos?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
                triggerNotify('✅ Promo deleted successfully!');
                fetchPromos();
            } catch (error) {
                console.error(error);
                triggerNotify('❌ Failed to delete promo', 'error');
            }
        });
    };

    const deleteOrder = (id) => {
        triggerConfirm('Delete Order', 'Delete this order permanently? This action is irreversible.', async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await axios.delete(`${API_URL}/admin/orders?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
                triggerNotify('✅ Order deleted successfully!');
                fetchDashboardData();
            } catch (error) {
                console.error(error);
                triggerNotify('❌ Failed to delete order', 'error');
            }
        });
    };

    const deleteCustomer = (id) => {
        triggerConfirm('Delete Customer', 'Are you sure you want to delete this customer? All their associated data will be removed.', async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await axios.delete(`${API_URL}/admin/customers?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
                triggerNotify('✅ Customer deleted successfully!');
                fetchDashboardData();
            } catch (error) {
                console.error(error);
                triggerNotify('❌ Failed to delete customer', 'error');
            }
        });
    };

    // Bulk Delete Handlers
    const toggleSelectOrder = (id) => {
        setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleSelectAllOrders = () => {
        if (selectedOrders.length === recentOrders.length) setSelectedOrders([]);
        else setSelectedOrders(recentOrders.map(o => o._id));
    };
    const deleteSelectedOrders = () => {
        if (selectedOrders.length === 0) return;
        triggerConfirm('Delete Selected Orders', `Delete ${selectedOrders.length} orders permanently? This cannot be undone.`, async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await Promise.all(selectedOrders.map(id =>
                    axios.delete(`${API_URL}/admin/orders?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
                ));
                triggerNotify('✅ Selected orders deleted successfully!');
                setSelectedOrders([]);
                fetchDashboardData();
            } catch (error) {
                console.error(error);
                triggerNotify('❌ Failed to delete some orders', 'error');
            }
        });
    };

    const toggleSelectCustomer = (id) => {
        setSelectedCustomers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleSelectAllCustomers = () => {
        const visibleCustomers = customers.slice(0, 10);
        if (selectedCustomers.length === visibleCustomers.length) setSelectedCustomers([]);
        else setSelectedCustomers(visibleCustomers.map(c => c._id));
    };
    const deleteSelectedCustomers = () => {
        if (selectedCustomers.length === 0) return;
        triggerConfirm('Delete Selected Customers', `Delete ${selectedCustomers.length} customers? All their history will be erased.`, async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await Promise.all(selectedCustomers.map(id =>
                    axios.delete(`${API_URL}/admin/customers?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
                ));
                triggerNotify('✅ Selected customers deleted successfully!');
                setSelectedCustomers([]);
                fetchDashboardData();
            } catch (error) {
                console.error(error);
                triggerNotify('❌ Failed to delete customers', 'error');
            }
        });
    };





    const handleGenerateToken = async () => {
        setIsGeneratingToken(true);
        try {
            const token = localStorage.getItem('renee_token');
            await axios.post(`${API_URL}/admin/generate-token`, {}, { headers: { Authorization: `Bearer ${token}` } });
            const res = await axios.get(`${API_URL}/admin/tokens`, { headers: { Authorization: `Bearer ${token}` } });
            setTokens(res.data);
            triggerNotify('✅ Token generated successfully!');
        } catch (e) { triggerNotify('❌ Failed to generate token', 'error'); }
        finally { setIsGeneratingToken(false); }
    };

    const handleDeleteToken = (id) => {
        triggerConfirm('Delete Token', 'Remove this registration token? It will no longer be valid for new admin registration.', async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await axios.delete(`${API_URL}/admin/tokens?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
                const res = await axios.get(`${API_URL}/admin/tokens`, { headers: { Authorization: `Bearer ${token}` } });
                setTokens(res.data);
                triggerNotify('✅ Token deleted');
            } catch (e) { triggerNotify('❌ Failed to delete token', 'error'); }
        });
    };

    const handleDeleteAdmin = (admin) => {
        triggerConfirm('Delete Administrator', `Are you sure you want to delete admin "${admin.username}"? This action is permanent.`, async () => {
            try {
                const token = localStorage.getItem('renee_token');
                await axios.delete(`${API_URL}/admin/users/${admin._id}`, { headers: { Authorization: `Bearer ${token}` } });
                setAdminsList(prev => prev.filter(a => a._id !== admin._id));
                triggerNotify('✅ Administrator removed');
            } catch (e) {
                triggerNotify('❌ Failed to delete admin', 'error');
            }
        });
    };

    const handleViewActivity = async (admin) => {
        setSelectedAdminName(admin.username);
        try {
            const token = localStorage.getItem('renee_token');
            const res = await axios.get(`${API_URL}/admin/activity/${admin._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivityLogs(res.data);
            setShowActivityModal(true);
        } catch (e) {
            triggerNotify('❌ Failed to fetch activity logs', 'error');
        }
    };

    // Global Search Handler
    const handleGlobalSearch = async (query) => {
        setGlobalSearch(query);
        if (query.trim().length < 2) {
            setSearchResults(null);
            setShowSearchResults(false);
            return;
        }
        setIsSearching(true);
        setShowSearchResults(true);
        try {
            const token = localStorage.getItem('renee_token');
            const res = await axios.get(`${API_URL}/admin/search?q=${encodeURIComponent(query.trim())}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(res.data);
        } catch (e) {
            console.error('Search failed', e);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced search
    const searchTimeout = React.useRef(null);
    const onSearchChange = (e) => {
        const val = e.target.value;
        setGlobalSearch(val);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => handleGlobalSearch(val), 400);
    };

    if (!user) return null;
    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Activity size={48} color="#D4AF37" className="animate-spin" />
                    <p style={{ marginTop: '1rem', color: '#888' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const currentPeriodData = analytics?.[selectedPeriod] || { orders: 0, revenue: 0 };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F4F4F4' }}>
            <Navbar />

            {/* Header */}
            <header style={{
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                paddingTop: '8rem',
                paddingBottom: '4rem'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '16px',
                                backgroundColor: '#D4AF37',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <LayoutDashboard size={40} color="#1A1A1A" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h1 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem',
                                    color: '#FFFFFF',
                                    fontFamily: 'Outfit, sans-serif'
                                }}>
                                    Staff Portal
                                </h1>
                                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                    Welcome back, <span style={{ color: '#D4AF37', fontWeight: '700' }}>{user.fullName || user.username}</span>
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={downloadReport}
                                style={{
                                    padding: '0.8rem 2rem',
                                    backgroundColor: '#D4AF37',
                                    border: 'none',
                                    color: '#1A1A1A',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                <Download size={18} />
                                Download Report
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '0.8rem 2rem',
                                    backgroundColor: 'transparent',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    color: '#FFFFFF',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Global Search Bar */}
            <div style={{ padding: '0 5%', marginTop: '-1.5rem', position: 'relative', zIndex: 100 }}>
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    padding: '0.5rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <Search size={22} color="#9CA3AF" />
                    <input
                        type="text"
                        value={globalSearch}
                        onChange={onSearchChange}
                        placeholder="Search orders, customers by name, email, phone, order number..."
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '1.05rem',
                            padding: '1rem 0',
                            color: '#1A1A1A',
                            fontFamily: 'Outfit, sans-serif',
                            backgroundColor: 'transparent'
                        }}
                    />
                    {globalSearch && (
                        <button onClick={() => { setGlobalSearch(''); setSearchResults(null); setShowSearchResults(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0.25rem' }}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Search Results Panel */}
                {showSearchResults && (
                    <div style={{
                        position: 'absolute',
                        left: '5%', right: '5%',
                        maxWidth: '800px',
                        margin: '0.5rem auto 0',
                        backgroundColor: '#FFF',
                        borderRadius: '12px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        zIndex: 200
                    }}>
                        {isSearching ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                                <Activity size={28} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                                <p>Searching...</p>
                            </div>
                        ) : searchResults ? (
                            <div>
                                {/* Orders Results */}
                                {searchResults.orders?.length > 0 && (
                                    <div>
                                        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ShoppingCart size={18} color="#D4AF37" />
                                            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                Orders ({(searchResults.orders || []).length})
                                            </span>
                                        </div>
                                        {(searchResults.orders || []).map(order => (
                                            <div key={order._id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background 0.2s' }}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#FFFBEB'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                            <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '1.1rem', color: '#1A1A1A' }}>#{order.orderNumber}</span>
                                                            <span style={{
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '50px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '700',
                                                                backgroundColor: order.status === 'completed' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : order.status === 'processing' ? '#DBEAFE' : '#FEE2E2',
                                                                color: order.status === 'completed' ? '#047857' : order.status === 'pending' ? '#D97706' : order.status === 'processing' ? '#2563EB' : '#DC2626'
                                                            }}>
                                                                {order.status?.toUpperCase()}
                                                            </span>
                                                            <span style={{
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '50px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '700',
                                                                backgroundColor: order.paymentStatus === 'paid' ? '#D1FAE5' : order.paymentStatus === 'refunded' ? '#FEE2E2' : '#FEF3C7',
                                                                color: order.paymentStatus === 'paid' ? '#047857' : order.paymentStatus === 'refunded' ? '#DC2626' : '#D97706'
                                                            }}>
                                                                {order.paymentStatus?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: '0 0 0.35rem', color: '#1F2937', fontWeight: '600', fontSize: '1rem' }}>
                                                            {order.customerName}
                                                        </p>
                                                        <p style={{ margin: '0 0 0.35rem', color: '#6B7280', fontSize: '0.9rem' }}>
                                                            {order.customerEmail}{order.customerPhone ? ` · ${order.customerPhone}` : ''}
                                                        </p>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                            {order.items?.map((item, idx) => (
                                                                <span key={idx} style={{ padding: '0.15rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '4px', fontSize: '0.8rem', color: '#4B5563' }}>
                                                                    {item.productName} ×{item.quantity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                        <p style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1A1A1A', margin: '0 0 0.25rem' }}>
                                                            ₦{order.totalAmount?.toLocaleString()}
                                                        </p>
                                                        <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: 0 }}>
                                                            <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                                            {new Date(order.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            {' · '}
                                                            {new Date(order.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        {order.appliedCoupon?.code && (
                                                            <p style={{ color: '#D97706', fontSize: '0.8rem', margin: '0.25rem 0 0', fontWeight: '600' }}>
                                                                Coupon: {order.appliedCoupon.code} (-₦{order.appliedCoupon.discountAmount?.toLocaleString()})
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Customers Results */}
                                {searchResults.customers?.length > 0 && (
                                    <div>
                                        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={18} color="#D4AF37" />
                                            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                Customers ({(searchResults.customers || []).length})
                                            </span>
                                        </div>
                                        {(searchResults.customers || []).map(cust => (
                                            <div key={cust._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#FFFBEB'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <div>
                                                    <p style={{ fontWeight: '700', color: '#1A1A1A', margin: '0 0 0.25rem', fontSize: '1rem' }}>{cust.name}</p>
                                                    <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>
                                                        {cust.email}{cust.phone ? ` · ${cust.phone}` : ''}
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '700', color: '#1A1A1A', margin: '0 0 0.15rem' }}>{cust.totalOrders} orders</p>
                                                    <p style={{ color: '#D4AF37', fontWeight: '700', margin: 0 }}>₦{cust.totalSpent?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {searchResults.orders?.length === 0 && searchResults.customers?.length === 0 && (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                                        <Search size={36} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                                        <p style={{ fontWeight: '600', fontSize: '1.1rem', margin: '0 0 0.5rem' }}>No results found</p>
                                        <p style={{ fontSize: '0.9rem' }}>Try a different order number, customer name, email, or phone number</p>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Click-away overlay to close search results */}
            {showSearchResults && (
                <div
                    onClick={() => setShowSearchResults(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
                />
            )}

            {/* Main Content */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    {/* Period Selector */}
                    <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['weekly', 'monthly', 'yearly'].map(period => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: selectedPeriod === period ? '#D4AF37' : '#FFFFFF',
                                    color: selectedPeriod === period ? '#1A1A1A' : '#888888',
                                    border: '1px solid #E0E0E0',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                {period}
                            </button>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {/* Period Orders */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E0E0E0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#888888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    margin: 0
                                }}>
                                    {selectedPeriod} Orders
                                </p>
                                <ShoppingCart size={20} color="#D4AF37" />
                            </div>
                            <h2 style={{
                                fontSize: '3rem',
                                fontWeight: '700',
                                color: '#1A1A1A',
                                margin: '0 0 0.5rem 0',
                                fontFamily: 'Outfit, sans-serif'
                            }}>
                                {currentPeriodData.orders}
                            </h2>
                            <p style={{
                                fontSize: '0.75rem',
                                color: '#22C55E',
                                fontWeight: '700',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <TrendingUp size={14} />
                                Completed orders
                            </p>
                        </div>

                        {/* Period Revenue */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E0E0E0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#888888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    margin: 0
                                }}>
                                    {selectedPeriod} Revenue
                                </p>
                                <DollarSign size={20} color="#D4AF37" />
                            </div>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#1A1A1A',
                                margin: '0 0 0.5rem 0',
                                fontFamily: 'Outfit, sans-serif'
                            }}>
                                ₦{currentPeriodData.revenue.toLocaleString()}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0 }}>
                                From completed sales
                            </p>
                        </div>

                        {/* Active Products */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E0E0E0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#888888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    margin: 0
                                }}>
                                    Active Products
                                </p>
                                <Package size={20} color="#D4AF37" />
                            </div>
                            <h2 style={{
                                fontSize: '3rem',
                                fontWeight: '700',
                                color: '#1A1A1A',
                                margin: '0 0 0.5rem 0',
                                fontFamily: 'Outfit, sans-serif'
                            }}>
                                {products.length}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0 }}>
                                Products in catalog
                            </p>
                        </div>

                        {/* Total Customers */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E0E0E0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#888888',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    margin: 0
                                }}>
                                    Total Customers
                                </p>
                                <Users size={20} color="#D4AF37" />
                            </div>
                            <h2 style={{
                                fontSize: '3rem',
                                fontWeight: '700',
                                color: '#1A1A1A',
                                margin: '0 0 0.5rem 0',
                                fontFamily: 'Outfit, sans-serif'
                            }}>
                                {analytics?.total?.customers || 0}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0 }}>
                                Registered buyers
                            </p>
                        </div>

                        {/* Total Revenue */}
                        <div style={{
                            backgroundColor: '#1A1A1A',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#D4AF37',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    margin: 0
                                }}>
                                    All-Time Revenue
                                </p>
                                <Activity size={20} color="#D4AF37" />
                            </div>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#FFFFFF',
                                margin: '0 0 0.5rem 0',
                                fontFamily: 'Outfit, sans-serif'
                            }}>
                                ₦{(analytics?.total?.revenue || 0).toLocaleString()}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                {analytics?.total?.orders || 0} total orders
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* Recent Orders */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1A1A1A',
                                    margin: 0,
                                    fontFamily: 'Outfit, sans-serif'
                                }}>
                                    Order History
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selectedOrders.length > 0 && (
                                        <button onClick={deleteSelectedOrders} style={{ padding: '0.5rem 1rem', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>
                                            Delete ({selectedOrders.length})
                                        </button>
                                    )}
                                    <label style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={recentOrders.length > 0 && selectedOrders.length === recentOrders.length}
                                            onChange={toggleSelectAllOrders}
                                            style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }}
                                        />
                                        Select All
                                    </label>
                                </div>
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {recentOrders.length > 0 ? recentOrders.map(order => (
                                    <div key={order._id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid #E0E0E0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order._id)}
                                                    onChange={() => toggleSelectOrder(order._id)}
                                                    style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }}
                                                />
                                                <div>
                                                    <p style={{ fontWeight: '700', color: '#1A1A1A', margin: '0 0 0.25rem 0' }}>
                                                        {order.orderNumber}
                                                    </p>
                                                    <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                                                        {order.customerName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: '700', color: '#D4AF37', margin: '0 0 0.25rem 0' }}>
                                                ₦{order.totalAmount.toLocaleString()}
                                            </p>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                backgroundColor: order.status === 'completed' ? '#22C55E' :
                                                    order.status === 'processing' ? '#F59E0B' : '#888888',
                                                color: '#FFFFFF',
                                                fontWeight: '700'
                                            }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteOrder(order._id)}
                                            style={{
                                                marginLeft: '1rem',
                                                padding: '0.5rem',
                                                border: 'none',
                                                backgroundColor: '#FEE2E2',
                                                color: '#DC2626',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Delete Order"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )) : (
                                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '2rem' }}>
                                        No orders yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Top Customers */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1A1A1A',
                                    margin: 0,
                                    fontFamily: 'Outfit, sans-serif'
                                }}>
                                    Top Customers
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selectedCustomers.length > 0 && (
                                        <button onClick={deleteSelectedCustomers} style={{ padding: '0.5rem 1rem', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>
                                            Delete ({selectedCustomers.length})
                                        </button>
                                    )}
                                    <label style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={customers.length > 0 && selectedCustomers.length === (customers.slice(0, 10).length)}
                                            onChange={toggleSelectAllCustomers}
                                            style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }}
                                        />
                                        Select All
                                    </label>
                                </div>
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {customers.length > 0 ? customers.slice(0, 10).map(customer => (
                                    <div key={customer._id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid #E0E0E0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer._id)}
                                                onChange={() => toggleSelectCustomer(customer._id)}
                                                style={{ accentColor: '#D4AF37', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <p style={{ fontWeight: '700', color: '#1A1A1A', margin: '0 0 0.25rem 0' }}>
                                                    {customer.name}
                                                </p>
                                                <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                                            <p style={{ fontWeight: '700', color: '#D4AF37', margin: '0 0 0.25rem 0' }}>
                                                ₦{customer.totalSpent.toLocaleString()}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                                                {customer.totalOrders} orders
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => viewCustomerOrders(customer.email)}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#D4AF37',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                color: '#1A1A1A'
                                            }}
                                            title="View Orders"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteCustomer(customer._id)}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#FEE2E2',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                color: '#DC2626',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Delete Customer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )) : (
                                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '2rem' }}>
                                        No customers yet
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Inventory Section - Collapsible */}
                    <div style={{ marginTop: '3rem' }}>
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}>
                            {/* Toggle Header */}
                            <button
                                onClick={() => setShowProductInventory(!showProductInventory)}
                                style={{
                                    width: '100%',
                                    padding: '2rem',
                                    backgroundColor: showProductInventory ? '#1A1A1A' : '#FFFFFF',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.4s ease',
                                    borderBottom: showProductInventory ? '2px solid #D4AF37' : 'none'
                                }}
                                onMouseOver={(e) => {
                                    if (!showProductInventory) {
                                        e.currentTarget.style.backgroundColor = '#F8F8F8';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!showProductInventory) {
                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        backgroundColor: showProductInventory ? '#D4AF37' : '#F0F0F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <Package size={24} color={showProductInventory ? '#1A1A1A' : '#888888'} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: showProductInventory ? '#FFFFFF' : '#1A1A1A',
                                            margin: '0 0 0.25rem 0',
                                            fontFamily: 'Outfit, sans-serif',
                                            transition: 'color 0.3s ease'
                                        }}>
                                            Product Inventory
                                        </h3>
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: showProductInventory ? 'rgba(255,255,255,0.7)' : '#888888',
                                            margin: 0,
                                            transition: 'color 0.3s ease'
                                        }}>
                                            {showProductInventory ? 'Click to collapse' : 'Click to view all products'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: showProductInventory ? '#D4AF37' : '#F0F0F0',
                                        borderRadius: '20px',
                                        color: showProductInventory ? '#1A1A1A' : '#888888',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {products.length} Products
                                    </div>
                                    <ChevronDown
                                        size={28}
                                        color={showProductInventory ? '#D4AF37' : '#888888'}
                                        style={{
                                            transform: showProductInventory ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.4s ease'
                                        }}
                                    />
                                </div>
                            </button>

                            {/* Collapsible Content */}
                            <div style={{
                                maxHeight: showProductInventory ? '10000px' : '0',
                                opacity: showProductInventory ? 1 : 0,
                                overflow: showProductInventory ? 'visible' : 'hidden',
                                transition: 'max-height 0.8s ease, opacity 0.4s ease, padding 0.4s ease',
                                padding: showProductInventory ? '2rem 1rem' : '0 1rem'
                            }}>
                                {/* Product List */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {products.map((product, index) => (
                                        <div key={product.id} style={{
                                            padding: '1.5rem',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '12px',
                                            backgroundColor: '#FAFAFA',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#D4AF37';
                                                e.currentTarget.style.backgroundColor = '#FFFFFF';
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(212,175,55,0.2)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = '#E0E0E0';
                                                e.currentTarget.style.backgroundColor = '#FAFAFA';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}>
                                            {/* Decorative corner accent */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '60px',
                                                height: '60px',
                                                background: 'linear-gradient(135deg, transparent 50%, #D4AF37 50%)',
                                                opacity: 0.1
                                            }} />

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '0.75rem',
                                                position: 'relative',
                                                zIndex: 1
                                            }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#1A1A1A',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    boxShadow: '0 2px 8px rgba(212,175,55,0.3)'
                                                }}>
                                                    {index + 1}
                                                </div>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '12px',
                                                    backgroundColor: '#1A1A1A',
                                                    color: '#D4AF37',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {product.category}
                                                </span>
                                            </div>
                                            <h4 style={{
                                                fontSize: '1.15rem',
                                                fontWeight: '700',
                                                color: '#1A1A1A',
                                                margin: '0 0 0.35rem 0',
                                                fontFamily: 'Outfit, sans-serif'
                                            }}>
                                                {product.name}
                                            </h4>
                                            <p style={{
                                                fontSize: '0.85rem',
                                                color: '#888888',
                                                margin: '0 0 1rem 0',
                                                fontWeight: '500'
                                            }}>
                                                {product.size}
                                            </p>
                                            <div style={{
                                                paddingTop: '1rem',
                                                borderTop: '2px solid #E0E0E0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '0.75rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: '#888888',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}>
                                                    Price
                                                </span>
                                                <span style={{
                                                    fontSize: '1.4rem',
                                                    fontWeight: '700',
                                                    background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    fontFamily: 'Outfit, sans-serif'
                                                }}>
                                                    ₦{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                            {/* Edit Price Button */}
                                            <button
                                                onClick={() => startEditProduct(product)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#1A1A1A',
                                                    color: '#D4AF37',
                                                    border: '2px solid #D4AF37',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '700',
                                                    fontSize: '0.85rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                                    e.currentTarget.style.color = '#1A1A1A';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                                                    e.currentTarget.style.color = '#D4AF37';
                                                }}
                                            >
                                                <Edit size={16} />
                                                Edit Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coupon Management Section */}
                    <div style={{
                        marginTop: '2rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden'
                    }}>
                        <div
                            onClick={() => setShowCouponSection(!showCouponSection)}
                            style={{
                                padding: '1.5rem 2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderBottom: showCouponSection ? '1px solid #E0E0E0' : 'none',
                                backgroundColor: showCouponSection ? '#FAFAFA' : '#FFFFFF',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    backgroundColor: '#FFF9E6',
                                    borderRadius: '12px',
                                    color: '#D4AF37'
                                }}>
                                    <Ticket size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1A1A1A' }}>Coupon Management</h3>
                                    <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '0.9rem' }}>Create and manage discount codes</p>
                                </div>
                            </div>
                            <ChevronDown
                                size={24}
                                color="#888"
                                style={{
                                    transform: showCouponSection ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        <div style={{
                            display: showCouponSection ? 'block' : 'none',
                            padding: '2rem',
                            animation: 'fadeIn 0.3s ease-in-out'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                <button
                                    onClick={() => {
                                        fetchCoupons();
                                        setShowCouponModal(true);
                                    }}
                                    className="btn-primary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <Tag size={18} />
                                    Create New Coupon
                                </button>
                            </div>

                            {(coupons || []).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#888', backgroundColor: '#F9F9F9', borderRadius: '12px' }}>
                                    <Ticket size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>No coupons created yet. Click "Create New Coupon" to start.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                    {(coupons || []).map(coupon => (
                                        <div key={coupon._id} style={{
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            backgroundColor: coupon.isActive ? '#fff' : '#f9f9f9',
                                            opacity: coupon.isActive ? 1 : 0.7,
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div>
                                                    <div style={{
                                                        backgroundColor: '#D4AF37',
                                                        color: '#fff',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '50px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                        display: 'inline-block',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        {coupon.code}
                                                    </div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1A1A1A' }}>
                                                        {coupon.discountPercent}% OFF
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleToggleCoupon(coupon._id)}
                                                        title={coupon.isActive ? "Deactivate" : "Activate"}
                                                        style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: coupon.isActive ? '#E8F5E9' : '#FFEBEE', color: coupon.isActive ? '#2E7D32' : '#C62828' }}
                                                    >
                                                        <Activity size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                                        title="Delete"
                                                        style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: '#FFEBEE', color: '#C62828' }}
                                                    >
                                                        <LogOut size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                                <Calendar size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                                {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                                            </div>

                                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                                <Package size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                                {(coupon.applicableProducts || []).length === 0
                                                    ? 'All Products'
                                                    : (products || []).filter(p => (coupon.applicableProducts || []).includes(p.id)).map(p => `${p.name} (₦${(p.price || 0).toLocaleString()})`).join(', ') || `${(coupon.applicableProducts || []).length} Specific Product(s)`}
                                            </div>

                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                                <Users size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                                Used: {(coupon.usedBy || []).length} / {coupon.usageLimit}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Promo Management Section */}
                    <div className="promo-management-section my-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                        <div
                            onClick={() => setShowPromoSection(!showPromoSection)}
                            style={{
                                padding: '1.5rem 2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderBottom: showPromoSection ? '1px solid #E0E0E0' : 'none',
                                backgroundColor: showPromoSection ? '#FAFAFA' : '#FFFFFF',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    backgroundColor: '#FFF9E6',
                                    borderRadius: '12px',
                                    color: '#D4AF37'
                                }}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1A1A1A' }}>Promo Management (Hot Sales)</h3>
                                    <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '0.9rem' }}>Create auto-applied discounts and sales events</p>
                                </div>
                            </div>
                            <ChevronDown
                                size={24}
                                color="#888"
                                style={{
                                    transform: showPromoSection ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        {showPromoSection && (
                            <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                    <button
                                        onClick={() => setShowPromoModal(true)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.75rem 1.5rem', borderRadius: '8px',
                                            backgroundColor: '#D4AF37', color: '#1A1A1A',
                                            fontWeight: '600', border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        <Plus size={18} />
                                        Create New Promo
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {(promos || []).length === 0 ? (
                                        <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No active promotions found.</p>
                                    ) : (
                                        (promos || []).map(promo => (
                                            <div key={promo._id} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '1rem', border: '1px solid #E0E0E0', borderRadius: '8px',
                                                backgroundColor: promo.isActive ? '#FFF' : '#F9FAFB'
                                            }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{promo.title}</h4>
                                                        <span style={{
                                                            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
                                                            backgroundColor: promo.isActive ? '#E6FFFA' : '#F3F4F6',
                                                            color: promo.isActive ? '#047857' : '#6B7280'
                                                        }}>
                                                            {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#666' }}>
                                                        {promo.discountPercent}% OFF • {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                                                    </p>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#888' }}>
                                                        Products: {(promo.applicableProducts || []).length === 0 ? 'All Products' : ((products || []).filter(p => (promo.applicableProducts || []).includes(p.id)).map(p => `${p.name} (₦${(p.price || 0).toLocaleString()})`).join(', ') || `${(promo.applicableProducts || []).length} items`)}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button onClick={() => togglePromo(promo._id)} style={{ padding: '0.5rem 1rem', border: '1px solid #E0E0E0', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}>
                                                        {promo.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button onClick={() => deletePromo(promo._id)} style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Promo Modal */}
                    {
                        showPromoModal && (
                            <div style={{
                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', zIndex: 1003
                            }} onClick={() => setShowPromoModal(false)}>
                                <div style={{
                                    backgroundColor: '#FFF', borderRadius: '8px', padding: '2rem',
                                    width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
                                }} onClick={e => e.stopPropagation()}>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Promo</h3>

                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Promo Title (e.g. Flash Sale)"
                                            value={promoForm.title}
                                            onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                                            style={{ padding: '0.75rem', width: '100%', border: '1px solid #E0E0E0', borderRadius: '4px' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Discount %"
                                            value={promoForm.discountPercent}
                                            onChange={e => setPromoForm({ ...promoForm, discountPercent: Number(e.target.value) })}
                                            style={{ padding: '0.75rem', width: '100%', border: '1px solid #E0E0E0', borderRadius: '4px' }}
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Start Date</label>
                                                <input
                                                    type="date"
                                                    value={promoForm.startDate}
                                                    onChange={e => setPromoForm({ ...promoForm, startDate: e.target.value })}
                                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #E0E0E0', borderRadius: '4px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>End Date</label>
                                                <input
                                                    type="date"
                                                    value={promoForm.endDate}
                                                    onChange={e => setPromoForm({ ...promoForm, endDate: e.target.value })}
                                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #E0E0E0', borderRadius: '4px' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Product Selection */}
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Products (Optional)</label>
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: '4px', padding: '0.5rem' }}>
                                                {(products || []).map(p => (
                                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={promoForm.applicableProducts.includes(p.id)}
                                                            onChange={(e) => {
                                                                const newSelection = e.target.checked
                                                                    ? [...promoForm.applicableProducts, p.id]
                                                                    : promoForm.applicableProducts.filter(id => id !== p.id);
                                                                setPromoForm({ ...promoForm, applicableProducts: newSelection });
                                                            }}
                                                        />
                                                        <span style={{ fontSize: '0.9rem', color: '#333' }}>
                                                            {p.name} - {p.size} - <span style={{ color: '#D4AF37', fontWeight: '700' }}>₦{p.price.toLocaleString()}</span>
                                                        </span>

                                                    </div>
                                                ))}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>Leave unselected to apply to ALL products.</p>
                                        </div>

                                        <button
                                            onClick={createPromo}
                                            style={{
                                                padding: '1rem', backgroundColor: '#D4AF37', color: '#1A1A1A',
                                                border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', marginTop: '1rem'
                                            }}
                                        >
                                            Create Promo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Edit Price Modal */}
                    {
                        editingProduct && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1001,
                                padding: '2rem'
                            }} onClick={() => setEditingProduct(null)}>
                                <div style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    padding: '2.5rem',
                                    maxWidth: '500px',
                                    width: '100%',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                                }} onClick={(e) => e.stopPropagation()}>
                                    <h3 style={{
                                        marginBottom: '0.5rem',
                                        fontFamily: 'Outfit, sans-serif',
                                        fontSize: '1.75rem',
                                        color: '#1A1A1A'
                                    }}>
                                        Edit Product Details
                                    </h3>
                                    <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                        {editingProduct.name} - {editingProduct.size}
                                    </p>

                                    <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                                        {/* Price Input */}
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1A1A1A', fontSize: '0.9rem' }}>
                                                Price (₦)
                                            </label>
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                style={{
                                                    width: '100%', padding: '0.75rem', fontSize: '1.1rem', fontWeight: '700',
                                                    border: '2px solid #E0E0E0', borderRadius: '8px', outline: 'none'
                                                }}
                                                placeholder="Enter new price"
                                            />
                                        </div>

                                        {/* Stock Status */}
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1A1A1A', fontSize: '0.9rem' }}>
                                                Stock Status
                                            </label>
                                            <select
                                                value={editForm.stockStatus}
                                                onChange={(e) => setEditForm({ ...editForm, stockStatus: e.target.value })}
                                                style={{
                                                    width: '100%', padding: '0.75rem', fontSize: '1rem',
                                                    border: '2px solid #E0E0E0', borderRadius: '8px', outline: 'none', backgroundColor: '#fff'
                                                }}
                                            >
                                                <option value="in_stock">In Stock</option>
                                                <option value="low_stock">Low Stock</option>
                                                <option value="out_of_stock">Out of Stock</option>
                                            </select>
                                        </div>

                                        {/* New Arrival Toggle */}
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.isNewArrival}
                                                    onChange={(e) => setEditForm({ ...editForm, isNewArrival: e.target.checked })}
                                                    style={{ width: '20px', height: '20px', accentColor: '#D4AF37' }}
                                                />
                                                <span style={{ fontWeight: '700', color: '#1A1A1A', fontSize: '1rem' }}>Mark as New Arrival</span>
                                            </label>
                                            <p style={{ fontSize: '0.8rem', color: '#888', marginLeft: '2rem', marginTop: '0.25rem' }}>
                                                Manually tags this product as 'New'
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={saveProductDetails}
                                            style={{
                                                flex: 1, padding: '1rem', backgroundColor: '#D4AF37', color: '#1A1A1A',
                                                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700',
                                                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                            }}
                                        >
                                            <Save size={20} />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditingProduct(null)}
                                            style={{
                                                flex: 1,
                                                padding: '1rem',
                                                backgroundColor: '#F0F0F0',
                                                color: '#1A1A1A',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '700',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                                        >
                                            <X size={20} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Customer Orders Modal */}
                    {
                        selectedCustomer && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                padding: '2rem'
                            }} onClick={() => setSelectedCustomer(null)}>
                                <div style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '8px',
                                    padding: '2rem',
                                    maxWidth: '800px',
                                    width: '100%',
                                    maxHeight: '80vh',
                                    overflowY: 'auto'
                                }} onClick={(e) => e.stopPropagation()}>
                                    <h3 style={{ marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                                        Orders by {selectedCustomer.name}
                                    </h3>
                                    <p style={{ color: '#888', marginBottom: '2rem' }}>
                                        {selectedCustomer.email} • {customerOrders.length} orders
                                    </p>
                                    {customerOrders.map(order => (
                                        <div key={order._id} style={{
                                            padding: '1rem',
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '4px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong>{order.orderNumber}</strong>
                                                <span style={{ color: '#D4AF37', fontWeight: '700' }}>
                                                    ₦{order.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <div>
                                                {order.items.map((item, idx) => (
                                                    <p key={idx} style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>
                                                        • {item.productName} x{item.quantity}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setSelectedCustomer(null)}
                                        style={{
                                            padding: '0.75rem 2rem',
                                            backgroundColor: '#1A1A1A',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            marginTop: '1rem'
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {/* Create/Edit Coupon Modal */}
                    {
                        showCouponModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1002,
                                padding: '1rem',
                                backdropFilter: 'blur(5px)'
                            }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    width: '100%',
                                    maxWidth: '600px',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    position: 'relative',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <button
                                        onClick={() => setShowCouponModal(false)}
                                        style={{
                                            position: 'absolute',
                                            top: '1.5rem',
                                            right: '1.5rem',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: '50%',
                                            backgroundColor: '#F5F5F5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <X size={20} color="#666" />
                                    </button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ padding: '0.75rem', backgroundColor: '#FFF9E6', borderRadius: '12px', color: '#D4AF37' }}>
                                            <Tag size={24} />
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1A1A1A' }}>Create New Coupon</h3>
                                    </div>

                                    <form onSubmit={handleCreateCoupon}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Coupon Code</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="SUMMER25"
                                                    value={couponForm.code}
                                                    onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid #E0E0E0',
                                                        fontSize: '1rem',
                                                        textTransform: 'uppercase',
                                                        fontWeight: '700',
                                                        letterSpacing: '1px'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Discount Percentage</label>
                                                <select
                                                    value={couponForm.discountPercent}
                                                    onChange={e => setCouponForm({ ...couponForm, discountPercent: parseInt(e.target.value) })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid #E0E0E0',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#fff'
                                                    }}
                                                >
                                                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(percent => (
                                                        <option key={percent} value={percent}>{percent}%</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Start Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={couponForm.startDate}
                                                    onChange={e => setCouponForm({ ...couponForm, startDate: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid #E0E0E0',
                                                        fontSize: '0.9rem'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>End Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    min={couponForm.startDate}
                                                    value={couponForm.endDate}
                                                    onChange={e => setCouponForm({ ...couponForm, endDate: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid #E0E0E0',
                                                        fontSize: '0.9rem'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Usage Limit (Total uses)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={couponForm.usageLimit}
                                                onChange={e => setCouponForm({ ...couponForm, usageLimit: parseInt(e.target.value) })}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #E0E0E0',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Applicable Products (Select specific or leave empty for all)</label>
                                            <div style={{
                                                border: '1px solid #E0E0E0',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                backgroundColor: '#FAFAFA'
                                            }}>
                                                {products.length === 0 ? (
                                                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                                                        <p style={{ color: '#888', fontStyle: 'italic', margin: 0, marginBottom: '0.5rem' }}>No products available to select.</p>
                                                        <button
                                                            type="button"
                                                            onClick={fetchDashboardData}
                                                            style={{ fontSize: '0.8rem', color: '#D4AF37', background: 'none', border: '1px solid #D4AF37', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                                                        >
                                                            Retry Loading
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                        {(products || []).map(product => (
                                                            <label key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', backgroundColor: couponForm.applicableProducts.includes(product.id) ? '#FFF9E6' : 'transparent' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={couponForm.applicableProducts.includes(product.id)}
                                                                    onChange={() => handleProductSelection(product.id)}
                                                                    style={{ accentColor: '#D4AF37', width: '18px', height: '18px' }}
                                                                />
                                                                <span style={{ fontSize: '0.95rem', color: '#333' }}>
                                                                    {product.name} ({product.size}) - <span style={{ color: '#D4AF37', fontWeight: '700' }}>₦{product.price.toLocaleString()}</span>
                                                                </span>

                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                backgroundColor: '#1A1A1A',
                                                color: '#D4AF37',
                                                border: '2px solid #D4AF37',
                                                borderRadius: '8px',
                                                fontSize: '1.1rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = '#D4AF37';
                                                e.currentTarget.style.color = '#1A1A1A';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = '#1A1A1A';
                                                e.currentTarget.style.color = '#D4AF37';
                                            }}
                                        >
                                            <Tag size={20} />
                                            Create Coupon
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    }
                </div >
            </section >

            {/* Super Admin: Admin Management */}
            {
                user.role === 'superadmin' && (
                    <section style={{ padding: '2rem 5%' }}>
                        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif', color: '#1A1A1A' }}>
                                Admin Management
                            </h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4B5563' }}>Username</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4B5563' }}>Role</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4B5563' }}>Created At</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#4B5563' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminsList.length > 0 ? (
                                            adminsList.map((admin) => (
                                                <tr key={admin._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '1rem', color: '#1F2937', fontWeight: '500' }}>{admin.username}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: admin.role === 'superadmin' ? '#FEF3C7' : '#E0E7FF', color: admin.role === 'superadmin' ? '#D97706' : '#4F46E5' }}>
                                                            {admin.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
                                                        {new Date(admin.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => handleViewActivity(admin)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                backgroundColor: '#1A1A1A',
                                                                color: '#D4AF37',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '600',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem'
                                                            }}
                                                        >
                                                            <Activity size={16} /> Activity
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAdmin(admin)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                backgroundColor: '#FEE2E2',
                                                                color: '#DC2626',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '600',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                marginLeft: '0.5rem'
                                                            }}
                                                        >
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No other admins found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div style={{ marginTop: '2rem', backgroundColor: '#FFF', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: '#1A1A1A', margin: 0 }}>
                                    Registration Tokens
                                </h2>
                                <button
                                    onClick={handleGenerateToken}
                                    disabled={isGeneratingToken}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#D4AF37',
                                        color: '#1A1A1A',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        cursor: isGeneratingToken ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <Plus size={20} /> {isGeneratingToken ? 'Generating...' : 'Generate Token'}
                                </button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4B5563' }}>Token Code</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4B5563' }}>Status</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#4B5563' }}>Expires</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#4B5563' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokens.length > 0 ? tokens.map(token => (
                                            <tr key={token._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '1px' }}>{token.code}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: token.used ? '#FEE2E2' : '#D1FAE5', color: token.used ? '#B91C1C' : '#047857' }}>
                                                        {token.used ? 'Used' : 'Active'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', color: '#6B7280' }}>{new Date(token.expiresAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <button onClick={() => handleDeleteToken(token._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <Trash2 size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No tokens generated.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </section>
                )
            }

            {/* Activity Modal */}
            {
                showActivityModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }} onClick={() => setShowActivityModal(false)}>
                        <div style={{
                            backgroundColor: '#FFF', width: '100%', maxWidth: '700px',
                            borderRadius: '12px', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                    Activity Log: <span style={{ color: '#D4AF37' }}>{selectedAdminName}</span>
                                </h3>
                                <button onClick={() => setShowActivityModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div style={{ padding: '0', overflowY: 'auto', flex: 1 }}>
                                {(activityLogs || []).length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {activityLogs.map((log) => (
                                            <li key={log._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{ marginTop: '0.25rem', padding: '0.5rem', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706' }}>
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: '#1F2937', margin: '0 0 0.25rem 0' }}>{log.action}</p>
                                                    <p style={{ color: '#4B5563', fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>{log.details}</p>
                                                    <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>{new Date(log.timestamp).toLocaleString()}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                                        <p>No activity recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- CUSTOM CONFIRM MODAL --- */}
            {confirmModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: '#FFF', width: '90%', maxWidth: '400px',
                        borderRadius: '20px', padding: '2rem', textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)', animation: 'scaleUp 0.3s ease'
                    }}>
                        <div style={{
                            width: '64px', height: '64px', backgroundColor: '#FEF2F2',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 1.5rem', color: '#EF4444'
                        }}>
                            <XCircle size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 1rem', color: '#111827' }}>
                            {confirmModal.title}
                        </h3>
                        <p style={{ color: '#6B7280', lineHeight: '1.6', marginBottom: '2rem' }}>
                            {confirmModal.message}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                style={{
                                    flex: 1, padding: '0.9rem', borderRadius: '12px',
                                    border: '1px solid #E5E7EB', backgroundColor: '#FFF',
                                    fontWeight: '700', cursor: 'pointer', color: '#374151'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                style={{
                                    flex: 1, padding: '0.9rem', borderRadius: '12px',
                                    border: 'none', backgroundColor: '#111827',
                                    color: '#FFF', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CUSTOM NOTIFICATION --- */}
            {notify.show && (
                <div style={{
                    position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 10000, minWidth: '300px', animation: 'slideUp 0.4s ease'
                }}>
                    <div style={{
                        backgroundColor: notify.type === 'error' ? '#EF4444' : '#10B981',
                        color: '#FFF', padding: '1rem 1.5rem', borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex',
                        alignItems: 'center', gap: '1rem', fontWeight: '600'
                    }}>
                        {notify.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                        {notify.message}
                    </div>
                </div>
            )}

            <Footer
                companyName="Renee Golden Multi-ventures Limited"
                registration="RC 1506925"
                address="Okewande Street, Budo Nuhu Village, Airport Area, Kwara State, Nigeria"
                email="info@reneegoldenmultiventures.com"
                phone="+234-XXX-XXX-XXXX"
                aboutText="A diversified agricultural, industrial, and investment company committed to long-term value creation."
                quickLinks={[
                    { label: 'Marketplace', url: '/shop' },
                    { label: 'Backoffice Settings', url: '#' }
                ]}
                ctaText="Back To Marketplace"
                ctaLink="/shop"
            />
        </div >
    );
};

export default AdminDashboard;
