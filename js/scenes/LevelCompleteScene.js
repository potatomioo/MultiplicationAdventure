// Level Complete Scene - Shown after completing a level

class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    create() {
        const completedLevelData = GameData.levelConfig[GameData.level - 1];
        const nextLevelData = GameData.levelConfig[GameData.level];
        
        // Add background based on completed level
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            completedLevelData.backgroundColor
        );
        
        // Add overlay to darken background
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.5
        );
        
        // Add celebration panel
        const panel = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            500,
            400,
            0xFFFFFF,
            0.9
        );
        panel.setStrokeStyle(4, 0x4a90e2);
        
        // Add level complete text
        this.add.text(
            this.cameras.main.width / 2, 
            150, 
            'Level Complete!', 
            { 
                font: '48px Arial',
                fill: '#4a90e2',
                stroke: '#000000',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        
        // Create celebration particles
        this.createCelebrationEffects();
        
        // Add stars earned
        this.createStarsDisplay();
        
        // Show score
        this.add.text(
            this.cameras.main.width / 2, 
            250, 
            `Score: ${GameData.score}`, 
            { 
                font: '32px Arial',
                fill: '#333333'
            }
        ).setOrigin(0.5);
        
        // Show what you've learned section
        this.createLearnedSection(completedLevelData);
        
        // Show next level preview
        this.createNextLevelPreview(nextLevelData);
        
        // Add continue button
        const continueButton = this.add.rectangle(
            this.cameras.main.width / 2,
            500,
            200,
            60,
            0x4CAF50
        ).setInteractive();
        
        this.add.text(
            this.cameras.main.width / 2, 
            500, 
            'Continue', 
            { 
                font: '24px Arial',
                fill: '#ffffff' 
            }
        ).setOrigin(0.5);
        
        // Make button interactive
        continueButton.on('pointerover', () => {
            continueButton.fillColor = 0x3E8E41;
        });
        continueButton.on('pointerout', () => {
            continueButton.fillColor = 0x4CAF50;
        });
        continueButton.on('pointerdown', () => {
            GameData.level++;
            this.scene.start('LevelIntroScene');
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
}