import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, BarChart3, Settings2, History, ArrowRight, Layers, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import LeafyBackground from '../components/LeafyBackground';

const Dashboard = () => {
    const algorithms = [
        {
            id: 'FCFS',
            name: 'First Come First Serve',
            desc: 'Processes are served in the order of their arrival. Simple and fair.',
            color: 'card-forest',
            icon: Clock,
            grad: 'from-green-500 to-emerald-600'
        },
        {
            id: 'SJF',
            name: 'Shortest Job First',
            desc: 'Minimizes average waiting time by picking the shortest process next.',
            color: 'card-sky',
            icon: BarChart3,
            grad: 'from-blue-500 to-cyan-600'
        },
        {
            id: 'SRTF',
            name: 'Shortest Remaining Time',
            desc: 'Preemptive version of SJF. High efficiency for varying burst times.',
            color: 'card-blossom',
            icon: Settings2,
            grad: 'from-yellow-400 to-orange-500'
        },
        {
            id: 'RR',
            name: 'Round Robin',
            desc: 'Time-sharing system using a fixed time quantum. Great for responsiveness.',
            color: 'card-lavender',
            icon: History,
            grad: 'from-purple-500 to-indigo-600'
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <LeafyBackground />
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Welcome Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2 flex items-center gap-3">
                            Hello, <span className="gradient-text">Visualizer</span>
                            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                        </h1>
                        <p className="text-gray-500 font-medium">Select an algorithm to start your CPU journey.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4"
                    >
                        <Link to="/compare" className="btn-primary flex items-center gap-2 shadow-xl hover:px-8 transition-all">
                            <BarChart3 className="w-5 h-5" /> Compare All
                        </Link>
                    </motion.div>
                </header>

                {/* Algorithm Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {algorithms.map((algo, i) => (
                        <motion.div
                            key={algo.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                to={`/simulator/${algo.id}`}
                                className={`glass-card p-8 block aspect-square flex flex-col justify-between group relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-white/50 ${algo.color}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${algo.grad} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                    <Layers className="w-7 h-7 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{algo.id}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{algo.desc}</p>
                                </div>

                                <div className="flex items-center gap-2 text-pastel-green-600 font-bold text-sm transform transition-all group-hover:translate-x-2">
                                    Simulate Now <ArrowRight className="w-4 h-4" />
                                </div>

                                {/* Background design element */}
                                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${algo.grad} opacity-0 group-hover:opacity-5 transition-opacity blur-3xl`} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Required for the dynamic icon reference typo fix (imports were correct but mapping used wrong name)
import { Clock } from 'lucide-react';

export default Dashboard;
