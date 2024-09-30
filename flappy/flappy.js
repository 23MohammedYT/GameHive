const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Check if there's a 'best_score' in sessionStorage, and if not, create it with a default value of 0
if (sessionStorage.getItem('best_score') === null) {
    sessionStorage.setItem('best_score', 0);
}

let gameStart = false;

const spritesheet = new Image();
spritesheet.src = 'flappyBird.png';

const scoreSound = new Audio('score.mp3');
const loseSound = new Audio('lose.mp3');
const flySound = new Audio('fly.mp3');

// Function to draw the background
function drawBackground() {
    const backgroundWidth = 144; // Width of the background sprite
    const backgroundHeight = 256; // Height of the background sprite

    // Calculate how many times to draw the background
    const repeatCount = Math.ceil(canvas.width / backgroundWidth);

    // Draw the background repeatedly across the canvas width
    for (let i = 0; i < repeatCount; i++) {
        context.drawImage(spritesheet, 0, 0, backgroundWidth, backgroundHeight, 
                          i * backgroundWidth, 0, backgroundWidth, canvas.height);
    }
}

// Bird properties
let birdX = 3; // X position of the bird in the spritesheet
const birdYSource = 491; // Fixed Y position of the bird in the spritesheet (source)
let birdY = 100; // Initial Y position of the bird on the canvas
const birdWidth = 17; // Width of a single bird frame
const birdHeight = 12; // Height of a single bird frame
const frameSeparation = 11; // Separation between frames
let birdFrame = 0; // Current frame of the bird animation
const birdFrames = 3; // Total number of frames for the bird animation

// Scaling factor to resize the bird
const scale = 0.75; // Set this to a value between 0 and 1 to reduce size (0.5 = half size)

// Frame control properties
let frameTimer = 0; // Timer for controlling frame updates
const frameDelay = 10; // Delay in frames (increase for slower animation)

// Gravity and jump properties
let birdVelocityY = 0; // Vertical velocity of the bird
const gravity = 0.2; // Gravity effect
const jumpStrength = -3; // Jump strength when the spacebar is pressed

// Rotation properties
let birdRotation = 0; // Current rotation angle of the bird
const maxFlapAngle = -30; // Maximum angle for flapping (in degrees)
const maxFallAngle = 90; // Maximum angle for falling (in degrees)
const rotationSpeed = 2; // Speed of rotation adjustment

// Function to draw the bird
function drawBird() {
    context.save(); // Save the current context
    context.translate(100 + (birdWidth * scale) / 2, birdY + (birdHeight * scale) / 2); // Move the origin to the center of the bird
    context.rotate(birdRotation * Math.PI / 180); // Rotate the context
    context.drawImage(
        spritesheet,
        birdX + birdFrame * (birdWidth + frameSeparation), // Source x (accounting for frame separation)
        birdYSource, // Fixed source y position in the spritesheet
        birdWidth, // Source width
        birdHeight, // Source height
        -birdWidth * scale / 2, // Destination x (centered)
        -birdHeight * scale / 2, // Destination y (centered)
        birdWidth * scale, // Destination width (scaled)
        birdHeight * scale // Destination height (scaled)
    );
    context.restore(); // Restore the original context
}

// Update the bird frame for animation
function updateBird() {
    frameTimer++;
    if (frameTimer >= frameDelay) { // Check if it's time to update the frame
        birdFrame = (birdFrame + 1) % birdFrames; // Loop through frames
        frameTimer = 0; // Reset the timer
    }

    // Update bird's vertical position and velocity
    birdVelocityY += gravity; // Apply gravity
    birdY += birdVelocityY; // Update bird's position

    // Calculate the rotation angle based on vertical velocity
    if (birdVelocityY < 0) { // Bird is flapping upward
        birdRotation = maxFlapAngle; // Rotate up to max flap angle
    } else { // Bird is falling down
        birdRotation = Math.min(birdRotation + rotationSpeed, maxFallAngle); // Rotate down to max fall angle
    }	
}

function fallCollision() {
	// Check if the bird is below the canvas
	if (birdY + birdHeight > canvas.height + 12 || birdY < -12) {
		return true;
	}
}

// Pipe properties
const pipeWidth = 26; // Width of a single pipe
const pipeHeight = 160; // Height of the pipe
const pipeGap = 100; // Gap between the top and bottom pipes
let pipeSpeed = 1; // Speed at which pipes move
let difficulty = 3000 // Initial difficulty (3 seconds between pipes)
let pipeInterval; // To store the setInterval reference

let pipes = [];

