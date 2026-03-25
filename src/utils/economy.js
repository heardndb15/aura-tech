/**
 * Token Economy Utilities
 * Handles stake calculations, reward distribution, and economics
 */

// Economy constants
export const ECONOMY = {
    MIN_STAKE: 1,
    MAX_STAKE: 50,
    INITIAL_BALANCE: 100,
    REWARD_MULTIPLIER: 1.5,       // Return 150% on success
    CHARITY_SPLIT: 0.3,            // 30% of lost stakes go to charity
    WINNER_POOL_SPLIT: 0.7,        // 70% of lost stakes go to winners pool
    XP_PER_TASK: 25,
    XP_PER_MOOD: 10,
    XP_PER_FEAR: 50,
    STREAK_BONUS_MULTIPLIER: 0.1,  // 10% bonus per streak day
    MAX_STREAK_BONUS: 2.0,         // Max 200% bonus
};

/**
 * Calculate reward for completing a staked task
 */
export function calculateReward(stake, streakDays = 0) {
    if (!stake || stake <= 0) return 0;
    const streakBonus = Math.min(
        streakDays * ECONOMY.STREAK_BONUS_MULTIPLIER,
        ECONOMY.MAX_STREAK_BONUS
    );
    return Math.floor(stake * ECONOMY.REWARD_MULTIPLIER * (1 + streakBonus));
}

/**
 * Calculate how lost stakes are distributed
 */
export function distributeLostStake(amount) {
    return {
        toCharity: Math.floor(amount * ECONOMY.CHARITY_SPLIT),
        toWinnerPool: Math.ceil(amount * ECONOMY.WINNER_POOL_SPLIT),
    };
}

/**
 * Calculate XP needed for next level
 */
export function xpForLevel(level) {
    return level * 100;
}

/**
 * Get the overall garden health score (0-100)
 */
export function calculateGardenHealth(garden) {
    const rootScore = Math.min(garden.roots.xp / 500, 1) * 25;
    const stemScore = Math.min(garden.stems.xp / 500, 1) * 25;
    const budScore = Math.min(garden.buds.xp / 500, 1) * 25;

    // Bonuses and Penalties
    const weedPenalty = garden.weeds.active * 5;
    const weedBonus = garden.weeds.removed * 3;
    const decorBonus = (garden.decorations?.length || 0) * 2; // +2% per decoration

    return Math.min(100, Math.max(0, Math.floor(rootScore + stemScore + budScore + weedBonus + decorBonus - weedPenalty + 25)));
}

/**
 * Format token amount
 */
export function formatTokens(amount) {
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toString();
}

/**
 * Get streak label
 */
export function getStreakLabel(days) {
    if (days === 0) return 'Start a streak!';
    if (days < 3) return `${days} day streak 🌱`;
    if (days < 7) return `${days} day streak 🌿`;
    if (days < 14) return `${days} day streak 🌳`;
    if (days < 30) return `${days} day streak 🔥`;
    return `${days} day streak 💎`;
}
