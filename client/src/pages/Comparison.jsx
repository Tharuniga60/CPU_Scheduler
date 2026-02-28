import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play, RotateCcw, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import LeafyBackground from '../components/LeafyBackground';

const Comparison = () => {
    const [processes, setProcesses] = useState([
        { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 },
        { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3 },
    ]);
    const [quantum, setQuantum] = useState(2);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const addProcess = () => {
        const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
        setProcesses([...processes, { id: newId, name: `P${newId}`, arrivalTime: 0, burstTime: 1 }]);
    };

    const removeProcess = (id) => {
        if (processes.length > 1) {
            setProcesses(processes.filter(p => p.id !== id));
        }
    };

    const handleChange = (id, field, value) => {
        setProcesses(processes.map(p => p.id === id ? { ...p, [field]: parseInt(value) || 0 } : p));
    };

    const handleCompare = async () => {
        setLoading(true);
        try {
            const res = await api.post('/scheduling/compare', {
                processes,
                quantum
            });
            setStats(res.data.stats);
        } catch (err) {
            alert('Comparison failed.');
        } finally {
            setLoading(false);
        }
    };

    const getBest = () => {
        if (!stats) return null;
        return [...stats].sort((a, b) => a.avgWT - b.avgWT)[0];
    };

    const bestAlgo = getBest();

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 relative">
            <LeafyBackground />
            <Navbar />

            <div className="max-w-7xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-800">Algorithm <span className="text-pastel-green-500">Comparison</span></h1>
                    <p className="text-gray-600">Analyze performance across all 4 scheduling methods simultaneously.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-6 space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">Test Data</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Time Quantum (for RR)</label>
                                <input
                                    type="number"
                                    className="input-field w-full py-2"
                                    value={quantum}
                                    onChange={(e) => setQuantum(e.target.value)}
                                />
                            </div>
                            {/* Column Headers */}
                            <div className="grid grid-cols-12 gap-2 items-center px-1">
                                <div className="col-span-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Process</div>
                                <div className="col-span-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Arrival</div>
                                <div className="col-span-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Burst</div>
                                <div className="col-span-2"></div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                {processes.map((p) => (
                                    <div key={p.id} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-2 font-bold text-gray-400">{p.name}</div>
                                        <input className="col-span-4 input-field py-1 px-2 text-sm" value={p.arrivalTime} onChange={e => handleChange(p.id, 'arrivalTime', e.target.value)} />
                                        <input className="col-span-4 input-field py-1 px-2 text-sm" value={p.burstTime} onChange={e => handleChange(p.id, 'burstTime', e.target.value)} />
                                        <button onClick={() => removeProcess(p.id)} className="col-span-2 text-red-300"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addProcess}
                                className="w-full border-2 border-dashed border-pastel-green-200 py-2 rounded-xl text-pastel-green-500 font-bold hover:bg-pastel-green-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Process
                            </button>
                            <button onClick={handleCompare} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" /> {loading ? 'Analyzing...' : 'Run Benchmarks'}
                            </button>
                        </div>

                        {bestAlgo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-6 bg-gradient-to-tr from-pastel-green-500 to-pastel-green-400 text-white"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-6 h-6" />
                                    <h3 className="text-xl font-bold">Efficiency Analysis</h3>
                                </div>
                                <p className="text-sm opacity-90 leading-relaxed mb-4">
                                    Based on your data, <span className="font-black underline">{bestAlgo.name}</span> delivers the best performance with an average waiting time of only {bestAlgo.avgWT.toFixed(2)}ms.
                                </p>
                                <div className="bg-white/20 p-3 rounded-lg text-xs font-medium">
                                    <strong>Analysis:</strong> Preemptive algorithms generally perform better when there is high variance in burst times.
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Results Comparison */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {stats ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="glass-card overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-pastel-green-50 text-pastel-green-700 font-bold">
                                                <tr>
                                                    <th className="px-8 py-6">Algorithm</th>
                                                    <th className="px-8 py-6">Avg Waiting Time</th>
                                                    <th className="px-8 py-6">Avg Turnaround Time</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {stats.map((s, i) => (
                                                    <tr key={i} className={`hover:bg-pastel-green-50/30 transition-colors ${bestAlgo?.name === s.name ? 'bg-pastel-green-100/20' : ''}`}>
                                                        <td className="px-8 py-6 font-bold flex items-center gap-2">
                                                            {s.name}
                                                            {bestAlgo?.name === s.name && <TrendingUp className="w-4 h-4 text-pastel-green-500" />}
                                                        </td>
                                                        <td className="px-8 py-6 text-gray-700">{s.avgWT.toFixed(2)}</td>
                                                        <td className="px-8 py-6 text-gray-700">{s.avgTAT.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-card p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-pastel-green-600 font-bold">
                                                <HelpCircle className="w-5 h-5" />
                                                Theoretical Insight
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                <strong>RR</strong> is ideal for time-sharing systems where responsiveness is key.
                                                <strong>SRTF</strong> is theoretically optimal for minimum average waiting time but requires prior knowledge of burst times.
                                            </p>
                                        </div>
                                        <div className="glass-card p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-pastel-green-600 font-bold">
                                                <BarChart3 className="w-5 h-5" />
                                                Performance Tip
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                If Average WT is the primary metric, look for algorithms that minimize the presence of long bursts at the start of the queue.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400">
                                    <div className="bg-gray-100 p-10 rounded-full mb-6">
                                        <BarChart3 className="w-16 h-16" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">Benchmarking Lab</h3>
                                    <p>Input your payload data on the left to compare all scheduling strategies.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comparison;
