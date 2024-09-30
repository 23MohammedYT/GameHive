<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Flappy Bird Game</title>
		<style>
			@font-face {
				font-family: 'flappy-text';
				src: url('flappy-bird-text.ttf') format('truetype');
			}
			
			@font-face {
				font-family: 'flappy-number';
				src: url('flappy-bird-number.ttf') format('truetype');
			}
		
			body {
				margin: 0;
				overflow: hidden;
				font-family: 'flappy-text', sans-serif; /* Fallback font */
			}
			canvas {
				display: block;
				width: 100vw;
				height: 100vh;
			}
			
			#collideEffect {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: #fff;
				opacity: 0;
				animation: none;
			}
			
			@keyframes collide {
				to {
					opacity: 1;
				}
			}
		</style>
	</head>
	<body>
		<div id="collideEffect"></div>
		<canvas id="gameCanvas"></canvas>
		<script src="flappy.js"></script>
	</body>
</html>