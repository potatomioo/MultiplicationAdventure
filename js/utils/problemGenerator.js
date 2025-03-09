// Problem generator utility for different levels

const ProblemGenerator = {
    // Generate a multiplication problem based on the current level
    generateProblem: function(level) {
        const levelData = GameData.levelConfig[level - 1];
        let problem = {};
        
        switch(level) {
            case 1:
                // Basic multiplication facts
                problem = this.generateBasicMultiplication(levelData);
                break;
            case 2:
                // Single digit × 11
                problem = this.generateSingleDigitBy11(levelData);
                break;
            case 3:
                // Two digit × 11
                problem = this.generateTwoDigitBy11(levelData);
                break;
            default:
                // Default to basic multiplication
                problem = this.generateBasicMultiplication(levelData);
        }
        
        return problem;
    },
    
    // Level 1: Basic multiplication
    generateBasicMultiplication: function(levelData) {
        const a = Phaser.Math.Between(levelData.minDigit, levelData.maxDigit);
        const b = Phaser.Math.Between(levelData.minDigit, levelData.maxDigit);
        
        return {
            a: a,
            b: b,
            question: `${a} × ${b} = ?`,
            answer: a * b,
            hint: `Think of ${a} groups with ${b} in each group.`,
            patternExplanation: `Multiplication means repeated addition. ${a} × ${b} means ${a} groups of ${b}, which is ${b} + `.repeat(a > 1 ? a-1 : 1) + `${b} = ${a*b}`
        };
    },
    
    // Level 2: Single digit × 11
    generateSingleDigitBy11: function(levelData) {
        const a = Phaser.Math.Between(levelData.minDigit, levelData.maxDigit);
        
        return {
            a: a,
            b: 11,
            question: `${a} × 11 = ?`,
            answer: a * 11,
            hint: `When you multiply a single digit by 11, the digit appears twice: ${a}${a}`,
            patternExplanation: `When multiplying any single digit (${a}) by 11, the answer will be that digit repeated twice: ${a}${a}`
        };
    },
    
    // Level 3: Two digit × 11
    generateTwoDigitBy11: function(levelData, avoidCarrying = false) {
        let a;
        
        if (avoidCarrying) {
            // Generate a two-digit number where the sum of digits is less than 10
            // to avoid carrying for beginner problems
            do {
                const firstDigit = Phaser.Math.Between(1, 9);
                const secondDigit = Phaser.Math.Between(0, 9 - firstDigit); // Ensure sum < 10
                a = (firstDigit * 10) + secondDigit;
            } while (a < levelData.minDigit || a > levelData.maxDigit);
        } else {
            // Regular two-digit number
            a = Phaser.Math.Between(levelData.minDigit, levelData.maxDigit);
        }
        
        const firstDigit = Math.floor(a / 10);
        const secondDigit = a % 10;
        const middleDigit = firstDigit + secondDigit;
        
        // Check if we need to "carry" the 1
        const needsCarrying = middleDigit >= 10;
        let patternExplanation;
        
        if (needsCarrying) {
            patternExplanation = `For ${a} × 11:\n1. Take first digit: ${firstDigit}\n2. Add digits: ${firstDigit} + ${secondDigit} = ${middleDigit}\n3. Since the sum is ≥ 10, add 1 to first digit: ${firstDigit + 1}\n4. Use the ones place of sum for middle: ${middleDigit % 10}\n5. Last digit: ${secondDigit}\n6. Result: ${(firstDigit + 1)}${middleDigit % 10}${secondDigit}`;
        } else {
            patternExplanation = `For ${a} × 11:\n1. Take first digit: ${firstDigit}\n2. Add the digits for middle: ${firstDigit} + ${secondDigit} = ${middleDigit}\n3. Take last digit: ${secondDigit}\n4. Put them together: ${firstDigit}${middleDigit}${secondDigit}`;
        }
        
        return {
            a: a,
            b: 11,
            question: `${a} × 11 = ?`,
            answer: a * 11,
            hint: needsCarrying 
                ? `Remember to carry the 1 when the sum of digits is 10 or more!`
                : `Pattern: first digit (${firstDigit}), sum of digits (${middleDigit}), last digit (${secondDigit})`,
            patternExplanation: patternExplanation
        };
    }
};