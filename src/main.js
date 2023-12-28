import kaboom from "kaboom";

const BOARD_SIZE = 4;

kaboom({
	background: [200, 200, 200],
	width: 1280,
	height: 600,
	scale: 1,
	debug: true,
});

loadRoot("sprites/");
loadSprite("background", "background.png")
loadSprite("two", "two.png");
loadSprite("four", "four.png");
loadSprite("eight", "eight.png");
loadSprite("onesix", "onesix.png");
loadSprite("threetwo", "threetwo.png");
loadSprite("sixfour", "sixfour.png");
loadSprite("onetwoeight", "onetwoeight.png");
loadSprite("twofivesix", "twofivesix.png");

const spriteMap = new Map([
	[2, "two"],
	[4, "four"],
	[8, "eight"],
	[16, "onesix"],
	[32, "threetwo"],
	[64, "sixfour"],
	[128, "onetwoeight"],
	[256, "twofivesix"],
]);

// let board = Array(4).fill().map(() => Array(4).fill(0));
// For testing purposes only
let board = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
]

let coordinates = [
	[[450, 110], [450, 210], [450, 310], [450, 410]],
	[[550, 110], [550, 210], [550, 310], [550, 410]],
	[[650, 110], [650, 210], [650, 310], [650, 410]],
	[[750, 110], [750, 210], [750, 310], [750, 410]]
]
/*
class Tile {
	constructor(id, row, col, val) {
		this.id = id
		this.row = row
		this.col = col
		this.val - val
	}

	create(spriteName) {
		add([
			sprite(spriteName),
			anchor("center"),
			pos(490 + col * 100,  150 + row * 100),
			"tile",
		]);			
	}

	destroy() {

	}

	slide(newRow, newCol) {
		this.row = newRow
		this.col = newCol
	}

	changeValue(newVal) {
		this.value = newVal
	}
}
*/
/*
for (let y = 0; y < 4; y++) {
	for (let x = 0; x < 4; x++) {
		add([
			pos(450 + x * 100, 110 + y * 100),
			rect(80, 80),
			color(238, 228, 218),
			area(),
		])
	}
}	
*/

let score = 0;

add([
	text("SCORE", { size: 20, font: "sink" }),
	pos(100, 40),
	color(BLACK),
	anchor("center"),
	// layer("ui"),
]);

const scoreText = add([
	text("000000", { size: 20, font: "sink" }),
	pos(100, 60),
	color(BLACK),
	anchor("center"),
	// layer("ui"),
]);

function updateScore(points) {
	score += points;
	scoreText.text = score.toString().padStart(6, "0");
}

function drawBackground() {
	add([
		sprite("background"),
		anchor("center"),
		scale(1),
		pos(640, 300),
	]);
}

function drawTiles() {
	destroyAll("tile")
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] > 0) {
				const spriteName = spriteMap.get(board[row][col]);
				add([
					sprite(spriteName),
					anchor("center"),
					pos(505 + col * 90, 165 + row * 90),
					fadeIn(0),
					opacity(0),
					{
						row: row,
						col: col,
					},
					"tile",
				]);
			}
		}
	}
}

function shiftNumbersLeft(arr) {
	let originalLength = arr.length;
	arr = arr.filter((e) => e != 0);
	while (arr.length < originalLength) { arr.push(0) };
	return arr;
}

function mergeSimilarNumbers(arr) {
	for (let i = 0; i < 4; i++) {
		if (arr[i] == arr[i + 1]) {
			arr[i] *= 2;
			updateScore(arr[i]);
			arr[i + 1] = 0;
		}
	}
	return arr;
}

// Move functions
function moveLeft() {
	for (let row = 0; row < 4; row++) {
		let temp = board[row];
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		board[row] = temp;
	}
}

function moveRight() {
	for (let row = 0; row < 4; row++) {
		let temp = board[row].reverse();
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		board[row] = temp.reverse();
	}
}

function moveUp() {
	for (let col = 0; col < 4; col++) {
		let temp = Array();
		for (let row = 0; row < 4; row++) {
			temp.push(board[row][col]);
		}
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		for (let row = 0; row < 4; row++) {
			board[row][col] = temp[row];
		}
	}
}

function moveDown() {
	for (let col = 0; col < 4; col++) {
		let temp = Array();
		for (let row = 3; row > -1; row--) {
			temp.push(board[row][col]);
		}
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		for (let row = 3; row > -1; row--) {
			board[row][col] = temp[3 - row];
		}
	}
}

function updateGame() {
	addRandomTile();
	// drawTiles();
}

// Event Listeners
onKeyPress("up", () => {
	//moveUp();
	updateGame();
});

onKeyPress("down", () => {
	//moveDown();
	updateGame();
});

onKeyPress("left", () => {
	//moveLeft();
	updateGame();
});

onKeyPress("right", () => {
	//moveRight();
	updateGame();
});

/**
 * 
 * @returns boolean
 */
function boardFull() {
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (board[row][col] === 0) {
				return false;
			}
		}
	}
	console.log("board full");
	return true;
}

/**
 * If the board is full and no similar numbers appear next to each other.
 * 
 * @returns boolean
 */
function gameOver() {
	if (!boardFull) { return false };
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			// Compare right
			if (col < 3 && board[row][col] == board[row][col + 1]) {
				return false;
			}
			// Compare down
			if (row < 3 && board[row][col] == board[row + 1][col]) {
				return false;
			}
		}
	}
}

function printBoard() {
	for (let row = 0; row < 4; row++) {
		console.log(board[row]);
	}
}

function addTile(row, col, val) {
	const spriteName = spriteMap.get(val);
	board[row][col] = val;
	add([
		sprite(spriteName),
		anchor("center"),
		pos(505 + col * 90, 165 + row * 90),
		fadeIn(1),
		opacity(0),
		{
			row: row,
			col: col,
		},
		"tile",
	]);
}

function addRandomTile() {
	if (!boardFull()) {
		// 90% chance of 2. 10% chance of 4
		const val = Math.random() < 0.9 ? 2 : 4;
		while (true) {
			let row = Math.floor(Math.random() * 4);
			let col = Math.floor(Math.random() * 4);
			if (board[row][col] === 0) {
				board[row][col] = val;
				console.log("adding: ", row, col, val)
				addTile(row, col, val);
				break;
			}
		}
	}
}

// Start Game
drawBackground();
addRandomTile();
updateGame();

