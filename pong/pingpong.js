// Get the main menu and canvas elements
const mainMenu = document.getElementById('mainMenu');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddles
const paddleWidth = 10, paddleHeight = 100;
const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2 };

// Game settings
const keys = {};

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function movePaddles() {
    if (keys['ArrowUp'] && player.y > 0) player.y -= 10;
    if (keys['ArrowDown'] && player.y < canvas.height - paddleHeight) player.y += 10;

    // AI follows the ball
    if (ball.y > ai.y + paddleHeight / 2) ai.y += 5;
    else if (ball.y < ai.y + paddleHeight / 2) ai.y -= 5;
}

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 2, // Initial speed
    speedY: 2,
    speedIncrement: 0.5, // Speed increment after each paddle hit
    maxSpeed: 10 // Max speed cap
};

// Load the collision sound
const collisionSound = new Audio("collide.mp3");

let playerScore = 0;
let aiScore = 0;

function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball hits top or bottom wall
    if (ball.y <= 0 || ball.y >= canvas.height) {
		ball.speedY = -ball.speedY
		collisionSound.play();
	};

    // Ball hits player paddle
    if (ball.x <= player.x + paddleWidth && ball.y >= player.y && ball.y <= player.y + paddleHeight) {
        ball.speedX = -ball.speedX; 
        ball.x = player.x + paddleWidth;
        increaseSpeed();
		collisionSound.play();
    }

    // Ball hits AI paddle
    if (ball.x >= ai.x - paddleWidth && ball.y >= ai.y && ball.y <= ai.y + paddleHeight) {
        ball.speedX = -ball.speedX; 
        ball.x = ai.x - ball.radius;
        increaseSpeed();
		collisionSound.play();
    }

    // Ball goes out of bounds on player's side (AI scores)
    if (ball.x <= 0) {
        aiScore++; // Increase AI's score
        resetBall(); // Reset ball after AI scores
    }

    // Ball goes out of bounds on AI's side (Player scores)
    if (ball.x >= canvas.width) {
        playerScore++; // Increase player's score
        resetBall(); // Reset ball after player scores
    }
}

function increaseSpeed() {
    // Increase speed up to a maximum
    if (Math.abs(ball.speedX) < ball.maxSpeed) {
        ball.speedX += ball.speedX > 0 ? ball.speedIncrement : -ball.speedIncrement;
    }
    if (Math.abs(ball.speedY) < ball.maxSpeed) {
        ball.speedY += ball.speedY > 0 ? ball.speedIncrement : -ball.speedIncrement;
    }
}

function resetBall() {
    // Reset ball to center and initial speed
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 2;
    ball.speedY = 2;
}

const spriteSheet = new Image();
spriteSheet.src = "spritesheet.png";

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles using sprites
    ctx.drawImage(spriteSheet, 360, 4, 64, 532, player.x, player.y, paddleWidth, paddleHeight);
    ctx.drawImage(spriteSheet, 456, 4, 64, 532, ai.x, ai.y, paddleWidth, paddleHeight);

    // Draw ball using sprite
    ctx.drawImage(spriteSheet, 404, 580, 75, 75, ball.x, ball.y, ball.radius * 2, ball.radius * 2);
	
	// Draw wall using sprite
	const spriteX = 296;
	const spriteY = 20;
	const spriteWidth = 24;   // Original sprite width
	const spriteHeight = 992; // Original sprite height
	const padding = 20;

	const availableHeight = canvas.height - 2 * padding;

	const scaleFactor = availableHeight / spriteHeight;

	const newWidth = spriteWidth * scaleFactor;
	const newHeight = availableHeight;

	const centerX = (canvas.width - newWidth) / 2;  // Center horizontally
	const centerY = padding; // Start 100px from the top

	ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, centerX, centerY, newWidth, newHeight);

	// Draw scores using sprite
	ctx.font = "30px 'Press Start 2P'";
    ctx.fillStyle = "white";
    
    ctx.fillText(playerScore, canvas.width / 2.5, 50);
    ctx.fillText(aiScore, (canvas.width / 4) * 2.25, 50);
}

// Button to start the game
const startGameBtn = document.getElementById('startGameBtn');
startGameBtn.addEventListener('click', startGame);

// Placeholder for settings and exit buttons (can be implemented later)
const settingsBtn = document.getElementById('settingsBtn');
const exitBtn = document.getElementById('exitBtn');

// Game control flag
let isGameActive = false;

// Start the game function
function startGame() {
    mainMenu.style.display = 'none';
    canvas.style.display = 'block';
	backgroundMusic.pause();
    isGameActive = true;
    gameLoop();
}

// You can implement logic for settings and exit here
settingsBtn.addEventListener('click', () => {
    alert("Settings menu is not implemented yet.");
});

exitBtn.addEventListener('click', () => {
    isGameActive = false;
    mainMenu.style.display = 'flex';
    canvas.style.display = 'none';
});

var gameButtons = document.querySelectorAll('.game_button');
var backgroundMusic = new Audio("background.mp3");
var buttonHover = new Audio("../hover.wav");
var buttonselecting = new Audio("../select.mp3");

document.addEventListener('DOMContentLoaded', function() {
	backgroundMusic.play();
	
	gameButtons.forEach(function(button) {
		button.addEventListener('mouseover', function() {
			buttonHover.play();
		});
		
		button.addEventListener('click', function() {
			buttonselecting.play();
		});
	});
})

// The game loop only runs if the game is active
function gameLoop() {
    movePaddles();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}