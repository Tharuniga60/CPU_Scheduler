const calculateFCFS = (processes) => {
    // Sort by arrival time
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    const result = [];
    const gantt = [];

    sorted.forEach(p => {
        if (currentTime < p.arrivalTime) {
            gantt.push({ name: 'Idle', start: currentTime, end: p.arrivalTime });
            currentTime = p.arrivalTime;
        }
        const start = currentTime;
        currentTime += p.burstTime;
        const end = currentTime;

        const ct = end;
        const tat = ct - p.arrivalTime;
        const wt = tat - p.burstTime;

        result.push({
            ...p,
            completionTime: ct,
            turnaroundTime: tat,
            waitingTime: wt
        });
        gantt.push({ name: p.name, start, end });
    });

    return { result, gantt };
};

const calculateSJF = (processes) => {
    let currentTime = 0;
    const result = [];
    const gantt = [];
    let remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (remaining.length > 0) {
        const available = remaining.filter(p => p.arrivalTime <= currentTime);

        if (available.length === 0) {
            const nextArrival = remaining[0].arrivalTime;
            gantt.push({ name: 'Idle', start: currentTime, end: nextArrival });
            currentTime = nextArrival;
            continue;
        }

        // Pick shortest burst time among available
        available.sort((a, b) => a.burstTime - b.burstTime);
        const p = available[0];

        const start = currentTime;
        currentTime += p.burstTime;
        const end = currentTime;

        const ct = end;
        const tat = ct - p.arrivalTime;
        const wt = tat - p.burstTime;

        result.push({
            ...p,
            completionTime: ct,
            turnaroundTime: tat,
            waitingTime: wt
        });
        gantt.push({ name: p.name, start, end });

        remaining = remaining.filter(r => r.id !== p.id);
    }

    return { result, gantt };
};

const calculateSRTF = (processes) => {
    let currentTime = 0;
    const result = [];
    const gantt = [];
    let remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let finishedCount = 0;
    let lastProcess = null;

    while (finishedCount < processes.length) {
        const available = remaining.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

        if (available.length === 0) {
            if (lastProcess !== 'Idle') {
                gantt.push({ name: 'Idle', start: currentTime, end: currentTime + 1 });
            } else {
                gantt[gantt.length - 1].end += 1;
            }
            currentTime++;
            lastProcess = 'Idle';
            continue;
        }

        available.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
        const p = available[0];

        if (lastProcess !== p.name) {
            gantt.push({ name: p.name, start: currentTime, end: currentTime + 1 });
        } else {
            gantt[gantt.length - 1].end += 1;
        }

        p.remainingTime--;
        currentTime++;
        lastProcess = p.name;

        if (p.remainingTime === 0) {
            finishedCount++;
            const ct = currentTime;
            const tat = ct - p.arrivalTime;
            const wt = tat - p.burstTime;

            result.push({
                ...processes.find(orig => orig.id === p.id),
                completionTime: ct,
                turnaroundTime: tat,
                waitingTime: wt
            });
        }
    }

    return { result, gantt };
};

const calculateRR = (processes, quantum) => {
    let currentTime = 0;
    const result = [];
    const gantt = [];
    let remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
        .map(p => ({ ...p, remainingTime: p.burstTime }));

    const queue = [];
    let index = 0;

    // Initial push
    while (index < remaining.length && remaining[index].arrivalTime <= currentTime) {
        queue.push(remaining[index++]);
    }

    while (queue.length > 0 || index < remaining.length) {
        if (queue.length === 0) {
            const nextJump = remaining[index].arrivalTime;
            gantt.push({ name: 'Idle', start: currentTime, end: nextJump });
            currentTime = nextJump;
            while (index < remaining.length && remaining[index].arrivalTime <= currentTime) {
                queue.push(remaining[index++]);
            }
        }

        const p = queue.shift();
        const start = currentTime;
        const executionTime = Math.min(p.remainingTime, quantum);

        p.remainingTime -= executionTime;
        currentTime += executionTime;
        const end = currentTime;

        gantt.push({ name: p.name, start, end });

        // Check for new arrivals during execution
        while (index < remaining.length && remaining[index].arrivalTime <= currentTime) {
            queue.push(remaining[index++]);
        }

        if (p.remainingTime > 0) {
            queue.push(p);
        } else {
            const ct = currentTime;
            const tat = ct - p.arrivalTime;
            const wt = tat - p.burstTime;
            result.push({
                ...processes.find(orig => orig.id === p.id),
                completionTime: ct,
                turnaroundTime: tat,
                waitingTime: wt
            });
        }
    }

    return { result, gantt };
};

exports.calculate = (req, res) => {
    const { algorithm, processes, quantum } = req.body;

    if (!processes || !Array.isArray(processes)) {
        return res.status(400).json({ msg: 'Invalid processes data' });
    }

    let data;
    switch (algorithm) {
        case 'FCFS':
            data = calculateFCFS(processes);
            break;
        case 'SJF':
            data = calculateSJF(processes);
            break;
        case 'SRTF':
            data = calculateSRTF(processes);
            break;
        case 'RR':
            data = calculateRR(processes, parseInt(quantum) || 2);
            break;
        default:
            return res.status(400).json({ msg: 'Invalid algorithm' });
    }

    // Calculate averages
    const avgWaitingTime = data.result.reduce((sum, p) => sum + p.waitingTime, 0) / data.result.length;
    const avgTurnaroundTime = data.result.reduce((sum, p) => sum + p.turnaroundTime, 0) / data.result.length;

    res.json({
        ...data,
        avgWaitingTime,
        avgTurnaroundTime
    });
};

exports.compare = (req, res) => {
    const { processes, quantum } = req.body;

    const fcfs = calculateFCFS(processes);
    const sjf = calculateSJF(processes);
    const srtf = calculateSRTF(processes);
    const rr = calculateRR(processes, parseInt(quantum) || 2);

    const stats = [
        { name: 'FCFS', avgWT: fcfs.result.reduce((s, p) => s + p.waitingTime, 0) / processes.length, avgTAT: fcfs.result.reduce((s, p) => s + p.turnaroundTime, 0) / processes.length },
        { name: 'SJF', avgWT: sjf.result.reduce((s, p) => s + p.waitingTime, 0) / processes.length, avgTAT: sjf.result.reduce((s, p) => s + p.turnaroundTime, 0) / processes.length },
        { name: 'SRTF', avgWT: srtf.result.reduce((s, p) => s + p.waitingTime, 0) / processes.length, avgTAT: srtf.result.reduce((s, p) => s + p.turnaroundTime, 0) / processes.length },
        { name: 'RR', avgWT: rr.result.reduce((s, p) => s + p.waitingTime, 0) / processes.length, avgTAT: rr.result.reduce((s, p) => s + p.turnaroundTime, 0) / processes.length },
    ];

    res.json({ stats });
};
