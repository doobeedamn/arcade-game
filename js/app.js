/*
*** Classes
*/
class Hero {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    // Create player and enemies on game board
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies
class Enemy extends Hero {
    constructor(x, y, speed) {
        super(x, y, speed);
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;

        // Reset bugs when go outside canvas
        if (this.x > 550) {
            this.x = -100;
            this.speed = 100 + Math.floor(Math.random() * 500);
        }

        // Check if hero met bugs
        if (player.x < this.x + 50 &&
            player.x + 50 > this.x &&
            player.y < this.y + 50 &&
            player.y + 50 > this.y) {
            player.x = 200;
            player.y = 380;
            life.update();
            reset();
        }
    }
}

// Player
class Player extends Hero {
    constructor(x, y, speed, xSpeed, ySpeed) {
        super(x, y, speed);
        this.xSpeed = 50;
        this.ySpeed = 30;
        this.sprite = 'images/char-horn-girl.png';
    }

    // Player position
    update() {
        // Don't allow player to go outside canvas
        if (this.x > 400) {
            this.x = 400;
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y > 380) {
            this.y = 380;
        }

        // Hit the top
        if (this.y < 0) {
            this.x = 200;
            this.y = 380;
            this.incrementPoints();
        }
    }

    // Keybord control
    handleInput(keyPress) {
        switch (keyPress) {
            case 'left':
            this.x -= this.speed + this.xSpeed;
            break;
            case 'up':
            this.y -= this.speed + this.ySpeed;
            break;
            case 'right':
            this.x += this.speed + this.xSpeed;
            break;
            case 'down':
            this.y += this.speed + this.ySpeed;
        }
    }

    // Score control
    incrementPoints() {
        const score = document.querySelector(".points");
        score.innerHTML = (points = points + 10);
        if (score.innerHTML == 50) {
            // When I win, I stop
            this.speed = 0 + (this.xSpeed = false, this.ySpeed = false);
            gameover.classList.add("show");
            reset();
            // When I win, enemies stop
            allEnemies.forEach(function(enemy) {
              enemy.speed = false;
            });
        }
    }
}

// Lives (hearts) function
class Heart extends Hero {
    constructor(x, y) {
        super(x, y);
        this.sprite = 'images/Heart.png';
    }

    // Remove heart every time I bump into bug
    update() {
        lives -= 1;
        if (lives === 2) {
            allHearts[0].x = 600;
        } else if (lives === 1) {
            allHearts[1].x = 600;
        } else if (lives === 0) {
            allHearts[2].x = 600;
            // To stop enemies from moving after losing
            allEnemies.forEach(function(enemy) {
                enemy.speed = false;
            });
            // To stop player from moving after losing
            player.speed = 0 + (player.xSpeed = 0, player.ySpeed = 0);
            gameover.classList.add("show");
            gameover.innerHTML = "<h2>Game over</h2><button>Try Again?</button>"
        }
    }

    // Hearts appearance
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 30, 50);
    };
}

/*
*** Variables
*/
let points = 0;
const player = new Player(200, 380, 50);
const enemyPosition = [60, 140, 220, 140, 60]; //Three lines of bugs
let enemy;
let allEnemies = [];
const heartPosition = [410, 440, 470]; //Lives (hearts)
let life;
let allHearts = [];
let lives = 3;
const gameover = document.querySelector(".gameover");

heartPosition.forEach(function(posX) {
    life = new Heart(posX, 540);
    allHearts.push(life);
});

enemyPosition.forEach(function(posY) {
    enemy = new Enemy(0, posY, 100 + Math.floor(Math.random() * 500));
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Page reload when I click the button
function reset() {
    document.querySelector("button").addEventListener('click', () => window.location.reload());
};
