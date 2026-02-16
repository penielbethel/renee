import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, User, Key, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const API_URL = 'https://renee-global.vercel.app/api';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        tokenCode: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Check if SuperAdmin username
            const superAdmins = ['pbmsrvr', 'anthony'];
            if (superAdmins.includes(formData.username.toLowerCase())) {
                const res = await axios.post(`${API_URL}/auth/super-login`, { username: formData.username.toLowerCase() }, { timeout: 5000 });
                localStorage.setItem('renee_token', res.data.token);
                localStorage.setItem('renee_user', JSON.stringify(res.data.user));
                navigate('/admin-dashboard');
            } else {
                // Regular Admin Login
                const res = await axios.post(`${API_URL}/auth/login`, {
                    username: formData.username,
                    password: formData.password
                }, { timeout: 5000 });
                localStorage.setItem('renee_token', res.data.token);
                localStorage.setItem('renee_user', JSON.stringify(res.data.user));
                navigate('/admin-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${API_URL}/auth/register-admin`, {
                username: formData.username,
                password: formData.password,
                tokenCode: formData.tokenCode
            });
            setIsRegister(false);
            setError('Registration successful! Please login.');
            setFormData({ ...formData, tokenCode: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check your token or username.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page min-h-screen bg-light">
            <Navbar />

            <section className="section" style={{ paddingTop: '8rem' }}>
                <div className="container">
                    <div className="max-w-md mx-auto">
                        <div className="glass-card p-8" style={{ background: 'white', color: 'inherit', border: '1px solid #eee' }}>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-4">
                                    <Shield size={32} />
                                </div>
                                <h1 className="h3 mb-2">{isRegister ? 'Admin Registration' : 'Corporate Access'}</h1>
                                <p className="text-sm text-gray">{isRegister ? 'Create a new administrator account using a valid token.' : 'Secure login for Renee Golden administrators and superadmins.'}</p>
                            </div>

                            {error && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 text-sm ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={isRegister ? handleRegister : handleLogin} className="modern-form">
                                <div className="form-group mb-6">
                                    <label className="text-dark font-semibold mb-2 block">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" size={18} />
                                        <input
                                            name="username"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Enter username"
                                            className="px-12 bg-light border-transparent focus:border-gold"
                                            style={{ color: 'black' }}
                                        />
                                    </div>
                                </div>

                                {/* Only show password if not potential superadmin login or if registering */}
                                {(!['pbmsrvr', 'anthony'].includes(formData.username.toLowerCase()) || isRegister) && (
                                    <div className="form-group mb-6">
                                        <label className="text-dark font-semibold mb-2 block">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" size={18} />
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter password"
                                                className="px-12 bg-light border-transparent focus:border-gold"
                                                style={{ color: 'black' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isRegister && (
                                    <div className="form-group mb-6">
                                        <label className="text-gold font-bold mb-2 block">Admin Token</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                                            <input
                                                name="tokenCode"
                                                required
                                                value={formData.tokenCode}
                                                onChange={handleChange}
                                                placeholder="Enter 8-digit token"
                                                className="px-12 bg-gold/5 border-gold/20 focus:border-gold"
                                                style={{ color: 'black' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegister ? 'Register Admin' : 'Secure Login')}
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t text-center">
                                <p className="text-sm text-gray">
                                    {isRegister ? 'Already have an account?' : 'Need to set up a new admin?'}
                                    <button
                                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                                        className="ml-2 text-gold font-bold hover:underline"
                                    >
                                        {isRegister ? 'Login Instead' : 'Register with Token'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer
                companyName="Renee Golden Multi-ventures Limited"
                registration="RC 1506925"
                address="Okewande Street, Budo Nuhu Village, Airport Area, Kwara State, Nigeria"
                email="info@reneegoldenmultiventures.com"
                phone="+234-XXX-XXX-XXXX"
                aboutText="A diversified agricultural, industrial, and investment company committed to long-term value creation."
                quickLinks={[
                    { label: 'Home', url: '/' },
                    { label: 'Shop', url: '/shop' },
                    { label: 'Login', url: '/login' }
                ]}
                ctaText="Secure Backoffice"
                ctaLink="/login"
            />
        </div>
    );
};

export default Login;
