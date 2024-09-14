const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const playerNameDisplay = document.getElementById('player-name');
const levelDisplay = document.getElementById('level');

// Ask for the player's name when the game starts
let playerName = prompt('What is your name?');
playerNameDisplay.textContent = `Player: ${playerName}`;

const boxSize = 20;
const canvasSize = 400;
let snake = [{ x: 200, y: 200 }];
let food = generateFood();
let bigFood = null;
let direction = { x: 0, y: 0 };
let score = 0;
let level = 1;
let speed = 200;  // Level 1 speed
let foodEatenCount = 0;
let bigFoodTimeout;
let intervalID;

// Add key event listener
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x === 0) {
        direction = { x: -boxSize, y: 0 }; // Left
    } else if (key === 38 && direction.y === 0) {
        direction = { x: 0, y: -boxSize }; // Up
    } else if (key === 39 && direction.x === 0) {
        direction = { x: boxSize, y: 0 }; // Right
    } else if (key === 40 && direction.y === 0) {
        direction = { x: 0, y: boxSize }; // Down
    }
}

function drawGame() {
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check collision with regular food
    if (head.x === food.x && head.y === food.y) {
        score++;
        foodEatenCount++;
        updateScore();

        if (foodEatenCount === 10 && level === 1) {
            // Transition to Level 2
            alert('You passed to Level 2!');
            level = 2;
            speed = 100;  // Increase speed for Level 2
            levelDisplay.textContent = level;
            resetGameSpeed();
        } else if (foodEatenCount === 20) {
            // Game Over after Level 2
            alert(`You achieved your goal! ${playerName}, your score is: ${score}`);
            resetGame();
        }

        if (foodEatenCount % 4 === 0 && !bigFood) {
            spawnBigFood();
        } else {
            food = generateFood();
        }
    } else if (bigFood && head.x === bigFood.x && head.y === bigFood.y) {
        score += 10; // Big food worth 10 points
        updateScore();
        bigFood = null;
        clearTimeout(bigFoodTimeout);
    } else {
        snake.pop(); // Remove last part of snake if not eating
    }

    // Check collision with walls or self
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snakeCollision(head)) {
        alert(`Game Over! ${playerName}, your score is: ${score}`);
        resetGame();
    }

    // Draw canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw regular food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Draw big food if available
    if (bigFood) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(bigFood.x, bigFood.y, boxSize, boxSize);
    }

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, boxSize, boxSize));
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize
    };
}

function spawnBigFood() {
    bigFood = generateFood();
    bigFoodTimeout = setTimeout(() => {
        bigFood = null;
    }, 10000); // Big food stays for 10 seconds
}

function snakeCollision(head) {
    return snake.slice(1).some(part => part.x === head.x && part.y === head.y);
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    level = 1;
    foodEatenCount = 0;
    bigFood = null;
    clearTimeout(bigFoodTimeout);
    speed = 200;  // Reset speed to Level 1
    updateScore();
    levelDisplay.textContent = level;
    resetGameSpeed();
    food = generateFood();
}

function resetGameSpeed() {
    clearInterval(intervalID);
    intervalID = setInterval(drawGame, speed);
}

// Start the game loop
intervalID = setInterval(drawGame, speed);
