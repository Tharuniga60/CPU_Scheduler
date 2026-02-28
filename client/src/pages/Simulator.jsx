import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play, RotateCcw, ArrowLeft, InfoIcon, GitCompare, TrendingUp, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import LeafyBackground from '../components/LeafyBackground';
import GanttChart from '../components/GanttChart';

const ALGO_INFO = {
    FCFS: { label: 'First Come First Serve', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    SJF: { label: 'Shortest Job First', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    SRTF: { label: 'Shortest Remaining Time First', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    RR: { label: 'Round Robin', color: 'bg-pink-100 text-pink-700 border-pink-200' },
};

const Simulator = () => {
    const { algoId } = useParams();
    const [processes, setProcesses] = useState([
        { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 },
    ]);
    const [quantum, setQuantum] = useState(2);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    // Inline compare state
    const [compareStats, setCompareStats] = useState(null);
    const [compareLoading, setCompareLoading] = useState(false);
    const [showCompare, setShowCompare] = useState(false);

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

    const handleSimulate = async () => {
        setLoading(true);
        setCompareStats(null);
        setShowCompare(false);
        try {
            const res = await api.post('/scheduling/calculate', {
                algorithm: algoId,
                processes,
                quantum
            });
            setResults(res.data);
        } catch (err) {
            alert('Simulation failed. Please check inputs.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setProcesses([{ id: 1, name: 'P1', arrivalTime: 0, burstTime: 5 }]);
        setResults(null);
        setCompareStats(null);
        setShowCompare(false);
    };

    const handleCompareAll = async () => {
        setCompareLoading(true);
        setShowCompare(true);
        try {
            const res = await api.post('/scheduling/compare', { processes, quantum });
            // Sort by avgWT ascending so rank 1 = best
            const sorted = [...res.data.stats].sort((a, b) => a.avgWT - b.avgWT);
            setCompareStats(sorted);
        } catch (err) {
            alert('Comparison failed.');
        } finally {
            setCompareLoading(false);
        }
    };

    const getBadgeClass = (rank) => {
        if (rank === 0) return 'bg-yellow-400 text-white';
        if (rank === 1) return 'bg-gray-300 text-gray-700';
        if (rank === 2) return 'bg-amber-600 text-white';
        return 'bg-gray-100 text-gray-500';
    };

    const getRankLabel = (rank) => ['🥇', '🥈', '🥉', '4th'][rank] ?? '—';

    const efficiencyInsight = (stats) => {
        if (!stats) return null;
        const best = stats[0];
        const worst = stats[stats.length - 1];
        const saving = ((worst.avgWT - best.avgWT) / worst.avgWT * 100).toFixed(1);
        return { best, worst, saving };
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 relative">
            <LeafyBackground />
            <Navbar />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar: Inputs */}
                <div className="lg:col-span-4 space-y-6">
                    <Link to="/dashboard" className="flex items-center gap-2 text-pastel-green-600 font-semibold mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Cards
                    </Link>

                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">{algoId} Simulator</h2>
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className="text-gray-400 hover:text-pastel-green-500 transition-colors"
                            >
                                <InfoIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {showInfo && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="bg-pastel-green-50 text-pastel-green-700 p-4 rounded-xl text-xs overflow-hidden"
                            >
                                Configure arrival and burst times for each process. Click "Simulate" to see the results.
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            {algoId === 'RR' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Time Quantum</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input-field w-full"
                                        value={quantum}
                                        onChange={(e) => setQuantum(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Column Headers */}
                            <div className="grid grid-cols-12 gap-2 items-center px-1">
                                <div className="col-span-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Process</div>
                                <div className="col-span-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Arrival</div>
                                <div className="col-span-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Burst</div>
                                <div className="col-span-2"></div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                {processes.map((p) => (
                                    <motion.div
                                        layout
                                        key={p.id}
                                        className="grid grid-cols-12 gap-2 items-center"
                                    >
                                        <div className="col-span-2 text-center font-bold text-gray-500">{p.name}</div>
                                        <div className="col-span-4">
                                            <input
                                                type="number"
                                                placeholder="Arrival"
                                                className="input-field w-full text-sm py-2 px-2"
                                                value={p.arrivalTime}
                                                onChange={(e) => handleChange(p.id, 'arrivalTime', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input
                                                type="number"
                                                placeholder="Burst"
                                                className="input-field w-full text-sm py-2 px-2"
                                                value={p.burstTime}
                                                onChange={(e) => handleChange(p.id, 'burstTime', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <button
                                                onClick={() => removeProcess(p.id)}
                                                className="text-red-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={addProcess}
                                className="w-full border-2 border-dashed border-pastel-green-300 text-pastel-green-600 font-bold py-3 rounded-xl hover:bg-pastel-green-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Process
                            </button>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSimulate}
                                    disabled={loading}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4" /> {loading ? '...' : 'Simulate'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-xl transition-all"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main: Results */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {results ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Gantt Chart */}
                                <div className="glass-card p-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-8">Gantt Chart Visualization</h3>
                                    <GanttChart data={results.gantt} />
                                </div>

                                {/* Results Table */}
                                <div className="glass-card overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-pastel-green-50 text-pastel-green-700 font-bold uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-4">Process</th>
                                                <th className="px-6 py-4">Arrival</th>
                                                <th className="px-6 py-4">Burst</th>
                                                <th className="px-6 py-4">Completion</th>
                                                <th className="px-6 py-4">TAT</th>
                                                <th className="px-6 py-4">WT</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {results.result.sort((a, b) => a.id - b.id).map(p => (
                                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                                                    <td className="px-6 py-4 text-gray-600">{p.arrivalTime}</td>
                                                    <td className="px-6 py-4 text-gray-600">{p.burstTime}</td>
                                                    <td className="px-6 py-4 text-pastel-green-600 font-medium">{p.completionTime}</td>
                                                    <td className="px-6 py-4 text-pastel-green-600 font-medium">{p.turnaroundTime}</td>
                                                    <td className="px-6 py-4 text-pastel-green-600 font-medium">{p.waitingTime}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="p-6 bg-pastel-green-500 text-white flex justify-around font-bold">
                                        <span>Avg WT: {results.avgWaitingTime.toFixed(2)}</span>
                                        <span>Avg TAT: {results.avgTurnaroundTime.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* ── Compare All Button ── */}
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={handleCompareAll}
                                    disabled={compareLoading}
                                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-white
                                               bg-gradient-to-r from-pastel-green-500 to-pastel-green-400
                                               hover:from-pastel-green-600 hover:to-pastel-green-500
                                               shadow-lg hover:shadow-pastel-green-200 transition-all disabled:opacity-60"
                                >
                                    <GitCompare className="w-5 h-5" />
                                    {compareLoading
                                        ? 'Running all algorithms…'
                                        : 'Compare Same Input Across All Algorithms'}
                                    {compareStats && !compareLoading && (
                                        showCompare
                                            ? <ChevronUp className="w-4 h-4 ml-auto" />
                                            : <ChevronDown className="w-4 h-4 ml-auto" />
                                    )}
                                </motion.button>

                                {/* ── Inline Compare Results ── */}
                                <AnimatePresence>
                                    {showCompare && compareStats && (
                                        <motion.div
                                            key="compare-panel"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-5 overflow-hidden"
                                        >
                                            {/* Ranked Comparison Table */}
                                            <div className="glass-card overflow-hidden">
                                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                                    <h3 className="font-bold text-gray-800 text-lg">Algorithm Ranking — Same Input</h3>
                                                </div>
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                                        <tr>
                                                            <th className="px-6 py-3">Rank</th>
                                                            <th className="px-6 py-3">Algorithm</th>
                                                            <th className="px-6 py-3">Avg Waiting Time</th>
                                                            <th className="px-6 py-3">Avg Turnaround Time</th>
                                                            <th className="px-6 py-3">vs Current</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {compareStats.map((s, i) => {
                                                            const isCurrent = s.name === algoId;
                                                            const diff = (s.avgWT - compareStats[0].avgWT).toFixed(2);
                                                            return (
                                                                <tr
                                                                    key={s.name}
                                                                    className={`transition-colors ${i === 0 ? 'bg-yellow-50/60' : ''} ${isCurrent ? 'ring-2 ring-inset ring-pastel-green-300' : 'hover:bg-gray-50/50'}`}
                                                                >
                                                                    <td className="px-6 py-4">
                                                                        <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBadgeClass(i)}`}>
                                                                            {getRankLabel(i)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${ALGO_INFO[s.name]?.color ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                                                {s.name}
                                                                            </span>
                                                                            {isCurrent && (
                                                                                <span className="text-xs text-pastel-green-600 font-semibold">(current)</span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-400 mt-0.5">{ALGO_INFO[s.name]?.label}</p>
                                                                    </td>
                                                                    <td className="px-6 py-4 font-semibold text-gray-700">{s.avgWT.toFixed(2)}</td>
                                                                    <td className="px-6 py-4 text-gray-600">{s.avgTAT.toFixed(2)}</td>
                                                                    <td className="px-6 py-4">
                                                                        {i === 0
                                                                            ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Best ✓</span>
                                                                            : <span className="text-xs text-red-400 font-medium">+{diff} WT</span>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Efficiency Insight Card */}
                                            {(() => {
                                                const insight = efficiencyInsight(compareStats);
                                                if (!insight) return null;
                                                const { best, worst, saving } = insight;
                                                const currentRank = compareStats.findIndex(s => s.name === algoId);
                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        {/* Winner card */}
                                                        <div className="glass-card p-6 bg-gradient-to-br from-pastel-green-500 to-pastel-green-400 text-white space-y-3">
                                                            <div className="flex items-center gap-2 font-bold text-lg">
                                                                <TrendingUp className="w-5 h-5" /> Best Algorithm
                                                            </div>
                                                            <p className="text-3xl font-black">{best.name}</p>
                                                            <p className="text-sm opacity-90">{ALGO_INFO[best.name]?.label}</p>
                                                            <div className="bg-white/20 rounded-xl p-3 text-sm font-medium space-y-1">
                                                                <div>Avg WT: <strong>{best.avgWT.toFixed(2)}</strong></div>
                                                                <div>Avg TAT: <strong>{best.avgTAT.toFixed(2)}</strong></div>
                                                            </div>
                                                            <p className="text-xs opacity-80">
                                                                🏆 Saves <strong>{saving}%</strong> waiting time vs worst ({worst.name})
                                                            </p>
                                                        </div>

                                                        {/* Your algorithm assessment */}
                                                        <div className="glass-card p-6 space-y-3">
                                                            <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
                                                                <GitCompare className="w-5 h-5 text-pastel-green-500" />
                                                                Your Algorithm ({algoId})
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-2xl font-black px-3 py-1 rounded-xl ${getBadgeClass(currentRank)}`}>
                                                                    #{currentRank + 1}
                                                                </span>
                                                                <span className="text-gray-600 text-sm">out of 4 algorithms</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                                {currentRank === 0
                                                                    ? '✅ Great choice! Your current algorithm is the most efficient for this input set.'
                                                                    : currentRank === 1
                                                                        ? `⚡ Close! Switching to ${compareStats[0].name} would reduce avg wait by ${(compareStats[currentRank].avgWT - compareStats[0].avgWT).toFixed(2)} units.`
                                                                        : `💡 Consider trying ${compareStats[0].name} — it reduces avg waiting time by ${(compareStats[currentRank].avgWT - compareStats[0].avgWT).toFixed(2)} units for this input.`
                                                                }
                                                            </p>
                                                            <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 space-y-1">
                                                                <p><strong>FCFS</strong> — simple, fair, no starvation</p>
                                                                <p><strong>SJF</strong> — optimal avg WT (non-preemptive)</p>
                                                                <p><strong>SRTF</strong> — best avg WT (preemptive)</p>
                                                                <p><strong>RR</strong> — fair time-sharing, good for I/O</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]"
                            >
                                <div className="bg-gray-100 p-8 rounded-full mb-6">
                                    <Play className="w-12 h-12" />
                                </div>
                                <p className="text-lg font-medium">Ready to simulate. Add your processes and click Play!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Simulator;
