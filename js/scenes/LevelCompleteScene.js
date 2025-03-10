// Level Complete Scene - Shown after completing a level

class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    create() {
        const completedLevelData = GameData.levelConfig[GameData.level - 1];
        const nextLevelData = GameData.levelConfig[GameData.level];
        
        // Add a more interesting gradient background instead of a solid color
        this.createGradientBackground(0x4a90e2, 0x8e44ad); // Blue to purple gradient
        
        // Add animated background elements
        this.createBackgroundElements();
        
        // Add a more visually appealing celebration panel with rounded corners and better styling
        const panel = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            550,
            450,
            0xFFFFFF,
            0.9
        ).setStrokeStyle(8, 0x4a90e2);
        
        // Add a trophy or achievement icon above the text
        this.add.circle(
            this.cameras.main.width / 2,
            120,
            40,
            0xFFD700 // Gold color
        );
        
        // Draw a simple trophy shape
        const trophy = this.add.graphics();
        trophy.fillStyle(0xFFD700);
        trophy.fillRect(this.cameras.main.width / 2 - 15, 90, 30, 40);
        trophy.fillStyle(0xFFD700);
        trophy.fillCircle(this.cameras.main.width / 2, 90, 20);
        trophy.fillStyle(0xFFD700);
        trophy.fillRect(this.cameras.main.width / 2 - 25, 130, 50, 10);
        
        // Add level complete text with better styling
        this.add.text(
            this.cameras.main.width / 2, 
            180, 
            'Level Complete!', 
            { 
                font: 'bold 48px Arial',
                fill: '#4a90e2',
                stroke: '#ffffff',
                strokeThickness: 6,
                shadow: { color: '#000000', blur: 10, stroke: true, fill: true }
            }
        ).setOrigin(0.5);
        
        // Create more visually appealing stars
        this.createEnhancedStarsDisplay();
        
        // Show score with animation
        this.animateScoreCounter();
        
        // Show what you've learned section with better styling
        this.createEnhancedLearnedSection(completedLevelData);
        
        // Show next level preview with better styling
        this.createEnhancedNextLevelPreview(nextLevelData);
        
        // Add continue button with better design
        const continueButton = this.add.rectangle(
            this.cameras.main.width / 2,
            550, // Changed from 500 to 550
            200,
            60,
            0x4CAF50
        ).setInteractive();
        
        // Add a glow effect to the button
        const buttonGlow = this.add.graphics();
        buttonGlow.fillStyle(0x4CAF50, 0.3);
        buttonGlow.fillCircle(this.cameras.main.width / 2, 550, 40); // Changed from 500 to 550
        
        this.add.text(
            this.cameras.main.width / 2, 
            550, // Changed from 500 to 550
            'Continue', 
            { 
                font: 'bold 24px Arial',
                fill: '#ffffff',
                shadow: { color: '#000000', blur: 2, offsetY: 2 }
            }
        ).setOrigin(0.5);
        
        // Make button interactive with more feedback
        continueButton.on('pointerover', () => {
            continueButton.fillColor = 0x3E8E41;
            continueButton.setScale(1.1);
        });
        continueButton.on('pointerout', () => {
            continueButton.fillColor = 0x4CAF50;
            continueButton.setScale(1.0);
        });
        continueButton.on('pointerdown', () => {
            // Add click effect
            this.tweens.add({
                targets: continueButton,
                scale: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    GameData.level++;
                    this.scene.start('LevelIntroScene');
                }
            });
        });
    }
    
    createCelebrationEffects() {
        // Create some celebratory effects around the screen
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 300, () => {
                const x = Phaser.Math.Between(100, 700);
                const y = Phaser.Math.Between(100, 500);
                
                // Create burst effect
                const burst = this.add.circle(x, y, 5, 0xFFD700);
                
                this.tweens.add({
                    targets: burst,
                    scale: { from: 0, to: 20 },
                    alpha: { from: 1, to: 0 },
                    duration: 1000,
                    ease: 'Quad.out',
                    onComplete: () => {
                        burst.destroy();
                    }
                });
            });
        }
        
        // Add confetti-like particles at the top
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(100, 700);
            const confetti = this.add.rectangle(
                x, 
                -20, 
                Phaser.Math.Between(5, 15),
                Phaser.Math.Between(5, 15),
                Phaser.Math.Between(0x000000, 0xFFFFFF)
            );
            
            this.tweens.add({
                targets: confetti,
                y: 700,
                x: x + Phaser.Math.Between(-100, 100),
                rotation: Phaser.Math.Between(0, 6.28),
                duration: Phaser.Math.Between(3000, 6000),
                delay: Phaser.Math.Between(0, 2000),
                ease: 'Quad.in'
            });
        }
    }
    
    createStarsDisplay() {
        // Create stars display showing how many were earned
        const totalProblems = GameData.levelConfig[GameData.level - 1].problemsToSolve;
        const centerX = this.cameras.main.width / 2;
        
        for (let i = 0; i < totalProblems; i++) {
            const xPos = centerX - ((totalProblems - 1) * 25) + (i * 50);
            
            // Use circle shapes instead of stars to avoid tint issues
            const star = this.add.circle(
                xPos, 
                200, 
                15, 
                i < GameData.stars ? 0xFFD700 : 0xCCCCCC
            );
            
            if (i < GameData.stars) {
                // Animate earned stars
                this.tweens.add({
                    targets: star,
                    scale: { from: 0, to: 1 },
                    duration: 500,
                    delay: i * 200,
                    ease: 'Back.out'
                });
            }
        }
    }    
    
    createLearnedSection(levelData) {
        // Add a box showing what the player learned in this level
        const learnedBox = this.add.rectangle(
            this.cameras.main.width / 2,
            325,
            400,
            80,
            0xf5f5f5
        );
        learnedBox.setStrokeStyle(2, 0x333333);
        
        this.add.text(
            this.cameras.main.width / 2, 
            300, 
            'What You Learned:', 
            { 
                font: '20px Arial',
                fill: '#333333',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        let learnedText = '';
        if (GameData.level === 1) {
            learnedText = 'Basic multiplication facts and strategies';
        } else if (GameData.level === 2) {
            learnedText = 'The pattern for multiplying single digits by 11';
        } else {
            learnedText = 'The pattern for multiplying two-digit numbers by 11';
        }
        
        this.add.text(
            this.cameras.main.width / 2, 
            335, 
            learnedText, 
            { 
                font: '18px Arial',
                fill: '#333333',
                wordWrap: { width: 380 }
            }
        ).setOrigin(0.5);
    }
    
    createNextLevelPreview(nextLevelData) {
        if (!nextLevelData) return; // No next level if we're at the end
        
        // Add a preview of the next level
        this.add.text(
            this.cameras.main.width / 2, 
            400, 
            'Next Level:', 
            { 
                font: '20px Arial',
                fill: '#333333',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            430, 
            nextLevelData.name, 
            { 
                font: '24px Arial',
                fill: '#4a90e2'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            460, 
            nextLevelData.focus, 
            { 
                font: '16px Arial',
                fill: '#666666',
                fontStyle: 'italic'
            }
        ).setOrigin(0.5);
    }
    createGradientBackground(color1, color2) {
        // Create a gradient background
        const background = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        for(let y = 0; y < height; y++) {
            const t = y / height;
            const r = Phaser.Math.Interpolation.Linear([((color1 >> 16) & 0xFF), ((color2 >> 16) & 0xFF)], t);
            const g = Phaser.Math.Interpolation.Linear([((color1 >> 8) & 0xFF), ((color2 >> 8) & 0xFF)], t);
            const b = Phaser.Math.Interpolation.Linear([((color1) & 0xFF), ((color2) & 0xFF)], t);
            
            const color = Phaser.Display.Color.GetColor(r, g, b);
            
            background.fillStyle(color, 1);
            background.fillRect(0, y, width, 1);
        }
    }
    
    createBackgroundElements() {
        // Add floating confetti and celebration elements
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 550);
            const size = Phaser.Math.Between(5, 15);
            const colors = [0xFF5252, 0x2196F3, 0xFFEB3B, 0x4CAF50, 0x9C27B0, 0xFF9800];
            const color = Phaser.Math.RND.pick(colors);
            
            // Randomly choose between circle, square, or triangle shapes
            let shape;
            const shapeType = Phaser.Math.Between(1, 3);
            
            if (shapeType === 1) {
                shape = this.add.circle(x, y, size / 2, color);
            } else if (shapeType === 2) {
                shape = this.add.rectangle(x, y, size, size, color);
            } else {
                shape = this.add.triangle(x, y, 0, size, size / 2, -size, size, size, color);
            }
            
            // Add floating animation
            this.tweens.add({
                targets: shape,
                y: y + Phaser.Math.Between(-30, 30),
                x: x + Phaser.Math.Between(-30, 30),
                rotation: Phaser.Math.FloatBetween(-0.1, 0.1),
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createEnhancedStarsDisplay() {
        // Create stars display showing how many were earned
        const totalProblems = GameData.levelConfig[GameData.level - 1].problemsToSolve;
        const centerX = this.cameras.main.width / 2;
        
        for (let i = 0; i < totalProblems; i++) {
            const xPos = centerX - ((totalProblems - 1) * 30) + (i * 60);
            
            // Add star glow for earned stars
            if (i < GameData.stars) {
                const glow = this.add.circle(xPos, 230, 25, 0xFFD700, 0.3);
                this.tweens.add({
                    targets: glow,
                    scale: 1.3,
                    alpha: 0.1,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1
                });
            }
            
            // Use circle shapes instead of stars to avoid tint issues
            const star = this.add.circle(
                xPos, 
                230, 
                20, 
                i < GameData.stars ? 0xFFD700 : 0xCCCCCC
            );
            
            if (i < GameData.stars) {
                // Animate earned stars with more impressive animation
                this.tweens.add({
                    targets: star,
                    scale: { from: 0, to: 1 },
                    rotation: { from: 0, to: Math.PI * 2 },
                    duration: 800,
                    delay: i * 200,
                    ease: 'Back.out'
                });
            }
        }
    }
    
    animateScoreCounter() {
        // Animate counting up the score for more visual interest
        const scoreText = this.add.text(
            this.cameras.main.width / 2, 
            290, 
            'Score: 0', 
            { 
                font: 'bold 36px Arial',
                fill: '#333333',
                stroke: '#ffffff',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        let currentScore = 0;
        const targetScore = GameData.score;
        const duration = 1500; // 1.5 seconds
        const stepTime = 20; // Update every 20ms
        
        const steps = duration / stepTime;
        const scoreIncrement = targetScore / steps;
        
        const scoreInterval = this.time.addEvent({
            delay: stepTime,
            callback: () => {
                currentScore = Math.min(currentScore + scoreIncrement, targetScore);
                scoreText.setText(`Score: ${Math.round(currentScore)}`);
                
                if (currentScore >= targetScore) {
                    scoreInterval.remove();
                    
                    // Add a little bounce animation once complete
                    this.tweens.add({
                        targets: scoreText,
                        scale: 1.2,
                        duration: 200,
                        yoyo: true
                    });
                }
            },
            callbackScope: this,
            repeat: steps
        });
    }
    
    createEnhancedLearnedSection(levelData) {
        // Add a more visually appealing "What You Learned" box
        const learnedBox = this.add.rectangle(
            this.cameras.main.width / 2,
            370,
            450,
            100,
            0xf8f9fa
        ).setStrokeStyle(3, 0x4a90e2);
        
        
        // Add a small icon
        const iconCircle = this.add.circle(
            this.cameras.main.width / 2 - 180, 
            370, 
            25, 
            0x4a90e2
        );
        
        // Draw a lightbulb icon
        const bulb = this.add.graphics();
        bulb.fillStyle(0xffffff);
        bulb.fillCircle(this.cameras.main.width / 2 - 180, 365, 12);
        bulb.fillRect(this.cameras.main.width / 2 - 183, 375, 6, 10);
        
        this.add.text(
            this.cameras.main.width / 2 - 140, 
            345, 
            'What You Learned:', 
            { 
                font: 'bold 22px Arial',
                fill: '#4a90e2'
            }
        ).setOrigin(0, 0.5);
        
        let learnedText = '';
        if (GameData.level === 1) {
            learnedText = 'Basic multiplication facts and strategies';
        } else if (GameData.level === 2) {
            learnedText = 'The pattern for multiplying single digits by 11';
        } else {
            learnedText = 'The pattern for multiplying two-digit numbers by 11';
        }
        
        this.add.text(
            this.cameras.main.width / 2, 
            385, 
            learnedText, 
            { 
                font: '20px Arial',
                fill: '#333333',
                wordWrap: { width: 380 }
            }
        ).setOrigin(0.5);
    }
    
    createEnhancedNextLevelPreview(nextLevelData) {
        if (!nextLevelData) return; // No next level if we're at the end
        
        // Add a preview of the next level with better styling
        this.add.text(
            this.cameras.main.width / 2, 
            440, 
            'Next Level:', 
            { 
                font: 'bold 22px Arial',
                fill: '#333333'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            470, 
            nextLevelData.name, 
            { 
                font: 'bold 28px Arial',
                fill: '#4a90e2',
                stroke: '#ffffff',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            495, // Changed from 500 to 495 to avoid overlap
            nextLevelData.focus, 
            { 
                font: 'italic 18px Arial',
                fill: '#666666'
            }
        ).setOrigin(0.5);
    }
}