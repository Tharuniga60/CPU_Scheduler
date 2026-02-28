import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LeafyBackground from '../components/LeafyBackground';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <LeafyBackground />
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-pastel-green-600 font-semibold hover:text-pastel-green-700 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back Home
            </Link>

            <motion.div
                className="glass-card max-w-md w-full p-10 shadow-2xl space-y-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join our scheduling community</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                        <div className="flex items-center bg-white border border-pastel-green-200 rounded-xl focus-within:ring-2 focus-within:ring-pastel-green-300 transition-all">
                            <User className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                            <input
                                type="text"
                                required
                                className="flex-1 bg-transparent outline-none py-3 px-3 text-gray-800 placeholder-gray-400"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                        <div className="flex items-center bg-white border border-pastel-green-200 rounded-xl focus-within:ring-2 focus-within:ring-pastel-green-300 transition-all">
                            <Mail className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                            <input
                                type="email"
                                required
                                className="flex-1 bg-transparent outline-none py-3 px-3 text-gray-800 placeholder-gray-400"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                        <div className="flex items-center bg-white border border-pastel-green-200 rounded-xl focus-within:ring-2 focus-within:ring-pastel-green-300 transition-all">
                            <Lock className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                            <input
                                type="password"
                                required
                                className="flex-1 bg-transparent outline-none py-3 px-3 text-gray-800 placeholder-gray-400"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Creating account...' : <><UserPlus className="w-5 h-5" /> Sign Up</>}
                    </button>
                </form>

                <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-pastel-green-500 font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