// Function to initialize the pipes
function initializePipes() {
    // Limit random Y position for the top pipe's bottom edge to ensure it stays within bounds
    const maxTopPipeBottomY = canvas.height - (pipeHeight * scale) - pipeGap - 10; // 10 pixels from the top
    const topPipeBottomY = Math.floor(Math.random() * (maxTopPipeBottomY - 10)) + 10; // Random Y position for the bottom edge
    const topPipeY = topPipeBottomY - (pipeHeight * scale); // Calculate the top edge of the pipe

    pipes = [
        { x: canvas.width, y: topPipeY, type: 'top' }, // Top pipe (top edge)
        { x: canvas.width, y: topPipeBottomY + pipeGap + 40, type: 'bottom' } // Bottom pipe (bottom edge)
    ];
}

// Call the initializePipes function to set the initial positions
//initializePipes();

// Function to initialize pipes
function addNewPipes() {
    // Limit random Y position for the top pipe's bottom edge to ensure it stays within bounds
    const maxTopPipeBottomY = canvas.height - (pipeHeight * scale) - pipeGap - 10; // 10 pixels from the top
    const topPipeBottomY = Math.floor(Math.random() * (maxTopPipeBottomY - 10)) + 10; // Random Y position for the bottom edge
    const topPipeY = topPipeBottomY - (pipeHeight * scale); // Calculate the top edge of the pipe

    // Add new pipes to the array (top and bottom)
    pipes.push(
        { x: canvas.width, y: topPipeY, type: 'top' }, // Top pipe
        { x: canvas.width, y: topPipeBottomY + pipeGap + 40, type: 'bottom' } // Bottom pipe
    );
}

// Function to draw the pipes
function drawPipes() {
    pipes.forEach(pipe => {
        if (pipe.type === 'top') {
            context.drawImage(
                spritesheet,
                57, // Source x for the bottom pipe
                323, // Source y for the bottom pipe
                pipeWidth, // Source width
                pipeHeight, // Source height
                pipe.x, // Destination x
                pipe.y + pipeGap, // Adjust destination y for bottom pipe
                pipeWidth * scale, // Destination width
                pipeHeight * scale // Destination height
            );
        } else {
            context.drawImage(
                spritesheet,
                84, // Source x for the top pipe
                323, // Source y for the top pipe
                pipeWidth, // Source width
                pipeHeight, // Source height
                pipe.x, // Destination x
                pipe.y, // Destination y
                pipeWidth * scale, // Destination width
                pipeHeight * scale // Destination height
            );
        }
    });
}

let score = 0;
let hasScored = false;
let scoreThreshold = 5; // The score threshold to increase pipeSpeed

// Get the best_score from sessionStorage and assign it to a variable
let best_score = parseInt(sessionStorage.getItem('best_score'), 10);

// Function to update the score and adjust the difficulty
function updateScore() {
    // Update the score and check if it's a multiple of 5
    if (score % scoreThreshold === 0 && score !== 0) {
        if (difficulty > 1000) { // Ensure difficulty doesn't go below 500 ms
            difficulty -= 100; // Decrease the time interval between pipes by 500 ms
            startPipeGeneration(); // Restart the pipe generation with the new difficulty
        }
    }
}

// Start adding pipes at the current difficulty level
function startPipeGeneration() {
    clearInterval(pipeInterval); // Clear any existing interval
    pipeInterval = setInterval(() => {
        if (!gameOver) {
            addNewPipes();
        }
    }, difficulty); // Set the interval to the current difficulty
}

// Function to update the pipes' position
function updatePipes() {
    if (!gameOver) {
        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed; // Move pipes to the left
        });
    }

    // Check for scoring
    if (pipes.length > 0 && pipes[0].x < (birdWidth * scale * 7) && !hasScored) {
        score++; // Increase score
		
		if (score > sessionStorage.getItem('best_score')) {
			sessionStorage.setItem('best_score', score);
		}
		
		best_score = parseInt(sessionStorage.getItem('best_score'));
		
        updateScore(); // Check if the pipe speed needs to be increased
        hasScored = true; // Prevent multiple scoring for the same pipe
        scoreSound.play();
    }

    // Remove pipes that move off-screen
    if (pipes.length > 0 && pipes[0].x + (pipeWidth * scale) < 0) {
        pipes.splice(0, 2); // Remove the first pair of pipes (top and bottom)
        hasScored = false; // Reset scoring for the next pipes
    }
}

// Start the game by initializing the first pipe generation
startPipeGeneration();

