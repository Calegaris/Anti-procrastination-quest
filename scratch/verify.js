// verify.js
// Visualizing and testing the experience calculations and class bonus progression.

const table = {
    1: 100,
    2: 250,
    3: 400,
    4: 600,
    5: 900,
    6: 1200,
    7: 1600,
    8: 2000,
    9: 2500
};

function getExpRequired(level) {
    return table[level] || 0;
}

function calculateExpPercentage(user) {
    if (!user) {
        return { current: 0, required: 100, percentage: 0 };
    }
    const lvl = parseInt(user.level, 10) || 1;
    const current = parseInt(user.experiencia ?? user.experience ?? 0, 10);

    if (lvl >= 10) {
        return { current: 0, required: 0, percentage: 100 };
    }

    const required = getExpRequired(lvl);
    const percentage = required > 0 ? (current / required) * 100 : 0;

    return {
        current,
        required,
        percentage: Math.min(percentage, 100)
    };
}

function applyClassBonus(expBase, userClass, mockDay = new Date().getDay()) {
    const base = parseInt(expBase, 10) || 0;
    const cls = (userClass || '').toLowerCase().trim();
    const isWeekend = (mockDay === 0 || mockDay === 6);
    const isWeekday = !isWeekend;

    let multiplier = 1.0;

    if (cls === 'warrior' || cls === 'guerrero') {
        if (isWeekday) {
            multiplier = 1.25;
        }
    } else if (cls === 'mage' || cls === 'mago') {
        if (isWeekend) {
            multiplier = 1.75;
        }
    }

    return Math.round(base * multiplier);
}

function addExperienceMock(user, amount) {
    let level = parseInt(user.level, 10) || 1;
    let experience = parseInt(user.experience || 0, 10) || 0;

    if (level >= 10) {
        user.level = 10;
        user.experience = 0;
        return { leveledUp: false, newLevel: 10 };
    }

    experience += amount;
    let leveledUp = false;

    while (level < 10 && experience >= getExpRequired(level)) {
        experience -= getExpRequired(level);
        level += 1;
        leveledUp = true;
    }

    if (level >= 10) {
        level = 10;
        experience = 0;
    }

    user.level = level;
    user.experience = experience;

    return {
        leveledUp,
        newLevel: level,
        remainingXp: experience
    };
}

// Running Verification Cases
console.log("-----------------------------------------");
console.log("APQ progression system verification tests");
console.log("-----------------------------------------");

// Test 1: Class Bonuses
// Monday is 1, Sunday is 0
console.log("\n[Test 1] Class Bonus Verification:");
const warriorWeekday = applyClassBonus(100, 'Warrior', 1); // Monday
const warriorWeekend = applyClassBonus(100, 'Warrior', 6); // Saturday
const mageWeekday = applyClassBonus(100, 'Mage', 1); // Monday
const mageWeekend = applyClassBonus(100, 'Mage', 0); // Sunday

console.log(`Warrior Weekday (1.25x): ${warriorWeekday} EXP (Expected: 125)`);
console.log(`Warrior Weekend (1.0x): ${warriorWeekend} EXP (Expected: 100)`);
console.log(`Mage Weekday (1.0x): ${mageWeekday} EXP (Expected: 100)`);
console.log(`Mage Weekend (1.75x): ${mageWeekend} EXP (Expected: 175)`);

// Test 2: Level calculation percentage
console.log("\n[Test 2] Level calculation percentage:");
const userMock1 = { level: 1, experience: 40 };
const pct1 = calculateExpPercentage(userMock1);
console.log(`Lvl 1 (40/100 EXP): ${pct1.percentage}% (Expected: 40%)`);

const userMock2 = { level: 2, experiencia: 125 };
const pct2 = calculateExpPercentage(userMock2);
console.log(`Lvl 2 (125/250 EXP using 'experiencia'): ${pct2.percentage}% (Expected: 50%)`);

// Test 3: Standard Level Up
console.log("\n[Test 3] Standard Level Up & Overflow:");
const userMock3 = { level: 1, experience: 80 };
const res1 = addExperienceMock(userMock3, 30); // 80 + 30 = 110, needs 100 to level up
console.log(`Initial: Lvl 1, 80 EXP. Gained: 30 EXP.`);
console.log(`Result: Level Up? ${res1.leveledUp}, New Level: ${res1.newLevel}, Overflow EXP: ${res1.remainingXp} (Expected: Lvl 2, 10 EXP)`);

// Test 4: Multi Level Up
console.log("\n[Test 4] Multi Level Up & Double Overflow:");
const userMock4 = { level: 1, experience: 90 };
const res2 = addExperienceMock(userMock4, 300); // 90 + 300 = 390. Lvl 1 needs 100 (leaves 290). Lvl 2 needs 250 (leaves 40).
console.log(`Initial: Lvl 1, 90 EXP. Gained: 300 EXP.`);
console.log(`Result: Level Up? ${res2.leveledUp}, New Level: ${res2.newLevel}, Overflow EXP: ${res2.remainingXp} (Expected: Lvl 3, 40 EXP)`);

// Test 5: MAX LEVEL clamp
console.log("\n[Test 5] MAX LEVEL clamp:");
const userMock5 = { level: 9, experience: 2400 };
const res3 = addExperienceMock(userMock5, 200); // 2400 + 200 = 2600. Lvl 9 needs 2500 (reaches lvl 10).
console.log(`Initial: Lvl 9, 2400 EXP. Gained: 200 EXP.`);
console.log(`Result: Level Up? ${res3.leveledUp}, New Level: ${res3.newLevel}, Overflow EXP: ${res3.remainingXp} (Expected: Lvl 10, 0 EXP)`);

console.log("\nAll logic tests completed.");
