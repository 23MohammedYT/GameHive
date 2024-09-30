const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

var background = new Audio("background.mp3");
var hover = new Audio("hover.wav");
var selecting = new Audio("select.mp3");

function updateCanvas() {
	// Set canvas size to fill the entire page
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

updateCanvas();

// Update canvas size on window resize
window.addEventListener('resize', updateCanvas);

class Bubble {
constructor(x, y, radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.speedX = Math.random() * 2 - 1; // Random speed in x direction
	this.speedY = Math.random() * 2 - 1; // Random speed in y direction
}

update() {
	this.x += this.speedX;
	this.y += this.speedY;

	// Change direction if it hits the edges
	if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
		this.speedX *= -1;
	}
	if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
		this.speedY *= -1;
	}
}

draw() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
	context.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Light white color for bubbles
	context.fill();
	context.closePath();
}
}

const bubbles = [];
const numBubbles = 20;

// Create bubbles with mixed sizes
for (let i = 0; i < numBubbles; i++) {
const radius = Math.random() * (i % 2 === 0 ? 20 : 50) + 5; // Random radius (5-25 for smaller, 5-70 for larger)
const x = Math.random() * (canvas.width - radius * 2) + radius;
const y = Math.random() * (canvas.height - radius * 2) + radius;
bubbles.push(new Bubble(x, y, radius));
}

function animate() {
context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
bubbles.forEach(bubble => {
	bubble.update();
	bubble.draw();
});
requestAnimationFrame(animate);
}

animate();

document.addEventListener('DOMContentLoaded', function() {
	background.play();
})

const items = document.querySelectorAll('.item');
let offset = 0; // Track the current offset for the items
let keyPressed = false;
let gameView = true;
const game_name = ['Ping Pong', 'Flappy Bird']; // Add game names here

const screenSettings = document.querySelectorAll('.screen_settings');
let settings_offest = 0;

// Function to update the class names based on the offset
function updateItemClasses() {
	items.forEach((item, index) => {
		// Clear previous class names
		item.classList.remove('left', 'right', 'selected');

		// Assign class names based on the offset
		if (index < offset) {
			item.classList.add('left');
		} else if (index > offset) {
			item.classList.add('right');
		} else {
			item.classList.add('selected');
		}

		// Manage z-index based on offset
		if (index === (offset + 1)) {
			item.style.zIndex = '1';
		} else if (index === offset) {
			item.style.zIndex = '2';
		} else {
			item.style.zIndex = '0';
		}
	});

	// Update game title based on the current offset
	const gameTitle = document.getElementById('game_title');
	if (game_name[offset]) {
		gameTitle.textContent = game_name[offset];
	} else {
		gameTitle.textContent = '???';
	}
	
	screenSettings.forEach(function(button) {
		if (!gameView && button == screenSettings[settings_offest]) {
			button.style.color = '#00FF00';
		} else {
			button.style.color = '#FFFFFF';
		}
	});
}

// Event listener for keyboard controls
document.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowUp') {
		if (gameView) {
			gameView = false;
			screenSettings[0].style.color = '#00FF00';
			document.querySelector('.selected').style.borderColor = '#FFFF00';
		}
		
		hover.play();
	} else if (event.key === 'ArrowDown') {
		if (!gameView) {
			gameView = true;
			document.querySelector('.selected').style.borderColor = '#00FF00';
			screenSettings.forEach(function(button) {
				button.style.color = '#FFFFFF';
			});
		}
		
		hover.play();
	}

	if (event.key === 'Enter') {
		if (gameView) {
			const fadeElement = document.querySelector('#fadeIn');
            fadeElement.style.animation = 'fadeColor 1s';
			
			fadeElement.addEventListener('animationend', function() {
				if (offset == 0) {
					window.location.href = 'pong/';
				} else if (offset == 1) {
					window.location.href = 'flappy/';
				}
            }, { once: true });
			
			background.pause();
		} else {
			if (settings_offest == 0) {
				if (!document.fullscreenElement && 
					!document.mozFullScreenElement && 
					!document.webkitFullscreenElement && 
					!document.msFullscreenElement) {
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) { // Firefox
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
						document.documentElement.webkitRequestFullscreen();
					} else if (document.documentElement.msRequestFullscreen) { // IE/Edge
						document.documentElement.msRequestFullscreen();
					}
				} else {
					// Exit full-screen mode if currently in full-screen
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.mozCancelFullScreen) { // Firefox
						document.mozCancelFullScreen();
					} else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
						document.webkitExitFullscreen();
					} else if (document.msExitFullscreen) { // IE/Edge
						document.msExitFullscreen();
					}
				}
				
				// Request full-screen and update canvas size when fully loaded
				function enterFullScreen() {
				  if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen().then(() => {
					  updateCanvas(); // Update canvas when full screen is activated
					});
				  }
				}

				// Run when the window has fully loaded
				window.onload = function() {
				  enterFullScreen(); // Trigger full screen
				  updateCanvas();    // Initial canvas sizing
				};
				
				updateCanvas();
			}
		}
		
		selecting.play();
	}

	if (!keyPressed) {
		if (event.key === 'ArrowLeft') {
			if (gameView) {
				// Move items left
				if (offset > 0) {
					offset--;
				}
			} else {
				if (settings_offest != (screenSettings.length - 1)) {settings_offest++};
			}
			
			hover.play();
		} else if (event.key === 'ArrowRight') {
			if (gameView) {
				// Move items right
				if (offset < (items.length - 1)) {
					offset++;
				}
			} else {
				if (settings_offest != 0) {settings_offest--};
			}
			
			hover.play();
		}
		
		// Update the class names after changing the offset
		updateItemClasses();
	}
	
	keyPressed = true;
});

document.addEventListener('keyup', () => {
	keyPressed = false; // Reset the flag when the key is released
});

// Initialize the classes on page load
updateItemClasses();