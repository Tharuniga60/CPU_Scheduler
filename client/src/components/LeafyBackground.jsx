import { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ── Nature shapes ── */
const LeafA = ({ cls, style }) => (
    <svg viewBox="0 0 24 24" className={cls} style={style} fill="currentColor">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.12,20C11,20 14.27,15.5 17,12C18,12 20,12 22,10C22,10 19,6 17,8Z" />
    </svg>
);
const LeafB = ({ cls, style }) => (
    <svg viewBox="0 0 24 24" className={cls} style={style} fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.48 17.52,2 12,2M12,4C16.42,4 20,7.58 20,12C20,15.35 18.07,18.24 15.25,19.68C15.72,18.5 16,17.28 16,16C16,12.69 14.07,9.85 11.25,8.45L12,4Z" />
    </svg>
);
const Flower = ({ cls, style }) => (
    <svg viewBox="0 0 24 24" className={cls} style={style} fill="currentColor">
        <path d="M12,1A4,4 0 0,1 16,5A4,4 0 0,1 12,9A4,4 0 0,1 8,5A4,4 0 0,1 12,1M12,11A4,4 0 0,1 16,15A4,4 0 0,1 12,19A4,4 0 0,1 8,15A4,4 0 0,1 12,11M5.5,6A4,4 0 0,1 9.5,10A4,4 0 0,1 5.5,14A4,4 0 0,1 1.5,10A4,4 0 0,1 5.5,6M18.5,6A4,4 0 0,1 22.5,10A4,4 0 0,1 18.5,14A4,4 0 0,1 14.5,10A4,4 0 0,1 18.5,6Z" />
    </svg>
);
const Drop = ({ cls, style }) => (
    <svg viewBox="0 0 24 24" className={cls} style={style} fill="currentColor">
        <path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" />
    </svg>
);
const Star = ({ cls, style }) => (
    <svg viewBox="0 0 24 24" className={cls} style={style} fill="currentColor">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
    </svg>
);

const SHAPES = [LeafA, LeafB, Flower, Drop, Star];

/* Vibrant nature colours */
const COLORS = [
    '#22c55e', '#4ade80', '#16a34a',   // greens
    '#0ea5e9', '#38bdf8', '#06b6d4',   // blues / cyan
    '#f97316', '#fb923c',              // oranges (autumn leaves)
    '#ec4899', '#f472b6',              // pinks (blossoms)
    '#a855f7', '#c084fc',              // purples (lavender)
    '#eab308', '#facc15',              // yellows (sunflower)
    '#14b8a6', '#2dd4bf',              // teal (moss)
];

const rand = (min, max) => Math.random() * (max - min) + min;

export default function LeafyBackground() {
    const particles = useMemo(() => (
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            Shape: SHAPES[i % SHAPES.length],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: rand(16, 52),
            x: rand(0, 100),
            y: rand(-10, 100),
            rotate: rand(0, 360),
            duration: rand(10, 22),
            delay: rand(0, 12),
            floatY: rand(15, 35),
            floatRotate: rand(-20, 20),
            opacity: rand(0.1, 0.22),
        }))
    ), []);

    return (
        <div className="leafy-bg">
            {particles.map(({ id, Shape, color, size, x, y, rotate, duration, delay, floatY, floatRotate, opacity }) => (
                <motion.div
                    key={id}
                    style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        color,
                        opacity,
                    }}
                    animate={{
                        y: [0, -floatY, 0, -floatY * 0.6, 0],
                        rotate: [rotate, rotate + floatRotate, rotate - floatRotate * 0.5, rotate],
                        scale: [1, 1.08, 0.95, 1],
                    }}
                    transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Shape
                        cls=""
                        style={{ width: size, height: size, display: 'block', filter: `drop-shadow(0 2px 6px ${color}55)` }}
                    />
                </motion.div>
            ))}

            {/* Soft radial glows */}
            <div style={{
                position: 'absolute', top: '10%', left: '5%',
                width: 400, height: 400,
                background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '15%', right: '8%',
                width: 350, height: 350,
                background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '50%', left: '45%',
                width: 300, height: 300,
                background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
        </div>
    );
}
