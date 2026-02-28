import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout, BarChart, Cpu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-8 py-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-pastel-green-500 font-bold text-xl">
                    <Cpu className="w-8 h-8" />
                    <span>SchedVis</span>
                </Link>
                <div className="flex items-center gap-8 text-gray-600 font-medium">
                    <Link to="/dashboard" className="hover:text-pastel-green-500 transition-colors flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/comparison" className="hover:text-pastel-green-500 transition-colors flex items-center gap-2">
                        <BarChart className="w-4 h-4" /> Compare
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
