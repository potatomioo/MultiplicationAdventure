class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Set up any global game configurations
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Transition to the preload scene
        this.scene.start('PreloadScene');
    }
}