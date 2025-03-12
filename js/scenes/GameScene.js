// Game Scene - Main gameplay scene

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.currentProblem = null;
        this.userAnswer = '';
        this.problemsSolved = 0;
        this.timeLeft = 0;
        this.timer = null;
        this.characterPosition = 0;
        this.showingHint = false;
        this.allowInput = true;
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
            .setScale(this.cameras.main.width / 3000, this.cameras.main.height / 3000); // Adjust scale to fit screen
        
        // Add environment objects based on level theme
        this.createEnvironment();
        
        // Add UI panel for problem
        this.problemPanel = this.add.rectangle(
            this.cameras.main.width / 2,
            150,
            400,
            200,
            0xFFFFFF,
            0.8
        );
        this.problemPanel.setStrokeStyle(2, 0x000000);
        
        // Add path for character to walk on
        this.createPath();
        
        // Add character at start of path
        this.createCharacter();
        
        // Add finish flag
        this.createFinishFlag();
        
        // Create UI elements
        this.createUI();
        
        // Add animal helper based on level (small version)
        this.createAnimalHelper(levelData);
        
        // Generate first problem
        this.generateProblem();
        
        // Start timer
        this.timeLeft = levelData.timePerProblem;
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        
        // Setup keyboard input for numbers
        this.input.keyboard.on('keydown', this.handleKeyInput, this);

        this.debugTextureKeys();
    }
    
    createEnvironment() {
        if (GameData.level === 1) { // Forest
            for (let i = 0; i < 3; i++) {
                this.add.image(100 + (i * 250), 380, 'tree1').setScale(0.3);
            }
            for (let i = 0; i < 2; i++) {
                this.add.image(200 + (i * 300), 390, 'tree2').setScale(0.25);
            }
            this.add.image(700, 420, 'rock').setScale(0.2);
        } else if (GameData.level === 2) { // Canyon
            for (let i = 0; i < 4; i++) {
                this.add.image(150 + (i * 200), 420, 'rock').setScale(0.2 + (i * 0.05));
            }
            this.add.image(700, 380, 'signpost').setScale(0.3);
        } else { // Mountain
            this.add.image(200, 380, 'tree1').setScale(0.2);
            for (let i = 0; i < 3; i++) {
                this.add.image(300 + (i * 150), 420, 'rock').setScale(0.3 - (i * 0.05));
            }
        }
    }
    
    createCharacter() {
        // Create the character with animations
        this.character = this.add.sprite(120, 435, 'idle_1')
            .setScale(0.15); // Adjust scale to match your sprite size
        
        // Check if animations exist
        console.log("Available animations:", this.anims.anims.entries);
        
        // Start with idle animation
        if (this.anims.exists('idle')) {
            this.character.anims.play('idle');
        } else {
            console.error("Idle animation not found!");
            // Use a static frame as fallback
            this.character.setTexture('idle_1');
        }
        
        // Group all parts for movement
        this.characterGroup = this.add.group([this.character]);
        
        // Add simple idle animation
        this.idleAnimation = this.tweens.add({
            targets: this.characterGroup.getChildren(),
            y: '-=3',
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    moveCharacter() {
        // Stop idle animation and tween
        if (this.idleAnimation) {
            this.idleAnimation.stop();
        }
        
        // Calculate position increment
        const totalProblems = GameData.levelConfig[GameData.level - 1].problemsToSolve;
        const increment = 580 / totalProblems;
        this.characterPosition += increment;
        
        // Extremely simple approach - just show ONE run frame during movement
        // This will at least verify if the texture exists and can be displayed
        this.character.setTexture('idle_1'); // First use a known working texture
        
        // After a brief delay, try to set the run texture
        this.time.delayedCall(100, () => {
            console.log("About to set run_1 texture...");
            try {
                // Try setting the run texture with a bigger scale to make it more visible
                this.character.setTexture('run_1').setScale(0.2);
                console.log("Run texture set successfully");
            } catch (e) {
                console.error("Failed to set run texture:", e);
            }
        });
        
        // Move character
        this.tweens.add({
            targets: this.character,
            x: this.character.x + increment,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                console.log("Movement complete");
                // Return to idle
                this.character.setTexture('idle_1').setScale(0.15);
                
                // Show celebration effect
                this.showCelebrationEffect();
                
                // Restart idle animation
                this.idleAnimation = this.tweens.add({
                    targets: this.character,
                    y: '-=3',
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Show pattern explanation
                this.showPatternExplanation();
            }
        });
    }
    
    // Also fix this animation reference in showIncorrectAnimation
    showIncorrectAnimation() {
        // Play hurt animation
        this.character.anims.play('hurt');
        
        // Return to idle after animation completes
        this.time.delayedCall(800, () => {
            this.character.anims.play('idle');
        });
    }
    
    // Modify checkAnswer to use the hurt animation
    // Modify checkAnswer to use the hurt animation
checkAnswer() {
    if (this.userAnswer === '') {
        this.feedbackText.setText('Please enter an answer!');
        this.feedbackText.setFill('#ff0000');
        this.feedbackText.setVisible(true);
        return;
    }
    
    const userNum = parseInt(this.userAnswer);
    
    if (userNum === this.currentProblem.answer) {
        // Correct answer
        this.feedbackText.setText('Correct! 🎉');
        this.feedbackText.setFill('#00aa00');
        this.feedbackText.setVisible(true);
        
        // Update score
        GameData.score += 10 + GameData.level * 5;
        this.scoreText.setText(`Score: ${GameData.score}`);
        
        // Update stars
        this.problemsSolved++;
        GameData.stars = this.problemsSolved;
        
        // Update star visuals
        const stars = this.starsGroup.getChildren();
        if (stars[this.problemsSolved - 1]) {
            stars[this.problemsSolved - 1].fillColor = 0xFFD700;
            
            // Add a little animation to the star
            this.tweens.add({
                targets: stars[this.problemsSolved - 1],
                scale: { from: 1, to: 1.5 },
                duration: 300,
                yoyo: true,
                onComplete: () => {
                    stars[this.problemsSolved - 1].setScale(1);
                }
            });
        }
        
        // Temporarily disable input
        this.allowInput = false;
        
        // Move character forward
        this.moveCharacter();
        
        // Check if level is complete
        if (this.problemsSolved >= GameData.levelConfig[GameData.level - 1].problemsToSolve) {
            // Stop timer
            if (this.timer) {
                this.timer.remove();
            }
            
            // Wait a moment before transitioning
            this.time.delayedCall(2000, () => {
                // Check if this is the last level
                if (GameData.level >= GameData.totalLevels) {
                    this.scene.start('GameCompleteScene');
                } else {
                    this.scene.start('LevelCompleteScene');
                }
            });
        } else {
            // Continue to next problem after a delay
            this.time.delayedCall(2000, () => {
                this.allowInput = true;
                this.generateProblem();
            });
        }
    } else {
        // Incorrect answer with animation
        this.feedbackText.setText('Try again!');
        this.feedbackText.setFill('#ff0000');
        this.feedbackText.setVisible(true);
        
        // Show hurt animation
        this.showIncorrectAnimation();
        
        // Show hint button after first attempt
        this.hintButton.setVisible(true);
        
        // Clear answer
        this.userAnswer = '';
        this.updateAnswerDisplay();
    }
}
    
    drawTree(graphics, x, y, scale = 1) {
        // Draw tree trunk
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(x - (5 * scale), y - (30 * scale), 10 * scale, 30 * scale);
        
        // Draw tree leaves
        graphics.fillStyle(0x228B22);
        graphics.fillCircle(x, y - (40 * scale), 20 * scale);
        graphics.fillCircle(x - (10 * scale), y - (50 * scale), 15 * scale);
        graphics.fillCircle(x + (10 * scale), y - (50 * scale), 15 * scale);
        graphics.fillCircle(x, y - (60 * scale), 15 * scale);
    }
    
    createPath() {
        // Define path dimensions with margins from edges
        const pathMargin = 10; // Margin from screen edges
        const pathY = 450;     // Y position of the path
        const pathHeight = 20; // Height of the path
        
        // Calculate path width based on screen width and margins
        const pathWidth = this.cameras.main.width - (pathMargin * 2);
        const pathX = pathMargin;
        
        // Draw a path for the character to walk on
        const path = this.add.graphics();
        path.fillStyle(0xA0522D);
        path.fillRect(pathX, pathY, pathWidth, pathHeight);
        
        // Add some details to the path
        const details = this.add.graphics();
        details.fillStyle(0x8B4513);
        
        // Number of details based on path width
        const numDetails = Math.floor(pathWidth / 30);
        const detailSpacing = pathWidth / numDetails;
        
        for (let i = 0; i < numDetails; i++) {
            const x = pathX + (i * detailSpacing) + 10; // Offset by 10 to position details
            details.fillRect(x, pathY, 20, 3);
        }
        
        // Update flag position
        if (this.flag) {
            this.flag.x = pathX + pathWidth - 10;
        }
        
        // Also update character starting position
        if (this.character) {
            this.character.x = pathX + 20;
        }
        
        // Store path bounds for character movement calculations
        this.pathBounds = {
            x: pathX,
            y: pathY,
            width: pathWidth,
            height: pathHeight,
            right: pathX + pathWidth
        };
    }
    
    createFinishFlag() {
        // Path bounds may not be defined yet if this runs before createPath
        const pathRight = this.pathBounds ? this.pathBounds.right -25 : this.cameras.main.width - 70;
        const pathY = 450;
        
        // Create finish flag at the end of the path
        const flag = this.add.graphics();
        
        // Draw pole
        flag.fillStyle(0x000000);
        flag.fillRect(pathRight, pathY - 30, 3, 30);
        
        // Draw flag
        flag.fillStyle(0xFF0000);
        flag.fillTriangle(pathRight + 3, pathY - 30, pathRight + 3, pathY - 15, pathRight + 18, pathY - 22.5);
        
        // Add simple animation to the flag
        this.tweens.add({
            targets: flag,
            x: 1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store reference to the flag
        this.flag = flag;
    }
    
    createUI() {
        // Level and score text
        this.levelText = this.add.text(
            20, 
            20, 
            `Level: ${GameData.level}`, 
            { 
                font: '24px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        
        this.scoreText = this.add.text(
            650, 
            20, 
            `Score: ${GameData.score}`, 
            { 
                font: '24px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        
        // Progress stars - using circles instead of star shapes to avoid tint issues
        this.starsGroup = this.add.group();
        for (let i = 0; i < GameData.levelConfig[GameData.level - 1].problemsToSolve; i++) {
            // Use circles instead of stars to avoid the setTint issue
            const star = this.add.circle(
                300 + (i * 40), 
                30, 
                15, 
                i < this.problemsSolved ? 0xFFD700 : 0x555555
            );
            
            this.starsGroup.add(star);
        }
        
        // Timer text
        this.timerText = this.add.text(
            this.cameras.main.width / 2, 
            70, 
            `Time: ${this.timeLeft}s`, 
            { 
                font: '20px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Problem text
        this.problemText = this.add.text(
            this.cameras.main.width / 2, 
            130, 
            '', 
            { 
                font: '32px Arial',
                fill: '#000000'
            }
        ).setOrigin(0.5);
        
        // Answer input field background
        this.answerBox = this.add.rectangle(
            this.cameras.main.width / 2,
            180,
            120,
            40,
            0xFFFFFF
        );
        this.answerBox.setStrokeStyle(2, 0x000000);
        
        // Answer text
        this.answerText = this.add.text(
            this.cameras.main.width / 2, 
            180, 
            '?', 
            { 
                font: '28px Arial',
                fill: '#000000'
            }
        ).setOrigin(0.5);
        
        // Check button
        this.checkButton = this.add.rectangle(
            this.cameras.main.width / 2,
            230,
            150,
            40,
            0x4CAF50
        ).setInteractive();
        
        this.checkButtonText = this.add.text(
            this.cameras.main.width / 2, 
            230, 
            'Check', 
            { 
                font: '20px Arial',
                fill: '#ffffff' 
            }
        ).setOrigin(0.5);
        
        // Make button interactive
        this.checkButton.on('pointerover', () => {
            this.checkButton.fillColor = 0x3E8E41;
        });
        this.checkButton.on('pointerout', () => {
            this.checkButton.fillColor = 0x4CAF50;
        });
        this.checkButton.on('pointerdown', () => {
            if (this.allowInput) {
                this.checkAnswer();
            }
        });
        
        // Feedback text (initially hidden)
        this.feedbackText = this.add.text(
            this.cameras.main.width / 2, 
            280, 
            '', 
            { 
                font: '24px Arial',
                fill: '#000000',
                stroke: '#ffffff',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setVisible(false);
        
        // Hint button and text (initially hidden)
        this.hintButton = this.add.text(
            this.cameras.main.width / 2, 
            320, 
            'Need a hint?', 
            { 
                font: '18px Arial',
                fill: '#0000ff',
                backgroundColor: '#eeeeee',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5).setVisible(false).setInteractive();
        
        this.hintButton.on('pointerdown', () => {
            this.showHint();
        });
        
        this.hintText = this.add.text(
            this.cameras.main.width / 2, 
            360, 
            '', 
            { 
                font: '18px Arial',
                fill: '#333333',
                backgroundColor: '#ffffcc',
                padding: { x: 15, y: 10 },
                wordWrap: { width: 500 }
            }
        ).setOrigin(0.5).setVisible(false);
    }
    
    createAnimalHelper(levelData) {
        // Create small animal helper in the corner
        const animalX = 740;
        const animalY = 540;
        const scale = 0.7;
        
        // Create animal based on level
        let animalGroup;
        if (GameData.level === 1) {
            animalGroup = this.createFox(animalX, animalY, levelData.animalColor, scale);
        } else if (GameData.level === 2) {
            animalGroup = this.createEagle(animalX, animalY, levelData.animalColor, scale);
        } else {
            animalGroup = this.createOwl(animalX, animalY, levelData.animalColor, scale);
        }
        
        // Add simple animation
        this.tweens.add({
            targets: animalGroup.getChildren(),
            y: '-=5',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createFox(x, y, color, scale = 1) {
        const foxParts = [];
        const graphics = this.add.graphics();
        
        // Draw body
        graphics.fillStyle(color);
        graphics.beginPath();
        graphics.moveTo(x - (20 * scale), y - (10 * scale));
        graphics.lineTo(x + (20 * scale), y - (10 * scale));
        graphics.lineTo(x + (20 * scale), y + (10 * scale));
        graphics.lineTo(x - (20 * scale), y + (10 * scale));
        graphics.closePath();
        graphics.fill();
        foxParts.push(graphics);
        
        // Draw head
        const head = this.add.circle(x, y - (20 * scale), 15 * scale, color);
        foxParts.push(head);
        
        // Draw ears
        const leftEar = this.add.triangle(
            x - (10 * scale), y - (30 * scale),
            0, 0,
            -(10 * scale), -(15 * scale),
            (5 * scale), -(10 * scale),
            color
        );
        const rightEar = this.add.triangle(
            x + (10 * scale), y - (30 * scale),
            0, 0,
            (10 * scale), -(15 * scale),
            -(5 * scale), -(10 * scale),
            color
        );
        foxParts.push(leftEar, rightEar);
        
        // Draw face
        const leftEye = this.add.circle(x - (5 * scale), y - (22 * scale), 2 * scale, 0x000000);
        const rightEye = this.add.circle(x + (5 * scale), y - (22 * scale), 2 * scale, 0x000000);
        const nose = this.add.circle(x, y - (17 * scale), 3 * scale, 0x000000);
        foxParts.push(leftEye, rightEye, nose);
        
        // Draw tail
        const tail = this.add.triangle(
            x - (30 * scale), y,
            0, 0,
            -(20 * scale), -(10 * scale),
            -(15 * scale), (10 * scale),
            color
        );
        foxParts.push(tail);
        
        return this.add.group(foxParts);
    }
    
    createEagle(x, y, color, scale = 1) {
        const eagleParts = [];
        const graphics = this.add.graphics();
        
        // Draw body
        graphics.fillStyle(color);
        graphics.beginPath();
        graphics.moveTo(x - (15 * scale), y);
        graphics.lineTo(x + (15 * scale), y);
        graphics.lineTo(x + (10 * scale), y + (20 * scale));
        graphics.lineTo(x - (10 * scale), y + (20 * scale));
        graphics.closePath();
        graphics.fill();
        eagleParts.push(graphics);
        
        // Draw head
        const head = this.add.circle(x, y - (10 * scale), 12 * scale, color);
        eagleParts.push(head);
        
        // Draw wings
        const leftWing = this.add.triangle(
            x - (25 * scale), y,
            0, 0,
            -(20 * scale), -(15 * scale),
            -(5 * scale), (15 * scale),
            color
        );
        const rightWing = this.add.triangle(
            x + (25 * scale), y,
            0, 0,
            (20 * scale), -(15 * scale),
            (5 * scale), (15 * scale),
            color
        );
        eagleParts.push(leftWing, rightWing);
        
        // Draw face
        const leftEye = this.add.circle(x - (5 * scale), y - (12 * scale), 2 * scale, 0x000000);
        const rightEye = this.add.circle(x + (5 * scale), y - (12 * scale), 2 * scale, 0x000000);
        
        // Draw beak
        const beak = this.add.triangle(
            x, y - (5 * scale),
            0, 0,
            -(5 * scale), (5 * scale),
            (5 * scale), (5 * scale),
            0xFFA500
        );
        eagleParts.push(leftEye, rightEye, beak);
        
        return this.add.group(eagleParts);
    }
    
    createOwl(x, y, color, scale = 1) {
        const owlParts = [];
        const graphics = this.add.graphics();
        
        // Draw body
        graphics.fillStyle(color);
        graphics.beginPath();
        graphics.moveTo(x - (20 * scale), y);
        graphics.lineTo(x + (20 * scale), y);
        graphics.lineTo(x + (15 * scale), y + (30 * scale));
        graphics.lineTo(x - (15 * scale), y + (30 * scale));
        graphics.closePath();
        graphics.fill();
        owlParts.push(graphics);
        
        // Draw head
        const head = this.add.circle(x, y - (10 * scale), 20 * scale, color);
        owlParts.push(head);
        
        // Draw ears/tufts
        const leftEar = this.add.triangle(
            x - (10 * scale), y - (25 * scale),
            0, 0,
            -(10 * scale), -(15 * scale),
            (5 * scale), -(5 * scale),
            color
        );
        const rightEar = this.add.triangle(
            x + (10 * scale), y - (25 * scale),
            0, 0,
            (10 * scale), -(15 * scale),
            -(5 * scale), -(5 * scale),
            color
        );
        owlParts.push(leftEar, rightEar);
        
        // Draw face
        const leftEye = this.add.circle(x - (8 * scale), y - (10 * scale), 6 * scale, 0xFFFFFF);
        const leftPupil = this.add.circle(x - (8 * scale), y - (10 * scale), 3 * scale, 0x000000);
        const rightEye = this.add.circle(x + (8 * scale), y - (10 * scale), 6 * scale, 0xFFFFFF);
        const rightPupil = this.add.circle(x + (8 * scale), y - (10 * scale), 3 * scale, 0x000000);
        
        // Draw beak
        const beak = this.add.triangle(
            x, y,
            0, 0,
            -(5 * scale), (5 * scale),
            (5 * scale), (5 * scale),
            0xFFA500
        );
        owlParts.push(leftEye, leftPupil, rightEye, rightPupil, beak);
        
        return this.add.group(owlParts);
    }
    
    handleKeyInput(event) {
        if (!this.allowInput) return;
        
        if (event.keyCode === 13) { // Enter key
            this.checkAnswer();
            return;
        }
        
        // Handle backspace
        if (event.keyCode === 8) { // Backspace key
            this.userAnswer = this.userAnswer.slice(0, -1);
            this.updateAnswerDisplay();
            return;
        }
        
        // Only allow number inputs
        if ((event.keyCode >= 48 && event.keyCode <= 57) || 
            (event.keyCode >= 96 && event.keyCode <= 105)) {
            // Limit answer length
            if (this.userAnswer.length < 5) {
                // Convert to number character
                let num;
                if (event.keyCode >= 48 && event.keyCode <= 57) {
                    num = String.fromCharCode(event.keyCode);
                } else {
                    num = String.fromCharCode(event.keyCode - 48); // For numpad
                }
                
                this.userAnswer += num;
                this.updateAnswerDisplay();
            }
        }
    }
    
    updateAnswerDisplay() {
        this.answerText.setText(this.userAnswer === '' ? '?' : this.userAnswer);
    }
    
    generateProblem() {
        // Generate multiplication problem based on current level
        this.currentProblem = ProblemGenerator.generateProblem(GameData.level);
        
        // Update problem display
        this.problemText.setText(this.currentProblem.question);
        this.userAnswer = '';
        this.updateAnswerDisplay();
        
        // Reset hint and feedback
        this.showingHint = false;
        this.hintButton.setVisible(false);
        this.hintText.setVisible(false);
        this.feedbackText.setVisible(false);
    }

    
    showHint() {
        this.showingHint = !this.showingHint;
        this.hintText.setText(this.currentProblem.hint);
        this.hintText.setVisible(this.showingHint);
        
        if (this.showingHint) {
            this.hintButton.setText('Hide hint');
        } else {
            this.hintButton.setText('Need a hint?');
        }
    }
    
    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}s`);
        
        // Change color when time is running low
        if (this.timeLeft <= 5) {
            this.timerText.setFill('#ff0000');
        } else {
            this.timerText.setFill('#ffffff');
        }
        
        // Time's up
        if (this.timeLeft <= 0) {
            this.timer.remove();
            this.feedbackText.setText("Time's up! Let's try a new problem.");
            this.feedbackText.setFill('#ff0000');
            this.feedbackText.setVisible(true);
            
            // Temporarily disable input
            this.allowInput = false;
            
            // Continue to next problem after a delay
            this.time.delayedCall(2000, () => {
                this.allowInput = true;
                this.generateProblem();
                
                // Restart timer
                const levelData = GameData.levelConfig[GameData.level - 1];
                this.timeLeft = levelData.timePerProblem;
                this.timer = this.time.addEvent({
                    delay: 1000,
                    callback: this.updateTimer,
                    callbackScope: this,
                    loop: true
                });
            });
        }
    }
    
    moveCharacter() {
        // Stop idle animation
        if (this.idleAnimation) {
            this.idleAnimation.stop();
        }
        
        // Calculate position increment based on number of problems
        const totalProblems = GameData.levelConfig[GameData.level - 1].problemsToSolve;
        const increment = 580 / totalProblems; // 580 = distance to cover (700 - 120)
        
        this.characterPosition += increment;
        
        // Walking animation effect
        const walking = this.tweens.add({
            targets: [
                this.characterGroup.getChildren()[4], // left leg
                this.characterGroup.getChildren()[5]  // right leg
            ],
            x: { from: (i) => i === 0 ? 115 : 125, to: (i) => i === 0 ? 125 : 115 },
            duration: 200,
            yoyo: true,
            repeat: 3
        });
        
        // Move character
        this.tweens.add({
            targets: this.characterGroup.getChildren(),
            x: `+=${increment}`,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Celebration effect
                this.tweens.add({
                    targets: this.characterGroup.getChildren(),
                    y: '-=15',
                    duration: 300,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        // Restart idle animation after celebration
                        this.idleAnimation = this.tweens.add({
                            targets: this.characterGroup.getChildren(),
                            y: '-=3',
                            duration: 500,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                    }
                });
                
                // Show pattern explanation briefly for learning
                this.showPatternExplanation();
            }
        });
    }
    
    showPatternExplanation() {
        // Only show for multiplication by 11 (levels 2 and 3)
        if (GameData.level > 1 && this.currentProblem.patternExplanation) {
            // Create pattern explanation bubble
            const patternText = this.add.text(
                400, 
                500, 
                this.currentProblem.patternExplanation, 
                { 
                    font: '16px Arial',
                    fill: '#333333',
                    backgroundColor: '#e6f7ff',
                    padding: { x: 15, y: 10 },
                    wordWrap: { width: 400 },
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            patternText.setDepth(100);
            
            // Add a border
            const bounds = patternText.getBounds();
            const border = this.add.graphics();
            border.lineStyle(2, 0x4a90e2);
            border.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
            border.setDepth(99);
            
            // Show and automatically hide after a few seconds
            this.time.delayedCall(4000, () => {
                this.tweens.add({
                    targets: [patternText, border],
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        patternText.destroy();
                        border.destroy();
                    }
                });
            });
        }
    }
    
    showCelebrationEffect() {
        // Create celebration effect using basic shapes instead of particles
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Create a small colored circle as a particle
            const color = Phaser.Math.RND.pick([0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF]);
            const size = Phaser.Math.Between(2, 6);
            const x = 120 + this.characterPosition;
            const y = 435;
            
            const particle = this.add.circle(x, y, size, color);
            particles.push(particle);
            
            // Animate the particle flying outward
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-100, 100),
                y: y + Phaser.Math.Between(-100, 100),
                alpha: 0,
                scale: { from: 1, to: 0 },
                duration: Phaser.Math.Between(500, 1000),
                ease: 'Quad.out',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }
    debugTextureKeys() {
        console.log("All textures loaded:", Object.keys(this.textures.list));
        
        // Check specific run textures
        for (let i = 1; i <= 8; i++) {
            const key = `run_${i}`;
            console.log(`Texture ${key} exists:`, this.textures.exists(key));
        }
        
        // Try to find any textures that contain "Run" in their name
        const runKeys = Object.keys(this.textures.list).filter(key => 
            key.includes("Run") || key.includes("run"));
        console.log("Found run-related textures:", runKeys);
    }
}
