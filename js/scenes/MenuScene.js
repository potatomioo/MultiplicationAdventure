// Menu Scene - Main menu of the game

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Keep the background image
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'forest_bg')
            .setOrigin(0.5)
            .setScale(this.cameras.main.width / 3000, this.cameras.main.height / 3000)
            .setAlpha(1);
        
        // Add Start.png UI component
        const startUI = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 80,
            'Start'
        ).setScale(1);
        
        // Add NextButton.png as interactive button below
        const nextButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'Nextbutton'
        ).setScale(0.4).setInteractive();
        
        // Add button functionality
        nextButton.on('pointerover', () => {
            nextButton.setScale(0.5);
        });
        
        nextButton.on('pointerout', () => {
            nextButton.setScale(0.4);
        });
        
        nextButton.on('pointerdown', () => {
            // Reset game data
            GameData.reset();
            
            // Start first level intro
            this.scene.start('LevelIntroScene');
        });
        this.createCharacter();
    }
    createCharacter() {
        // Create character in bottom left
        this.character = this.add.sprite(-50, 550, 'slide_1')
            .setScale(0.15);
        
        // Play slide animation to enter screen
        let slideIndex = 1;
        const slideInterval = setInterval(() => {
            this.character.setTexture(`slide_${slideIndex}`);
            slideIndex++;
            
            if (slideIndex > 5) {
                clearInterval(slideInterval);
                
                // After slide completes, play idle animation
                let idleIndex = 1;
                this.idleInterval = setInterval(() => {
                    idleIndex = idleIndex % 10 + 1;
                    this.character.setTexture(`idle_${idleIndex}`);
                }, 100);
            }
        }, 100);
        
        // Move character into view
        this.tweens.add({
            targets: this.character,
            x: 100,
            duration: 600,
            ease: 'Power2'
        });
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
}