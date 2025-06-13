
// Snake
// Grid data
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
let cellSize = 25;
let size = 10;

// Snake data
let snake = [[2, 1], [1, 1]];
let snakeColor = 'purple';
let currentDir = 'Right';
let nextDir = null;

// Game data
let score = 0;
let gameInterval = null;
let food = generateFood();

// Utils
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isOpposite(dir1, dir2) {
    return (
        (dir1 === 'Left' && dir2 === 'Right') ||
        (dir1 === 'Right' && dir2 === 'Left') ||
        (dir1 === 'Up' && dir2 === 'Down') ||
        (dir1 === 'Down' && dir2 === 'Up')
    );
}

// Draw grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

// Draw snake
function drawSnake() {
    ctx.fillStyle = snakeColor;
    for (let [x, y] of snake) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
}

// Draw food
function drawFood() {
    ctx.fillStyle = 'green';
    ctx.fillRect(food[0] * cellSize, food[1] * cellSize, cellSize, cellSize);
}

// Generate new food in a free cell
function generateFood() {
    let newFood;
    while (true) {
        newFood = [getRandomInt(size), getRandomInt(size)];
        if (!snake.some(([x, y]) => x === newFood[0] && y === newFood[1])) {
            break;
        }
    }
    return newFood;
}

// Update snake position
function moveSnake() {
    let head = [...snake[0]];

    switch (currentDir) {
        case 'Right': head[0] += 1; break;
        case 'Left': head[0] -= 1; break;
        case 'Up': head[1] -= 1; break;
        case 'Down': head[1] += 1; break;
    }

    // Check wall collision
    if (head[0] < 0 || head[0] >= size || head[1] < 0 || head[1] >= size) {
        gameOver();
    }

    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        const [x, y] = snake[i];
        if (head[0] === x && head[1] === y) {
            gameOver();
        }
    }

    snake.unshift(head); // Add new head

    // Check if food is eaten
    if (head[0] === food[0] && head[1] === food[1]) {
        updateScore();
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Controls
let directionChangedThisTick = false;

document.addEventListener("keydown", (event) => {
    if (directionChangedThisTick) return;

    const key = event.key;
    let newDir = null;

    if ((key === 'ArrowUp' || key === 'z') && currentDir !== 'Down') newDir = 'Up';
    if ((key === 'ArrowDown' || key === 's') && currentDir !== 'Up') newDir = 'Down';
    if ((key === 'ArrowLeft' || key === 'q') && currentDir !== 'Right') newDir = 'Left';
    if ((key === 'ArrowRight' || key === 'd') && currentDir !== 'Left') newDir = 'Right';

    if (newDir) {
        nextDir = newDir;
        directionChangedThisTick = true;
        event.preventDefault();
    }
});

// Game loop
function gameLoop() {
    if (nextDir && !isOpposite(currentDir, nextDir)) {
        currentDir = nextDir;
    }
    moveSnake();
    drawGrid();
    drawSnake();
    drawFood();
    directionChangedThisTick = false; // Reset for next tick
}

// Update score data
function updateScore() {
    score++;
    document.getElementById("snake-scoreLabel").textContent = `Score : ${score}`;
}

// Define the speed based on the user selection
function getSpeedValue() {
    const speed = document.getElementById("speed-select").value;
    if (speed === "slow") return 600;
    if (speed === "medium") return 400;
    if (speed === "fast") return 200;
    return 400;
}

// Reset game data
function reset() {
    nextDir = currentDir;
    score = 0;
    snake = [[2, 1], [1, 1]];
    currentDir = 'Right';
    food = generateFood();
    drawGrid();
    drawSnake();
    drawFood();
}

// Game Over
function gameOver() {
    alert("Game over!");
    clearInterval(gameInterval);
    // Enable controls for a new game
    document.getElementById("snakestartButton").disabled = false;
    document.getElementById("speed-select").disabled = false;
}

// Start game loop
function startSnake() {
    // Get grid size from input
    size = parseInt(document.getElementById("snake-gridSize").value);

    if (isNaN(size) || size < 5 || size > 25) {
        alert("Size must be a number between 5 and 25");
        return;
    }

    // Recalculate cell size and resize canvas
    cellSize = 250 / size;
    canvas.width = 250;
    canvas.height = 250;

    // Disable UI controls
    document.getElementById("startButton").disabled = true;
    document.getElementById("speed-select").disabled = true;

    // Reset game state now that size is set
    reset();

    // Start game loop
    let speed = getSpeedValue();
    gameInterval = setInterval(gameLoop, speed);
}