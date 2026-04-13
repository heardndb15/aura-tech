/**
 * Anti-AI Physical Proof System
 * Generates random verification challenges to prove task completion is real.
 */

const GESTURES = [
    'peace sign (V)', 'thumbs up', 'open palm', 'pointing up',
    'fist bump', 'OK sign', 'rock on (🤘)', 'three fingers',
];

const OBJECTS = [
    'a pen', 'a book', 'a cup/mug', 'headphones', 'a notebook',
    'your phone case', 'a water bottle', 'a key', 'a spoon', 'sunglasses',
];

const COLORS = [
    'red', 'blue', 'green', 'yellow', 'white', 'black', 'orange', 'purple',
];

const BACKGROUNDS = [
    'near a window', 'at your desk', 'near a door', 'outside',
    'near a plant', 'in a kitchen', 'near bookshelves', 'on a couch',
];

const TASK_SPECIFIC = {
    root: [
        'your journal/diary', 'a calming item', 'something that makes you happy',
    ],
    stem: [
        'your textbook/study material', 'your exercise equipment', 'a book you\'re reading',
    ],
    bud: [
        'something you shared with someone', 'a thank you note', 'a group activity item',
    ],
    weed: [
        'something that represents your courage', 'a motivational note', 'a completed challenge note',
    ],
};

/**
 * Generate a random proof challenge for a given task category
 * Fetches from the Python backend to ensure secure, seeded challenges.
 * @param {string} category - root | stem | bud | weed
 * @returns {Promise<{ challenge: string, requirements: string[], expiresIn: number, id: string }>}
 */
export async function generateProofChallenge(category = 'stem') {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/proof/generate/${category}`);
        if (!response.ok) throw new Error('Backend failed');
        
        const data = await response.json();
        
        return {
            id: 'proof-' + Date.now(),
            challenge: data.challenge,
            requirements: data.requirements,
            generatedAt: new Date().toISOString(),
            expiresIn: data.expires_in,
        };
    } catch (err) {
        console.error("Proof API failed, falling back to basic generation:", err);
        // Fallback for safety during development
        return {
            id: 'proof-' + Date.now(),
            challenge: "📸 Take a photo of your effort (Manual verification enabled)",
            requirements: ["Show your progress"],
            generatedAt: new Date().toISOString(),
            expiresIn: 300,
        };
    }
}

/**
 * Validate if a proof submission has enough peer reviews
 * @param {{ valid: number, invalid: number }} votes
 * @returns {'approved' | 'rejected' | 'pending'}
 */
export function evaluateProof(votes) {
    const total = votes.valid + votes.invalid;
    if (total < 3) return 'pending'; // Need at least 3 reviews
    const ratio = votes.valid / total;
    if (ratio >= 0.67) return 'approved';  // 2/3 majority
    return 'rejected';
}

/**
 * Generate a random review task for peer review queue
 */
export function getReviewTask(allTasks, currentUserId) {
    const pendingReview = allTasks.filter(
        t => t.status === 'pending_review' &&
            t.userId !== currentUserId &&
            t.proofPhoto
    );
    if (pendingReview.length === 0) return null;
    return pendingReview[Math.floor(Math.random() * pendingReview.length)];
}

// Fisher-Yates shuffle
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
