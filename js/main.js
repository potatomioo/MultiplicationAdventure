// Main game initialization

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#f0f8ff',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        MenuScene,
        LevelIntroScene,
        GameScene,
        LevelCompleteScene,
        GameCompleteScene
    ]
};

// Initialize the game
const game = new Phaser.Game(config);