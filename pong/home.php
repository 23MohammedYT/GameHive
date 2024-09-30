<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
		<title>Ping Pong Game</title>
		<style>
			html, body {
				margin: 0;
				padding: 0;
				height: 100%;
				overflow: hidden;
			}

			canvas {
				display: none; /* Hide the game canvas initially */
				background-color: #000;
				width: 100vw;
				height: 100vh;
			}

			/* Main menu styling */
			#mainMenu {
				justify-content: center;
				align-items: center;
				height: 100vh;
				background-color: #111;
				color: white;
				font-family: 'Press Start 2P', sans-serif;
			}
			
			.title {
				position: absolute;
				top: 40%;
				left: 50%;
				transform: translateX(-50%);
				font-size: 40px;
			}
			
			.all_buttons {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 10%;
				display: flex;
				flex-direction: column;
			}

			#mainMenu button {
				margin: 10px;
				padding: 15px 30px;
				font-size: 20px;
				background: transparent;
				font-family: 'Press Start 2P', sans-serif;
				color: white;
				border: none;
				cursor: pointer;
			}

			#mainMenu button:hover {
				background-color: #555;
				color: #00FF00;
			}
		</style>
	</head>
	<body>
		<!-- Main menu -->
		<div id="mainMenu">
			<div class="title">Ping Pong</div>
			<div class="all_buttons">
				<button class="game_button" id="startGameBtn">Start Game</button>
				<button class="game_button" id="settingsBtn">Settings</button>
				<button class="game_button" id="exitBtn">Exit</button>
			</div>
		</div>

		<!-- Game canvas -->
		<canvas id="gameCanvas" width="800" height="600"></canvas>

		<script src="pingpong.js"></script>
	</body>
</html>