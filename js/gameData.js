// Global game data and configuration

const GameData = {
    score: 0,
    level: 1,
    stars: 0,
    totalLevels: 3,
    playerName: 'Explorer',
    levelConfig: [
        {
            id: 1,
            name: "Forest of Facts",
            description: "Help Alex navigate through the magical forest by solving multiplication problems!",
            backgroundColor: 0xd4f1c5, // Light green for forest
            minDigit: 1,
            maxDigit: 10,
            problemsToSolve: 5,
            timePerProblem: 30,
            focus: "basic multiplication",
            // Animal companion properties
            animalType: "fox",
            animalColor: 0xff6b00,
            animalName: "Felix the Fox",
            animalMessage: "I'll help you practice basic multiplication!"
        },
        {
            id: 2,
            name: "Eleven's Canyon",
            description: "Discover the special pattern of multiplying by 11 to cross the canyon!",
            backgroundColor: 0xffebc2, // Light yellow for canyon
            multiplier: 11,
            minDigit: 1,
            maxDigit: 9,
            problemsToSolve: 5,
            timePerProblem: 30,
            focus: "multiplying by 11 (single digits)",
            // Animal companion properties
            animalType: "eagle",
            animalColor: 0x964B00,
            animalName: "Eddie the Eagle",
            animalMessage: "I'll teach you the secret pattern of multiplying by 11!"
        },
        {
            id: 3,
            name: "Mystic Mountain",
            description: "Climb the mountain using the power of multiplying two-digit numbers by 11!",
            backgroundColor: 0xc2d6ff, // Light blue for mountain
            multiplier: 11,
            minDigit: 10,
            maxDigit: 99,
            problemsToSolve: 5,
            timePerProblem: 45,
            focus: "multiplying by 11 (two digits)",
            // Animal companion properties
            animalType: "owl",
            animalColor: 0x7d5c34,
            animalName: "Oliver the Owl",
            animalMessage: "Ready to master multiplying two-digit numbers by 11?"
        }
    ],
    
    // Reset game data
    reset: function() {
        this.score = 0;
        this.level = 1;
        this.stars = 0;
    }
};