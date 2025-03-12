// Level Intro Scene - Introduces each level

class LevelIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelIntroScene' });
    }

    create() {
        const levelData = GameData.levelConfig[GameData.level - 1];
        
        // Set background based on level
        let backgroundKey;
        if (GameData.level === 1) backgroundKey = 'forest_bg';
        else if (GameData.level === 2) backgroundKey = 'canyon_bg';
        else backgroundKey = 'mountain_bg';
        
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, backgroundKey)
            .setOrigin(0.5)
            .setScale(this.cameras.main.width / 3000, this.cameras.main.height / 3000);
        
        // Add appropriate level UI based on level
        let levelUI;
        if (GameData.level === 1) {
            levelUI = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 80, 'Fof').setScale(1);
        } else if (GameData.level === 2) {
            levelUI = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 80, 'EC').setScale(1);
        } else {
            levelUI = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 80, 'MM').setScale(1);
        }
        
        // Add StartButton
        const startButton = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'Startbutton'
        ).setScale(0.4).setInteractive();
        
        // Add button functionality
        startButton.on('pointerover', () => {
            startButton.setScale(0.5);
        });
        
        startButton.on('pointerout', () => {
            startButton.setScale(0.4);
        });
        
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
    
    createLevelDecorations(levelData) {
        const graphics = this.add.graphics();
        
        // Add different decorations based on level theme
        if (GameData.level === 1) { // Forest
            // Draw trees
            for (let i = 0; i < 10; i++) {
                const x = Phaser.Math.Between(50, 750);
                const y = Phaser.Math.Between(400, 550);
                this.drawTree(graphics, x, y);
            }
        } else if (GameData.level === 2) { // Canyon
            // Draw canyon
            graphics.fillStyle(0xC19A6B);
            graphics.fillRect(0, 350, 800, 250);
            
            // Draw canyon layers
            graphics.fillStyle(0xA57C52);
            graphics.fillRect(0, 400, 800, 50);
            graphics.fillStyle(0x8B5A2B);
            graphics.fillRect(0, 450, 800, 50);
            graphics.fillStyle(0x6B4226);
            graphics.fillRect(0, 500, 800, 100);
            
            // Draw some rocks
            for (let i = 0; i < 8; i++) {
                const x = Phaser.Math.Between(50, 750);
                const y = Phaser.Math.Between(370, 420);
                const size = Phaser.Math.Between(15, 40);
                graphics.fillStyle(0x808080);
                graphics.fillCircle(x, y, size);
            }
        } else if (GameData.level === 3) { // Mountain
            // Draw mountains in the background
            graphics.fillStyle(0x8B98B5);
            
            // Left mountain
            graphics.beginPath();
            graphics.moveTo(0, 550);
            graphics.lineTo(200, 350);
            graphics.lineTo(400, 550);
            graphics.closePath();
            graphics.fill();
            
            // Right mountain
            graphics.fillStyle(0x7988A5);
            graphics.beginPath();
            graphics.moveTo(400, 550);
            graphics.lineTo(600, 300);
            graphics.lineTo(800, 550);
            graphics.closePath();
            graphics.fill();
            
            // Snow caps
            graphics.fillStyle(0xFFFFFF);
            graphics.beginPath();
            graphics.moveTo(170, 370);
            graphics.lineTo(200, 350);
            graphics.lineTo(230, 370);
            graphics.closePath();
            graphics.fill();
            
            graphics.beginPath();
            graphics.moveTo(570, 320);
            graphics.lineTo(600, 300);
            graphics.lineTo(630, 320);
            graphics.closePath();
            graphics.fill();
        }
    }
    
    drawTree(graphics, x, y) {
        // Draw tree trunk
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(x - 5, y - 30, 10, 30);
        
        // Draw tree leaves
        graphics.fillStyle(0x228B22);
        graphics.fillCircle(x, y - 40, 20);
        graphics.fillCircle(x - 10, y - 50, 15);
        graphics.fillCircle(x + 10, y - 50, 15);
        graphics.fillCircle(x, y - 60, 15);
    }
    
    createAnimalGuide(levelData) {
        const graphics = this.add.graphics();
        let animalGroup;
        
        // Create animal based on level
        if (GameData.level === 1) {
            // Create fox guide
            animalGroup = this.createFox(200, 300, levelData.animalColor);
            
        } else if (GameData.level === 2) {
            // Create eagle guide
            animalGroup = this.createEagle(600, 400, levelData.animalColor);
        } else {
            // Create owl guide
            animalGroup = this.createOwl(600, 400, levelData.animalColor);
        }
        
        // Add speech bubble with message
        this.createSpeechBubble(450, 350, 300, 80, levelData.animalMessage);
        
        // Add simple animation to the animal
        this.tweens.add({
            targets: animalGroup.getChildren(),
            y: '-=10',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createFox(x, y, color) {
        const foxParts = [];
        const graphics = this.add.graphics();
        
        // Draw body
        graphics.fillStyle(color);
        graphics.beginPath();
        graphics.moveTo(x - 20, y - 10);
        graphics.lineTo(x + 20, y - 10);
        graphics.lineTo(x + 20, y + 10);
        graphics.lineTo(x - 20, y + 10);
        graphics.closePath();
        graphics.fill();
        foxParts.push(graphics);
        
        // Draw head
        const head = this.add.circle(x, y - 20, 15, color);
        foxParts.push(head);
        
        // Draw ears
        const leftEar = this.add.triangle(x - 10, y - 30, 0, 0, -10, -15, 5, -10, color);
        const rightEar = this.add.triangle(x + 10, y - 30, 0, 0, 10, -15, -5, -10, color);
        foxParts.push(leftEar, rightEar);
        
        // Draw face
        const leftEye = this.add.circle(x - 5, y - 22, 2, 0x000000);
        const rightEye = this.add.circle(x + 5, y - 22, 2, 0x000000);
        const nose = this.add.circle(x, y - 17, 3, 0x000000);
        foxParts.push(leftEye, rightEye, nose);
        
        // Draw tail
        const tail = this.add.triangle(x - 30, y, 0, 0, -20, -10, -15, 10, color);
        foxParts.push(tail);
        
        return this.add.group(foxParts);
    }
    
    createEagle(x, y, color) {
        const eagleParts = [];
        const graphics = this.add.graphics();
        
        // Draw body
        graphics.fillStyle(color);
        graphics.beginPath();
        graphics.moveTo(x - 15, y);
        graphics.lineTo(x + 15, y);
        graphics.lineTo(x + 10, y + 20);
        graphics.lineTo(x - 10, y + 20);
        graphics.closePath();
        graphics.fill();
        eagleParts.push(graphics);
        
        // Draw head
        const head = this.add.circle(x, y - 10, 12, color);
        eagleParts.push(head);
        
        // Draw wings
        const leftWing = this.add.triangle(x - 25, y, 0, 0, -20, -15, -5, 15, color);
        const rightWing = this.add.triangle(x + 25, y, 0, 0, 20, -15, 5, 15, color);
        eagleParts.push(leftWing, rightWing);
        
        // Draw face
        const leftEye = this.add.circle(x - 5, y - 12, 2, 0x000000);
        const rightEye = this.add.circle(x + 5, y - 12, 2, 0x000000);
        
        // Draw beak
        const beak = this.add.triangle(x, y - 5, 0, 0, -5, 5, 5, 5, 0xFFA500);
        eagleParts.push(leftEye, rightEye, beak);
        
        return this.add.group(eagleParts);
    }
    
    createOwl(x, y, color) {
        const owlParts = [];
        const graphics = this.add.graphics();
        
        // Draw body
        graphics.fillStyle(color);
        graphics.beginPath();
        graphics.moveTo(x - 20, y);
        graphics.lineTo(x + 20, y);
        graphics.lineTo(x + 15, y + 30);
        graphics.lineTo(x - 15, y + 30);
        graphics.closePath();
        graphics.fill();
        owlParts.push(graphics);
        
        // Draw head
        const head = this.add.circle(x, y - 10, 20, color);
        owlParts.push(head);
        
        // Draw ears/tufts
        const leftEar = this.add.triangle(x - 10, y - 25, 0, 0, -10, -15, 5, -5, color);
        const rightEar = this.add.triangle(x + 10, y - 25, 0, 0, 10, -15, -5, -5, color);
        owlParts.push(leftEar, rightEar);
        
        // Draw face
        const leftEye = this.add.circle(x - 8, y - 10, 6, 0xFFFFFF);
        const leftPupil = this.add.circle(x - 8, y - 10, 3, 0x000000);
        const rightEye = this.add.circle(x + 8, y - 10, 6, 0xFFFFFF);
        const rightPupil = this.add.circle(x + 8, y - 10, 3, 0x000000);
        
        // Draw beak
        const beak = this.add.triangle(x, y, 0, 0, -5, 5, 5, 5, 0xFFA500);
        owlParts.push(leftEye, leftPupil, rightEye, rightPupil, beak);
        
        return this.add.group(owlParts);
    }
    
    createSpeechBubble(x, y, width, height, quote) {
        const bubbleWidth = width;
        const bubbleHeight = height;
        const bubblePadding = 10;
        const arrowHeight = 20;
        
        // Speech bubble background
        const bubble = this.add.graphics({ x: x, y: y });
        bubble.fillStyle(0xffffff, 1);
        bubble.lineStyle(4, 0x565656, 1);
        
        // Bubble shadow
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);
        
        // Bubble body
        bubble.fillStyle(0xffffff, 1);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        
        // Bubble stroke
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        
        // Bubble arrow
        bubble.fillStyle(0xffffff, 1);
        bubble.lineStyle(4, 0x565656, 1);
        bubble.beginPath();
        bubble.moveTo(bubbleWidth - 40, bubbleHeight);
        bubble.lineTo(bubbleWidth, bubbleHeight + arrowHeight);
        bubble.lineTo(bubbleWidth - 20, bubbleHeight);
        bubble.closePath();
        bubble.fillPath();
        bubble.strokePath();
        
        // Add quote text
        this.add.text(
            x + bubblePadding, 
            y + bubblePadding, 
            quote, 
            { 
                font: '16px Arial',
                fill: '#000000',
                wordWrap: { width: bubbleWidth - (bubblePadding * 2) } 
            }
        );
    }
}