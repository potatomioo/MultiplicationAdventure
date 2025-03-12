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
        
        // Load background images
        this.load.image('forest_bg', 'assets/backgrounds/forest.jpg');
        this.load.image('canyon_bg', 'assets/backgrounds/canyon.jpg');
        this.load.image('mountain_bg', 'assets/backgrounds/mountain.jpg');
        
        // Load character sprite animations
        // Load Idle animation frames
        for (let i = 1; i <= 10; i++) {
            this.load.image(`idle_${i}`, `assets/characters/Idle (${i}).png`);
        }
        
        // Load Run animation frames
        // In PreloadScene's preload() method:
        for (let i = 1; i <= 8; i++) {
            this.load.image(`run_${i}`, `assets/characters/Run (${i}).png`);
        }
        
        // Load Jump animation frames
        for (let i = 1; i <= 12; i++) {
            this.load.image(`jump_${i}`, `assets/characters/Jump (${i}).png`);
        }
        
        // Load Dead animation frames (for incorrect answers)
        for (let i = 1; i <= 10; i++) {
            this.load.image(`dead_${i}`, `assets/characters/Dead (${i}).png`);
        }
        
        // Load Hurt animation frames (for incorrect answers)
        for (let i = 1; i <= 8; i++) {
            this.load.image(`hurt_${i}`, `assets/characters/Hurt (${i}).png`);
        }
        
        // Load Slide animation frames (can be used for special moves)
        for (let i = 1; i <= 5; i++) {
            this.load.image(`slide_${i}`, `assets/characters/Slide (${i}).png`);
        }
        
        // Load environment objects
        this.load.image('tree1', 'assets/objects/tree1.png');
        this.load.image('tree2', 'assets/objects/tree2.png');
        this.load.image('rock', 'assets/objects/rock.png');
        this.load.image('signpost', 'assets/objects/signpost.png');

        // Load UI assets
        this.load.image('Start', 'assets/ui/Start.png');
        this.load.image('Nextbutton', 'assets/ui/Nextbutton.png');
        this.load.image('Startbutton', 'assets/ui/Startbutton.png');
        this.load.image('CheckButton', 'assets/ui/CheckButton.png');
        this.load.image('Restart', 'assets/ui/Restart.png');
        this.load.image('Fof', 'assets/ui/Fof.png');
        this.load.image('EC', 'assets/ui/EC.png');
        this.load.image('MM', 'assets/ui/MM.png');
        this.load.image('LC', 'assets/ui/LC.png');
        this.load.image('AC', 'assets/ui/AC.png');

        // Load audio
        this.load.audio('click', 'assets/audios/click.mp3');
        this.load.audio('BGMusic', 'assets/audios/BGMusic.mp3');
        this.load.audio('Complete', 'assets/audios/Complete.mp3');
        this.load.audio('CorrectAnswer', 'assets/audios/CorrectAnswer.mp3');
        this.load.audio('Over', 'assets/audios/Over.mp3');
        this.load.audio('WrongAnswer', 'assets/audios/WrongAnswer.mp3');
    }

    create() {
        // Create animations
        this.createAnimations();
        
        // Simulate loading completion with a small delay
        this.time.delayedCall(500, () => {
            // Start with menu scene
            this.scene.start('MenuScene');
        });
    }
    
    createAnimations() {
        // Create character animations from the loaded frames
        
        // Idle animation
        const idleFrames = [];
        for (let i = 1; i <= 10; i++) {
            idleFrames.push({ key: `idle_${i}` });
        }
        
        this.anims.create({
            key: 'idle',
            frames: idleFrames,
            frameRate: 10,
            repeat: -1
        });
        
        // Run animation
        const runFrameNames = [];
        for (let i = 1; i <= 8; i++) {
            runFrameNames.push({ key: `run_${i}` });
        }
        console.log("Run animation frames:", runFrameNames);
        this.anims.create({
            key: 'run',
            frames: runFrameNames,
            frameRate: 12,
            repeat: -1
        });
        
        // Jump animation
        const jumpFrames = [];
        for (let i = 1; i <= 12; i++) {
            jumpFrames.push({ key: `jump_${i}` });
        }
        
        this.anims.create({
            key: 'jump',
            frames: jumpFrames,
            frameRate: 15,
            repeat: 0
        });
        
        // Celebrate animation (using jump frames for now)
        this.anims.create({
            key: 'celebrate',
            frames: jumpFrames.slice(0, 6), // Use first half of jump frames
            frameRate: 8,
            repeat: 1
        });
        
        // Hurt animation
        const hurtFrames = [];
        for (let i = 1; i <= 8; i++) {
            hurtFrames.push({ key: `hurt_${i}` });
        }
        
        this.anims.create({
            key: 'hurt',
            frames: hurtFrames,
            frameRate: 10,
            repeat: 0
        });
    }
}