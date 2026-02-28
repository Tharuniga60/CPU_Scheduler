import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LeafyBackground from '../components/LeafyBackground';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to login');
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
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to continue visualizing</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                        <div className="flex items-center bg-white border border-pastel-green-200 rounded-xl focus-within:ring-2 focus-within:ring-pastel-green-300 transition-all">
                            <Mail className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                            <input
                                type="email"
                                required
                                className="flex-1 bg-transparent outline-none py-3 px-3 text-gray-800 placeholder-gray-400"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Logging in...' : <><LogIn className="w-5 h-5" /> Sign In</>}
                    </button>
                </form>

                <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-pastel-green-500 font-bold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
