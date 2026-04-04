import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateReward } from '../utils/economy';

const AppContext = createContext();

// Initial garden data structure
const createInitialGarden = () => ({
    roots: { level: 1, xp: 0, streak: 0, lastCheckIn: null },
    stems: { level: 1, xp: 0, streak: 0, totalTasks: 0 },
    buds: { level: 1, xp: 0, karma: 0, activities: 0 },
    weeds: { removed: 0, active: 0 },
    decorations: [], // Array of item IDs
});

const createInitialWallet = () => ({
    balance: 100,   // Starting tokens
    totalEarned: 0,
    totalStaked: 0,
    totalLost: 0,
    history: [],
});

export function AppProvider({ children }) {
    const { user } = useAuth();
    const [garden, setGarden] = useState(createInitialGarden());
    const [wallet, setWallet] = useState(createInitialWallet());
    const [tasks, setTasks] = useState([]);
    const [moods, setMoods] = useState([]);
    const [fears, setFears] = useState([]);
    const [reviews, setReviews] = useState([]); // peer review queue
    const [notifications, setNotifications] = useState([]);

    let API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    if (!API_URL.endsWith('/api') && !API_URL.includes('/api')) {
        API_URL = `${API_URL.replace(/\/+$/, '')}/api`;
    }
    API_URL = API_URL.replace(/\/+$/, ''); // Remove trailing slashes
    // Load saved data from backend
    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                // 1. Load general user data (garden, wallet, moods, notifications)
                const dataRes = await fetch(`${API_URL}/user/data/${user.uid}`);
                const data = await dataRes.json();

                if (data.garden && typeof data.garden === 'object' && Object.keys(data.garden).length > 0) {
                    setGarden(data.garden);
                } else {
                    console.log('Using default garden state');
                }

                if (data.wallet && typeof data.wallet === 'object' && 'balance' in data.wallet) {
                    setWallet(data.wallet);
                } else {
                    console.log('Using default wallet state');
                }

                setMoods(Array.isArray(data.moods) ? data.moods : []);
                setNotifications(Array.isArray(data.notifications) ? data.notifications : []);

                // 2. Load Tasks
                const tasksRes = await fetch(`${API_URL}/tasks/${user.uid}`);
                const tasksData = await tasksRes.json();
                setTasks(tasksData.tasks || []);

                // 3. Load Fears
                const fearsRes = await fetch(`${API_URL}/fears/${user.uid}`);
                const fearsData = await fearsRes.json();
                setFears(fearsData.fears || []);

            } catch (err) {
                console.error("Backend load failed, falling back to localStorage:", err);
                const savedData = localStorage.getItem(`aura-data-${user.uid}`);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setGarden(parsed.garden || createInitialGarden());
                    setWallet(parsed.wallet || createInitialWallet());
                    setTasks(parsed.tasks || []);
                    setMoods(parsed.moods || []);
                    setFears(parsed.fears || []);
                }
            }
        };

        loadData();
    }, [user]);

    // Save data to backend
    useEffect(() => {
        if (!user) return;

        const saveData = async () => {
            try {
                // Save general user data
                await fetch(`${API_URL}/user/data?username=${user.uid}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ garden, wallet, moods, notifications })
                });

                // Locally save to localStorage as backup
                const data = { garden, wallet, tasks, moods, fears, reviews };
                localStorage.setItem(`aura-data-${user.uid}`, JSON.stringify(data));
            } catch (err) {
                console.error("Auto-save failed:", err);
            }
        };

        const timeoutId = setTimeout(saveData, 1000); // Debounced save
        return () => clearTimeout(timeoutId);
    }, [user, garden, wallet, moods, notifications]);

    // Independent task/fear saves for reliability
    const syncItem = async (type, item) => {
        if (!user) return;
        try {
            await fetch(`${API_URL}/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...item, user_id: user.uid })
            });
        } catch (err) {
            console.error(`Syncing ${type} failed:`, err);
        }
    };

    // ======= TASK MANAGEMENT =======
    const addTask = (task) => {
        const newTask = {
            id: 'task-' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'active', // active | pending_proof | pending_review | completed | failed
            proofPhoto: null,
            proofChallenge: null,
            reviewVotes: { valid: 0, invalid: 0 },
            ...task,
        };
        setTasks(prev => [newTask, ...prev]);
        syncItem('tasks', newTask);
        return newTask;
    };

    const updateTask = (taskId, updates) => {
        setTasks(prev => {
            const updated = prev.map(t => t.id === taskId ? { ...t, ...updates } : t);
            const task = updated.find(t => t.id === taskId);
            if (task) syncItem('tasks', task);
            return updated;
        });
    };

    const completeTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const zoneMap = { root: 'roots', stem: 'stems', bud: 'buds' };
        const zone = zoneMap[task.category];
        const zData = garden[zone] || { streak: 0 };

        const xpReward = 25;
        // Use the utility function for reward calculation
        const tokenReward = calculateReward(task.stake || 5, zData.streak || 0);

        // Update task
        updateTask(taskId, { status: 'completed', completedAt: new Date().toISOString() });

        // Update garden zone XP
        if (zone) {
            setGarden(prev => {
                const z = prev[zone];
                const newXp = z.xp + xpReward;
                const newLevel = Math.floor(newXp / 100) + 1;
                return {
                    ...prev,
                    [zone]: {
                        ...z,
                        xp: newXp,
                        level: newLevel,
                        streak: (z.streak || 0) + 1,
                        totalTasks: (z.totalTasks || 0) + 1,
                    },
                };
            });
        }

        // Update wallet
        setWallet(prev => ({
            ...prev,
            balance: prev.balance + tokenReward,
            totalEarned: prev.totalEarned + tokenReward,
            history: [
                {
                    id: 'tx-' + Date.now(),
                    type: 'reward',
                    amount: tokenReward,
                    description: `Task completed: ${task.title}`,
                    date: new Date().toISOString(),
                },
                ...prev.history,
            ],
        }));

        // Notify
        addNotification(`🌿 Task completed! +${xpReward}XP +${tokenReward} gems`);
    };

    const failTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        updateTask(taskId, { status: 'failed', failedAt: new Date().toISOString() });

        if (task.stake) {
            setWallet(prev => ({
                ...prev,
                totalLost: prev.totalLost + task.stake,
                history: [
                    {
                        id: 'tx-' + Date.now(),
                        type: 'loss',
                        amount: -task.stake,
                        description: `Task failed: ${task.title}`,
                        date: new Date().toISOString(),
                    },
                    ...prev.history,
                ],
            }));
        }

        // Reset streak
        const zoneMap = { root: 'roots', stem: 'stems', bud: 'buds' };
        const zone = zoneMap[task.category];
        if (zone) {
            setGarden(prev => ({
                ...prev,
                [zone]: { ...prev[zone], streak: 0 },
            }));
        }
    };

    // ======= STAKE MANAGEMENT =======
    const placeStake = (taskId, amount) => {
        if (wallet.balance < amount) return false;
        setWallet(prev => ({
            ...prev,
            balance: prev.balance - amount,
            totalStaked: prev.totalStaked + amount,
            history: [
                {
                    id: 'tx-' + Date.now(),
                    type: 'stake',
                    amount: -amount,
                    description: `Staked on task`,
                    date: new Date().toISOString(),
                },
                ...prev.history,
            ],
        }));
        updateTask(taskId, { stake: amount });
        return true;
    };

    // ======= MOOD CHECK-IN =======
    const addMoodCheckIn = (mood, note = '') => {
        const entry = {
            id: 'mood-' + Date.now(),
            mood, // 1-5
            note,
            date: new Date().toISOString(),
        };
        setMoods(prev => [entry, ...prev]);
        setGarden(prev => ({
            ...prev,
            roots: {
                ...prev.roots,
                xp: prev.roots.xp + 10,
                lastCheckIn: entry.date,
                streak: prev.roots.streak + 1,
            },
        }));
        addNotification('🧘 Mood checked in! +10 XP for Roots');
    };

    // ======= FEAR MANAGEMENT =======
    const addFear = (fearText) => {
        const challenge = generateFearChallenge(fearText);
        const fear = {
            id: 'fear-' + Date.now(),
            text: fearText,
            challenge,
            status: 'active', // active | conquered
            createdAt: new Date().toISOString(),
        };
        setFears(prev => [fear, ...prev]);
        setGarden(prev => ({ ...prev, weeds: { ...prev.weeds, active: prev.weeds.active + 1 } }));
        syncItem('fears', fear);
        return fear;
    };

    const conquerFear = (fearId) => {
        setFears(prev => {
            const updated = prev.map(f => f.id === fearId ? { ...f, status: 'conquered', conqueredAt: new Date().toISOString() } : f);
            const fear = updated.find(f => f.id === fearId);
            if (fear) syncItem('fears', fear);
            return updated;
        });
        setGarden(prev => ({
            ...prev,
            weeds: {
                removed: prev.weeds.removed + 1,
                active: Math.max(0, prev.weeds.active - 1),
            },
        }));
        addNotification('🔥 Fear conquered! Weed removed from your garden!');
    };

    // ======= SHOP & DECORATIONS =======
    const buyItem = (item) => {
        if (wallet.balance < item.price) {
            addNotification('❌ Not enough gems!');
            return false;
        }

        setWallet(prev => ({
            ...prev,
            balance: prev.balance - item.price,
            history: [
                {
                    id: 'tx-' + Date.now(),
                    type: 'purchase',
                    amount: -item.price,
                    description: `Purchased: ${item.label}`,
                    date: new Date().toISOString(),
                },
                ...prev.history,
            ],
        }));

        setGarden(prev => ({
            ...prev,
            decorations: [...(prev.decorations || []), {
                id: item.id,
                boughtAt: new Date().toISOString(),
                type: item.type,
                emoji: item.emoji,
                // Assign a random position if not fixed
                position: {
                    top: Math.random() * 60 + 20 + '%',
                    left: Math.random() * 60 + 20 + '%'
                }
            }]
        }));

        addNotification(`✨ Purchased ${item.label}! It's now on your island.`);
        return true;
    };

    // ======= NOTIFICATIONS =======
    const addNotification = (message) => {
        const notif = { id: 'n-' + Date.now(), message, read: false, date: new Date().toISOString() };
        setNotifications(prev => [notif, ...prev.slice(0, 9)]);
    };

    const value = {
        garden, wallet, tasks, moods, fears, reviews, notifications,
        addTask, updateTask, completeTask, failTask,
        placeStake,
        addMoodCheckIn,
        addFear, conquerFear,
        buyItem,
        addNotification,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

// ======= HELPER: Generate fear challenge =======
function generateFearChallenge(fearText) {
    const challenges = {
        'public speaking': 'Record a 30-second video of yourself speaking about any topic',
        'heights': 'Take a selfie from the highest floor you can access',
        'social anxiety': 'Start a conversation with a stranger and write about it',
        'failure': 'Try something new today that you might fail at, and document it',
        'rejection': 'Ask someone for a small favor and share the outcome',
    };

    const lower = fearText.toLowerCase();
    for (const [key, challenge] of Object.entries(challenges)) {
        if (lower.includes(key)) return challenge;
    }

    // Generic challenge
    const generic = [
        `Write 3 specific steps to face "${fearText}" and complete the first step today`,
        `Spend 5 minutes visualizing yourself overcoming "${fearText}", then write your reflection`,
        `Tell someone about "${fearText}" and share their response`,
        `Do one small thing related to "${fearText}" that makes you slightly uncomfortable`,
    ];
    return generic[Math.floor(Math.random() * generic.length)];
}
