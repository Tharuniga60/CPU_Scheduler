import { motion } from 'framer-motion';

const PROCESS_COLORS = [
    'from-emerald-400 to-green-600',
    'from-sky-400 to-blue-600',
    'from-amber-400 to-orange-600',
    'from-fuchsia-400 to-purple-600',
    'from-rose-400 to-pink-600',
    'from-cyan-400 to-teal-600',
    'from-lime-400 to-lime-600',
    'from-indigo-400 to-violet-600',
];

const GanttChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const totalTime = data[data.length - 1].end;

    // Map process names to consistent colors
    const processColorMap = {};
    let colorIdx = 0;
    data.forEach(block => {
        if (block.name !== 'Idle' && !processColorMap[block.name]) {
            processColorMap[block.name] = PROCESS_COLORS[colorIdx % PROCESS_COLORS.length];
            colorIdx++;
        }
    });

    return (
        <div className="w-full overflow-x-auto pb-10 pt-4 px-2">
            <div className="min-w-[800px] h-40 relative flex items-end">
                {data.map((block, i) => {
                    const width = ((block.end - block.start) / totalTime) * 100;
                    const isIdle = block.name === 'Idle';
                    const colorClass = isIdle ? 'from-gray-100 to-gray-200' : processColorMap[block.name];

                    return (
                        <motion.div
                            key={i}
                            initial={{ width: 0, opacity: 0, scaleY: 0.8 }}
                            animate={{ width: `${width}%`, opacity: 1, scaleY: 1 }}
                            transition={{
                                delay: i * 0.08,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className={`gantt-block h-20 flex flex-col items-center justify-center border-l border-white/40 relative group
                                bg-gradient-to-b ${colorClass} shadow-lg first:rounded-l-2xl last:rounded-r-2xl
                            `}
                        >
                            {/* Process Name */}
                            <span className={`text-sm font-black drop-shadow-sm px-2 truncate ${isIdle ? 'text-gray-400' : 'text-white'}`}>
                                {block.name}
                            </span>

                            {/* Hover info tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                {block.name}: {block.start} → {block.end} ({block.end - block.start} units)
                            </div>

                            {/* Start Time Label */}
                            <div className="absolute -bottom-8 left-0 flex flex-col items-center">
                                <div className="w-px h-2 bg-gray-300 mb-1"></div>
                                <span className="text-[10px] font-bold text-gray-400 bg-white/50 px-1 rounded">
                                    {block.start}
                                </span>
                            </div>

                            {/* End Time Label for last block */}
                            {i === data.length - 1 && (
                                <div className="absolute -bottom-8 right-0 flex flex-col items-center">
                                    <div className="w-px h-2 bg-gray-300 mb-1"></div>
                                    <span className="text-[10px] font-bold text-gray-400 bg-white/50 px-1 rounded">
                                        {block.end}
                                    </span>
                                </div>
                            )}

                            {/* Subtle inner glow */}
                            {!isIdle && (
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-inherit" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
                {Object.entries(processColorMap).map(([name, color]) => (
                    <div key={name} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm transition-transform hover:scale-110">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
                        <span className="text-xs font-bold text-gray-600">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GanttChart;
