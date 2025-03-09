// Menu Scene - Main menu of the game

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Create gradient background
        this.createGradientBackground(0x6495ED, 0x4169E1);
        
        // Draw decorative elements
        this.drawDecorations();
        
        // Title text
        this.add.text(
            this.cameras.main.width / 2, 
            100, 
            'Multiplication Adventure', 
            { 
                font: '48px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        // Create start button
        const startButton = this.add.rectangle(
            this.cameras.main.width / 2,
            300,
            200,
            60,
            0x4CAF50
        ).setInteractive();
        
        // Add button text
        const startText = this.add.text(
            this.cameras.main.width / 2, 
            300, 
            'Start Adventure', 
            { 
                font: '24px Arial',
                fill: '#ffffff' 
            }
        ).setOrigin(0.5);
        
        // Make button interactive
        startButton.on('pointerover', () => {
            startButton.fillColor = 0x3E8E41;
        });
        startButton.on('pointerout', () => {
            startButton.fillColor = 0x4CAF50;
        });
        startButton.on('pointerdown', () => {
            // Reset game data
            GameData.reset();
            
            // Start first level intro
            this.scene.start('LevelIntroScene');
        });
        
        // Add instructions
        this.add.text(
            this.cameras.main.width / 2, 
            450, 
            'Learn multiplication while exploring magical lands!', 
            { 
                font: '20px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        // Add level preview cards
        this.createLevelPreviews();
        
        // Add animated character
        this.createCharacter();
    }
    
    createGradientBackground(color1, color2) {
        // Create a gradient background using graphics
        const background = this.add.graphics();
        
        // Fill with gradient
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
    
    drawDecorations() {
        // Draw some decorative math symbols in the background
        const symbols = ['×', '+', '=', '11', '2', '3', '4', '5'];
        const graphics = this.add.graphics();
        
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 550);
            const symbol = symbols[Phaser.Math.Between(0, symbols.length - 1)];
            const size = Phaser.Math.Between(16, 32);
            const rotation = Phaser.Math.FloatBetween(-0.3, 0.3);
            
            this.add.text(x, y, symbol, {
                font: `${size}px Arial`,
                fill: 'rgba(255, 255, 255, 0.2)'
            }).setOrigin(0.5).setRotation(rotation);
        }
    }
    
    createLevelPreviews() {
        const xPositions = [200, 400, 600];
        
        for (let i = 0; i < GameData.levelConfig.length; i++) {
            const level = GameData.levelConfig[i];
            
            // Create card background
            const card = this.add.rectangle(
                xPositions[i],
                380,
                150,
                100,
                level.backgroundColor,
                0.7
            );
            card.setStrokeStyle(2, 0xffffff);
            
            // Add level name
            this.add.text(
                xPositions[i],
                360,
                level.name,
                {
                    font: '16px Arial',
                    fill: '#000000'
                }
            ).setOrigin(0.5);
            
            // Add level focus
            this.add.text(
                xPositions[i],
                390,
                level.focus,
                {
                    font: '12px Arial',
                    fill: '#333333',
                    wordWrap: { width: 130 }
                }
            ).setOrigin(0.5);
        }
    }
    
    createCharacter() {
        // Create a simple animated character
        const character = this.add.circle(100, 500, 20, 0xFF0000);
        
        // Add eyes and smile to make it look like a character
        const leftEye = this.add.circle(93, 493, 4, 0x000000);
        const rightEye = this.add.circle(107, 493, 4, 0x000000);
        
        // Create smile using arc
        const smile = this.add.graphics();
        smile.lineStyle(2, 0x000000, 1);
        smile.beginPath();
        smile.arc(100, 500, 12, 0.2, Math.PI - 0.2, false);
        smile.strokePath();
        
        // Group all parts together
        const characterGroup = this.add.group([character, leftEye, rightEye, smile]);
        
        // Add simple animation
        this.tweens.add({
            targets: characterGroup.getChildren(),
            y: '-=20',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}