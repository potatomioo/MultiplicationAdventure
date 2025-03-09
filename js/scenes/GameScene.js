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
        
        // Create background
        this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            levelData.backgroundColor
        );
        
        // Add decorative elements
        this.createEnvironment(levelData);
        
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
    }
    
    createEnvironment(levelData) {
        const graphics = this.add.graphics();
        
        // Add different environments based on level theme
        if (GameData.level === 1) { // Forest
            // Draw some ground
            graphics.fillStyle(0x8B5A2B);
            graphics.fillRect(0, 400, 800, 200);
            
            // Draw grass
            graphics.fillStyle(0x1E8449);
            graphics.fillRect(0, 390, 800, 20);
            
            // Draw some trees in the background
            for (let i = 0; i < 5; i++) {
                const x = Phaser.Math.Between(50, 750);
                const y = 390;
                const scale = Phaser.Math.FloatBetween(0.5, 1.2);
                this.drawTree(graphics, x, y, scale);
            }
        } else if (GameData.level === 2) { // Canyon
            // Draw sky gradient
            for (let y = 0; y < 400; y++) {
                const t = y / 400;
                const r = Phaser.Math.Interpolation.Linear([135, 206], t);
                const g = Phaser.Math.Interpolation.Linear([206, 235], t);
                const b = Phaser.Math.Interpolation.Linear([250, 255], t);
                const color = Phaser.Display.Color.GetColor(r, g, b);
                
                graphics.fillStyle(color, 1);
                graphics.fillRect(0, y, 800, 1);
            }
            
            // Draw canyon walls
            graphics.fillStyle(0xC19A6B);
            graphics.fillRect(0, 400, 800, 200);
            
            // Draw layered canyon rocks
            for (let i = 0; i < 8; i++) {
                const y = 400 + i * 20;
                const shade = 0xC19A6B - i * 0x0F0908;
                graphics.fillStyle(shade);
                graphics.fillRect(0, y, 800, 20);
            }
            
            // Draw some rocks
            for (let i = 0; i < 12; i++) {
                const x = Phaser.Math.Between(50, 750);
                const y = Phaser.Math.Between(420, 500);
                const size = Phaser.Math.Between(5, 20);
                graphics.fillStyle(0xA0A0A0);
                graphics.fillCircle(x, y, size);
            }
        } else if (GameData.level === 3) { // Mountain
            // Draw sky gradient (blue to lighter blue)
            for (let y = 0; y < 400; y++) {
                const t = y / 400;
                const r = Phaser.Math.Interpolation.Linear([100, 135], t);
                const g = Phaser.Math.Interpolation.Linear([149, 206], t);
                const b = Phaser.Math.Interpolation.Linear([237, 250], t);
                const color = Phaser.Display.Color.GetColor(r, g, b);
                
                graphics.fillStyle(color, 1);
                graphics.fillRect(0, y, 800, 1);
            }
            
            // Draw distant mountains
            graphics.fillStyle(0x7F99BB);
            graphics.beginPath();
            graphics.moveTo(0, 350);
            graphics.lineTo(100, 320);
            graphics.lineTo(200, 350);
            graphics.lineTo(300, 330);
            graphics.lineTo(400, 360);
            graphics.lineTo(500, 340);
            graphics.lineTo(600, 370);
            graphics.lineTo(700, 350);
            graphics.lineTo(800, 380);
            graphics.lineTo(800, 400);
            graphics.lineTo(0, 400);
            graphics.closePath();
            graphics.fill();
            
            // Draw mid mountains with snow peaks
            graphics.fillStyle(0x58749A);
            graphics.beginPath();
            graphics.moveTo(0, 400);
            graphics.lineTo(150, 350);
            graphics.lineTo(250, 390);
            graphics.lineTo(400, 360);
            graphics.lineTo(500, 400);
            graphics.lineTo(650, 370);
            graphics.lineTo(800, 400);
            graphics.lineTo(800, 450);
            graphics.lineTo(0, 450);
            graphics.closePath();
            graphics.fill();
            
            // Draw snow peaks
            graphics.fillStyle(0xFFFFFF);
            graphics.beginPath();
            graphics.moveTo(130, 360);
            graphics.lineTo(150, 350);
            graphics.lineTo(170, 360);
            graphics.closePath();
            graphics.fill();
            
            graphics.beginPath();
            graphics.moveTo(380, 370);
            graphics.lineTo(400, 360);
            graphics.lineTo(420, 370);
            graphics.closePath();
            graphics.fill();
            
            graphics.beginPath();
            graphics.moveTo(630, 380);
            graphics.lineTo(650, 370);
            graphics.lineTo(670, 380);
            graphics.closePath();
            graphics.fill();
            
            // Draw foreground ground
            graphics.fillStyle(0x4A5D7E);
            graphics.fillRect(0, 450, 800, 150);
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
        // Draw a path for the character to walk on
        const path = this.add.graphics();
        path.fillStyle(0xA0522D);
        path.fillRect(100, 450, 600, 20);
        
        // Add some details to the path
        const details = this.add.graphics();
        details.fillStyle(0x8B4513);
        
        for (let i = 0; i < 20; i++) {
            const x = 120 + (i * 30);
            details.fillRect(x, 450, 20, 3);
        }
    }
    
    createCharacter() {
        const characterGroup = [];
        
        // Create character base
        this.character = this.add.circle(120, 435, 15, 0xFF0000);
        characterGroup.push(this.character);
        
        // Add eyes and smile to make it look like a character
        const leftEye = this.add.circle(115, 430, 3, 0x000000);
        const rightEye = this.add.circle(125, 430, 3, 0x000000);
        characterGroup.push(leftEye, rightEye);
        
        // Create smile using arc
        const smile = this.add.graphics();
        smile.lineStyle(2, 0x000000, 1);
        smile.beginPath();
        smile.arc(120, 435, 8, 0.2, Math.PI - 0.2, false);
        smile.strokePath();
        
        // Add arms and legs
        const leftArm = this.add.rectangle(110, 440, 10, 3, 0xFF0000);
        const rightArm = this.add.rectangle(130, 440, 10, 3, 0xFF0000);
        const leftLeg = this.add.rectangle(115, 455, 3, 10, 0xFF0000);
        const rightLeg = this.add.rectangle(125, 455, 3, 10, 0xFF0000);
        
        characterGroup.push(smile, leftArm, rightArm, leftLeg, rightLeg);
        
        // Group all parts together
        this.characterGroup = this.add.group(characterGroup);
        
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
    
    createFinishFlag() {
        // Create finish flag at the end of the path
        const flag = this.add.graphics();
        
        // Draw pole
        flag.fillStyle(0x000000);
        flag.fillRect(700, 420, 3, 30);
        
        // Draw flag
        flag.fillStyle(0xFF0000);
        flag.fillTriangle(703, 420, 703, 435, 718, 427.5);
        
        // Add simple animation to the flag
        this.tweens.add({
            targets: flag,
            x: 1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
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
        
        // Progress stars
        this.starsGroup = this.add.group();
        for (let i = 0; i < GameData.levelConfig[GameData.level - 1].problemsToSolve; i++) {
            const star = this.add.star(
                300 + (i * 40), 
                30, 
                5, 
                7, 
                15, 
                0xFFD700
            );
            
            // Grey out stars not yet earned
            if (i >= this.problemsSolved) {
                star.setTint(0x555555);
            }
            
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
                stars[this.problemsSolved - 1].clearTint();
                
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
                this.timer.remove();
                
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
            // Incorrect answer
            this.feedbackText.setText('Try again!');
            this.feedbackText.setFill('#ff0000');
            this.feedbackText.setVisible(true);
            
            // Show hint button after first attempt
            this.hintButton.setVisible(true);
            
            // Clear answer
            this.userAnswer = '';
            this.updateAnswerDisplay();
        }
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
        // Create celebration particles
        const particles = this.add.particles('particle');
        
        // Create emitter
        const emitter = particles.createEmitter({
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 50,
            blendMode: 'ADD'
        });
        
        // Emit from character position
        emitter.setPosition(120 + this.characterPosition, 435);
        
        // Auto-destroy after 1 second
        this.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }
}