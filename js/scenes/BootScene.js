// Boot Scene - First scene that initializes game settings

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Set up any global game configurations
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Reset game data in case of restart
        GameData.reset();
        
        // Transition to the preload scene
        this.scene.start('PreloadScene');
    }
}