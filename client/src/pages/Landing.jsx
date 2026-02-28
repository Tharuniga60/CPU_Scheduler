import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Activity, BarChart3, Clock, Zap, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import LeafyBackground from '../components/LeafyBackground';

const Landing = () => {
    const features = [
        {
            icon: Clock,
            title: "Simulate Algorithms",
            text: "Visualize FCFS, SJF, SRTF, and Round Robin in real-time.",
            color: "from-green-400 to-emerald-600"
        },
        {
            icon: BarChart3,
            title: "Comparison Lab",
            text: "Benchmark multiple strategies side-by-side with accuracy.",
            color: "from-blue-400 to-cyan-600"
        },
        {
            icon: Zap,
            title: "Performance Stats",
            text: "Deep dive into Waiting Time, Turnaround Time, and efficiency.",
            color: "from-amber-400 to-orange-600"
        },
        {
            icon: ShieldCheck,
            title: "Step-by-Step",
            text: "Understand every tick of the CPU with detailed breakdowns.",
            color: "from-purple-400 to-violet-600"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <LeafyBackground />
            <Navbar />

            {/* Hero Section */}
            <header className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-pastel-green-700 font-bold text-sm tracking-wider uppercase flex items-center gap-2 mx-auto w-fit"
                >
                    <Activity className="w-4 h-4 animate-pulse" />
                    OS CPU Scheduling Visualizer
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-black mb-8 leading-tight"
                >
                    Master the <span className="gradient-text">CPU Pulse</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Experience advanced process management with a nature-inspired simulator.
                    Interactive, colorful, and built for modern OS education.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-6"
                >
                    <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg px-10 py-4 shadow-2xl hover:scale-105">
                        <Play className="w-5 h-5 fill-current" /> Get Started
                    </Link>
                    <Link to="/login" className="bg-white/60 hover:bg-white/80 backdrop-blur-md text-gray-800 font-bold px-10 py-4 rounded-2xl border border-white transition-all shadow-lg hover:shadow-xl hover:scale-105">
                        Login
                    </Link>
                </motion.div>
            </header>

            {/* Features Display */}
            <section className="pb-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card p-8 group overflow-hidden relative"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.text}</p>

                            {/* Decorative background circle */}
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`} />
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;
