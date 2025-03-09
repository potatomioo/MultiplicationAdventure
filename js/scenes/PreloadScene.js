// Preload Scene - Handles asset loading and generation

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Display loading text
        const loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Loading...', 
            { 
                font: '24px Arial', 
                fill: '#000000' 
            }
        );
        loadingText.setOrigin(0.5);
        
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        // Loading progress events
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x9c42f5, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
        
        // In a real game, we would load assets here
        // Since we're creating everything with code, we'll just simulate loading
        for (let i = 0; i < 100; i++) {
            this.load.spritesheet('dummy' + i, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', { 
                frameWidth: 1, 
                frameHeight: 1 
            });
        }
    }

    create() {
        // Create animal animation data
        this.createAnimationData();
        
        // Start with menu scene
        this.scene.start('MenuScene');
    }
    
    createAnimationData() {
        // Define animal graphics data for later generation
        // This allows us to procedurally generate animal sprites
        
        // Fox data (simple polygon shape data)
        this.game.foxData = {
            body: [
                {x: 0, y: 10}, {x: 20, y: 0}, {x: 40, y: 10},
                {x: 40, y: 30}, {x: 20, y: 40}, {x: 0, y: 30}
            ],
            ears: [
                [{x: 10, y: 5}, {x: 15, y: -5}, {x: 20, y: 5}],
                [{x: 20, y: 5}, {x: 25, y: -5}, {x: 30, y: 5}]
            ],
            tail: [
                {x: 0, y: 20}, {x: -15, y: 15}, {x: -20, y: 5}, {x: -15, y: 0}
            ],
            face: {
                eyes: [{x: 15, y: 15}, {x: 25, y: 15}],
                nose: {x: 20, y: 20},
                mouth: [{x: 15, y: 25}, {x: 20, y: 28}, {x: 25, y: 25}]
            }
        };
        
        // Eagle data
        this.game.eagleData = {
            body: [
                {x: 10, y: 20}, {x: 30, y: 20}, {x: 40, y: 30},
                {x: 30, y: 40}, {x: 10, y: 40}, {x: 0, y: 30}
            ],
            wings: [
                [{x: 0, y: 25}, {x: -15, y: 15}, {x: -5, y: 35}],
                [{x: 40, y: 25}, {x: 55, y: 15}, {x: 45, y: 35}]
            ],
            head: [
                {x: 15, y: 15}, {x: 25, y: 15}, {x: 25, y: 10}, 
                {x: 30, y: 15}, {x: 20, y: 20}, {x: 15, y: 15}
            ],
            face: {
                eyes: [{x: 17, y: 15}, {x: 23, y: 15}],
                beak: [{x: 20, y: 17}, {x: 25, y: 20}, {x: 20, y: 23}]
            }
        };
        
        // Owl data
        this.game.owlData = {
            body: [
                {x: 10, y: 20}, {x: 30, y: 20}, {x: 35, y: 35},
                {x: 20, y: 45}, {x: 5, y: 35}
            ],
            head: [
                {x: 10, y: 15}, {x: 30, y: 15}, {x: 35, y: 5},
                {x: 20, y: 0}, {x: 5, y: 5}
            ],
            ears: [
                [{x: 12, y: 5}, {x: 8, y: -5}, {x: 5, y: 5}],
                [{x: 28, y: 5}, {x: 32, y: -5}, {x: 35, y: 5}]
            ],
            face: {
                eyes: [{x: 15, y: 10}, {x: 25, y: 10}],
                beak: [{x: 18, y: 15}, {x: 20, y: 18}, {x: 22, y: 15}]
            }
        };
    }
}