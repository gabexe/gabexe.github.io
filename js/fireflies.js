const canvas = document.getElementById('fireflyCanvas');
const ctx = canvas.getContext('2d');

class Firefly {
    constructor(containerRect) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 0.2 - 0.025;
        this.vy = Math.random() * 0.2 - 0.025;
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random();
        this.pulse = Math.random() * 0.02 + 0.005;
        this.pulseDir = 1;
        this.containerRect = containerRect;
    }

    draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        if (Math.random() < 0.005) {
            this.vx = Math.random() * 0.5 - 0.25;
            this.vy = Math.random() * 0.5 - 0.25;
        }

        const isNearContainer =
            this.x > this.containerRect.left &&
            this.x < this.containerRect.right &&
            this.y > this.containerRect.top &&
            this.y < this.containerRect.bottom;

        if (isNearContainer) {
            this.alpha = Math.min(1.0, this.alpha + 0.01);
        } else {
            this.alpha += this.pulse * this.pulseDir;
            if (this.alpha > 1 || this.alpha < 0) {
                this.pulseDir *= -1;
                this.alpha = Math.max(0, Math.min(1, this.alpha));
            }
        }
    }
}

let fireflies = [];
const numFireflies = 100;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gameContainer = document.getElementById('game-container');
    const containerRect = gameContainer.getBoundingClientRect();

    fireflies = [];
    for (let i = 0; i < numFireflies; i++) {
        fireflies.push(new Firefly(containerRect));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireflies.forEach(firefly => {
        firefly.update();
        firefly.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);

window.onload = function() {
    init();
    animate();
}