function drawScore() {
    context.fillStyle = 'white'; // Set text color
    context.font = '15px flappy-number'; // Set font and size
    
    // Measure the width of the score text
    const scoreText = `${score}`;
    const textWidth = context.measureText(scoreText).width;
    
    // Calculate the x position to center the text
    const xPosition = (canvas.width - textWidth) / 2;

    // Set stroke style and draw text outline
    context.strokeStyle = 'black'; // Set outline color
    context.lineWidth = 2; // Set outline width to 2px
    context.strokeText(scoreText, xPosition, 20); // Draw the outline

    // Fill the text
	context.fillStyle = 'white'; // Set fill color (change this to your desired color)
    context.fillText(scoreText, xPosition, 20); // Draw the filled text
}

let gameOver = false; // Add this to track the game state
const collideEffect = document.querySelector('#collideEffect');

function checkCollision() {
    const birdWidth = 17 * scale; // Adjust the bird's width based on scale
    const birdHeight = 12 * scale; // Adjust the bird's height based on scale
    const birdXPosition = 100; // Bird's X position on the canvas (fixed)
    const birdYPosition = birdY; // Bird's Y position on the canvas

    for (let pipe of pipes) {
        // Check collision with top pipe
        if (pipe.type === 'top') {
            if (
                birdXPosition + birdWidth > pipe.x && // Bird's right edge is past the pipe's left edge
                birdXPosition < pipe.x + pipeWidth && // Bird's left edge is before the pipe's right edge
                birdYPosition + birdHeight < pipes[1].y - 40 // Bird's top edge is above the pipe's bottom edge (top pipe)
            ) {
                return true; // Collision detected with the top pipe
            }
        }

        // Check collision with bottom pipe
        if (pipe.type === 'bottom') {
            if (
                birdXPosition + birdWidth > pipe.x && // Bird's right edge is past the pipe's left edge
                birdXPosition < pipe.x + pipeWidth && // Bird's left edge is before the pipe's right edge
                birdYPosition + birdHeight > pipe.y // Bird's bottom edge is below the pipe's top edge (bottom pipe)
            ) {
                return true; // Collision detected with the bottom pipe
            }
        }
    }

    // No collision detected with any pipes
    return false;
}

// Define properties for the scoreMenu sprite
const scoreMenu = {
    x: canvas.width / 2 - 113 / 2, // Center it horizontally, considering the width of 113px
    y: canvas.height, // Start at the bottom of the screen
    width: 113, // Width of the scoreMenu sprite
    height: 57, // Height of the scoreMenu sprite
    targetY: (canvas.height / 2 - 75 / 2) + 20, // Center it vertically
    speed: 5, // Speed for the slide-up animation
    image: spritesheet, // Reference to the spritesheet
    spriteX: 3, // X position of the sprite in the spritesheet
    spriteY: 259 // Y position of the sprite in the spritesheet
};

// Function to draw the scoreMenu
function drawScoreMenu() {	
    context.drawImage(
        scoreMenu.image,
        scoreMenu.spriteX, scoreMenu.spriteY, // Source position in the spritesheet
        scoreMenu.width, scoreMenu.height, // Source width and height
        scoreMenu.x, scoreMenu.y, // Destination on the canvas
        scoreMenu.width, scoreMenu.height // Size on the canvas
    );
	
    context.drawImage(
        scoreMenu.image,
        395, 59, // Source position in the spritesheet
        96, 21, // Source width and height
        canvas.width / 2 - 96 / 2, scoreMenu.targetY - 30, // Destination on the canvas
        96, 21 // Size on the canvas
    );
	
	// Determine which sprite to draw based on score
    let spriteX, spriteY;
    if (score > best_score) {
        spriteX = 121; // X position for the second sprite
        spriteY = 282; // Y position for the second sprite
    } else {
        spriteX = 121; // X position for the first sprite
        spriteY = 258; // Y position for the first sprite
    }

    // Draw the appropriate sprite inside the scoreMenu
    context.drawImage(
        spritesheet, // Use the same spritesheet
        spriteX, spriteY, // Source x and y
        22, 22, // Source width and height of the sprite
        scoreMenu.x + scoreMenu.width - 100, scoreMenu.y + scoreMenu.height / 2.8, // Destination x and y within the scoreMenu
        22, 22 // Destination width and height
    );
	
	// Draw the score inside the scoreMenu
    if (scoreMenu.y <= scoreMenu.targetY) { // Ensure the score is drawn when the menu is in place
        context.fillStyle = "#FFFFFF"; // Set the font color
        context.font = "9px flappy-number"; // Set the font style and size
        context.textAlign = "center"; // Align the text to the center
		
		// Set stroke style and draw text outline
		context.strokeStyle = 'black'; // Set outline color
		context.lineWidth = 2; // Set outline width to 2px
		context.strokeText(score, scoreMenu.x + scoreMenu.width / 1.2, scoreMenu.y + scoreMenu.height / 2.2); // Draw the outline
		
        context.fillText(score, scoreMenu.x + scoreMenu.width / 1.2, scoreMenu.y + scoreMenu.height / 2.2); // Draw the score at the center
	}
	
	// Draw the score inside the scoreMenu
    if (scoreMenu.y <= scoreMenu.targetY) { // Ensure the score is drawn when the menu is in place
        context.fillStyle = "#FFFFFF"; // Set the font color
        context.font = "9px flappy-number"; // Set the font style and size
        context.textAlign = "center"; // Align the text to the center
		
		// Set stroke style and draw text outline
		context.strokeStyle = 'black'; // Set outline color
		context.lineWidth = 2; // Set outline width to 2px
		context.strokeText(best_score, scoreMenu.x + scoreMenu.width / 1.2, scoreMenu.y + scoreMenu.height / 1.2); // Draw the outline
		
        context.fillText(best_score, scoreMenu.x + scoreMenu.width / 1.2, scoreMenu.y + scoreMenu.height / 1.2); // Draw the score at the center
	}
	
	context.zIndex = '5';
}

