// Game Complete Scene - Shown after completing all levels

class GameCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameCompleteScene' });
    }

    create() {
        // Create a nice gradient background
        this.createGradientBackground(0x4a90e2, 0x8e44ad);
        
        // Add the Game Complete UI
        const acUI = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'AC'
        ).setScale(0.8);
        
        // Add final score with animation
        const finalScore = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2 + 100, 
            `Final Score: ${GameData.score}`, 
            { 
                font: 'bold 48px Arial',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
                shadow: { color: '#000000', blur: 10, fill: true }
            }
        ).setOrigin(0.5).setScale(0);
        
        // Animate the score appearance
        this.tweens.add({
            targets: finalScore,
            scale: 1,
            duration: 1000,
            ease: 'Bounce.out'
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
    
    createFirework(x, y, color) {
        // Create a firework explosion effect using basic shapes
        const particles = [];
        
        // Create particles that shoot out from a center point
        for (let i = 0; i < 20; i++) {
            const angle = Math.PI * 2 * (i / 20);
            const speed = Phaser.Math.Between(2, 4);
            const radius = Phaser.Math.Between(3, 5);
            
            const particle = this.add.circle(x, y, radius, color);
            particles.push(particle);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 100 * speed,
                y: y + Math.sin(angle) * 100 * speed,
                alpha: 0,
                scale: { from: 1, to: 0 },
                duration: 1000,
                ease: 'Cubic.out',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }
    
    // Replace the createCelebrationEffects method to fix any particle references
    createCelebrationEffects() {
        // Create fireworks effect
        for (let i = 0; i < 10; i++) {
            this.time.delayedCall(i * 500, () => {
                this.createFirework(
                    Phaser.Math.Between(100, 700),
                    Phaser.Math.Between(100, 400),
                    Phaser.Math.RND.pick([0xFFFFFF, 0xFFD700, 0xFF0000, 0x00FF00, 0x0000FF])
                );
            });
        }
        
        // Add confetti raining down
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 800);
            const delay = Phaser.Math.Between(0, 5000);
            const size = Phaser.Math.Between(5, 10);
            const color = Phaser.Math.RND.pick([0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF]);
            
            const confetti = this.add.rectangle(x, -20, size, size, color);
            
            this.tweens.add({
                targets: confetti,
                y: 620,
                x: x + Phaser.Math.Between(-100, 100),
                angle: Phaser.Math.Between(0, 360),
                delay: delay,
                duration: Phaser.Math.Between(3000, 6000),
                ease: 'Cubic.in'
            });
        }
    }
    
    createCertificate() {
        // Create a certificate of completion
        const certificate = this.add.rectangle(
            this.cameras.main.width / 2,
            350,
            400,
            180,
            0xFFFFFF
        );
        certificate.setStrokeStyle(3, 0xFFD700);
        
        // Add certificate border decoration
        const border = this.add.graphics();
        border.lineStyle(1, 0xFFD700, 1);
        
        // Draw decorative border
        const bounds = certificate.getBounds();
        const x = bounds.x + 10;
        const y = bounds.y + 10;
        const width = bounds.width - 20;
        const height = bounds.height - 20;
        
        border.strokeRect(x, y, width, height);
        
        // Add certificate content
        this.add.text(
            this.cameras.main.width / 2, 
            290, 
            'Certificate of Achievement', 
            { 
                font: '24px Arial',
                fill: '#333333',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            320, 
            'This certifies that', 
            { 
                font: '16px Arial',
                fill: '#333333'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            350, 
            GameData.playerName, 
            { 
                font: '28px Arial',
                fill: '#4a90e2',
                fontStyle: 'italic'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            380, 
            'has successfully completed', 
            { 
                font: '16px Arial',
                fill: '#333333'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            405, 
            'Multiplication Adventure', 
            { 
                font: '20px Arial',
                fill: '#333333',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        // Add decorative stars (using circles to avoid the star.setTint issue)
        this.add.circle(bounds.x + 30, bounds.y + 30, 10, 0xFFD700);
        this.add.circle(bounds.right - 30, bounds.y + 30, 10, 0xFFD700);
        this.add.circle(bounds.x + 30, bounds.bottom - 30, 10, 0xFFD700);
        this.add.circle(bounds.right - 30, bounds.bottom - 30, 10, 0xFFD700);
    }
    
    createSkillsLearnedSection() {
        // Add a section showing all skills learned
        const skillsPanel = this.add.rectangle(
            this.cameras.main.width / 2,
            465,
            400,
            60,
            0x000000,
            0.2
        );
        
        this.add.text(
            this.cameras.main.width / 2, 
            450, 
            'Skills Mastered:', 
            { 
                font: '16px Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.cameras.main.width / 2, 
            475, 
            'Basic multiplication, multiplying by 11, pattern recognition', 
            { 
                font: '14px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);
    }
}