// Function to animate the slide-up
function updateScoreMenu() {
    if (scoreMenu.y > scoreMenu.targetY) {
        scoreMenu.y -= scoreMenu.speed; // Move it up towards the target position
    }
}

// Function to reset game variables
function resetGame() {
	birdY = 100;
	birdVelocityY = 0;
	birdRotation = 0;
	scoreMenu.y = canvas.height;
	collideEffect.style.animation = 'none';
    pipes = []; // Clear the pipes array
    score = 0; // Reset score
    gameOver = false; // Reset game over state
    // You can also reset any other variables here
}

function mainMenu() {	
	context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
	drawBackground();
	gameStart = false;
	gameOver = false;
	resetGame();
    
    // Calculate the center position for the sprite
    const y = (canvas.height - 49) / 2; // 49 is the height of the sprite

    // Draw the sprite (replace 'spriteImage' with your actual sprite image variable)
    context.drawImage(spritesheet, 292, 91, 57, 49, (canvas.width - 57) / 2, y + 10, 57, 49);
    context.drawImage(spritesheet, 295, 59, 92, 25, (canvas.width - 92) / 2, y - 30, 92, 25);
}

// Call the drawing functions within an animation loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawBackground(); // Draw the background (if you have it)
    drawBird(); // Draw the bird
    updateBird(); // Update the bird frame for animation
	
	drawPipes(); // Draw the pipes
    updatePipes(); // Update the pipes' positions
	drawScore(); // Draw the score
	
	// Check for collisions
    if (checkCollision() || fallCollision()) {
		if (!gameOver) {loseSound.play()};
        gameOver = true; // Set gameOver to true when collision occurs
        collideEffect.style.animation = 'collide 0.5s ease reverse';
		updateScoreMenu();
		drawScoreMenu();
    }
	
	if (!gameOver || (gameOver && scoreMenu.y > scoreMenu.targetY)) {
		requestAnimationFrame(gameLoop); // Repeat the loop
	}
}

// Add an event listener to ensure the image is loaded before using it
spritesheet.onload = () => {
	mainMenu();
};

// Add an event listener to resize the canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawBackground(); // Redraw the background on resize
});

let jumpPressed = false; // Track if the jump has been pressed

// Handle keydown events
function handleKeyDown(event) {
    if (event.code === 'Space') { // Check if spacebar is pressed
        if (!jumpPressed) { // Only act if the jump hasn't been pressed yet
            jumpPressed = true; // Set the flag to true
            if (gameStart && !gameOver) {
                birdVelocityY = jumpStrength; // Apply jump strength
                flySound.play();
            } else if (!gameStart) {
                gameStart = true;
                birdVelocityY = jumpStrength; // Apply jump strength
                flySound.play();
                gameLoop();
            } else if (gameOver) {
                // Change the condition here
                if (scoreMenu.y <= scoreMenu.targetY) { // Check if scoreMenu.y is less than or equal to targetY
                    mainMenu();
                }
            }
        }
    }
	
	if (event.code === 'Escape') {
		window.location.href = '../';
	}
}

// Handle keyup events to reset the jumpPressed flag
function handleKeyUp(event) {
    if (event.code === 'Space') { // Check if spacebar is released
        jumpPressed = false; // Reset the flag
    }
}

// Add event listeners
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);