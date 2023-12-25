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
loadSprite("two", "two.png")

// let board = Array(4).fill().map(() => Array(4).fill(0));
// For testing purposes only
let board = [
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
]

let coordinates = [
	[[450, 110], [450, 210], [450, 310], [450, 410]],
	[[550, 110], [550, 210], [550, 310], [550, 410]],
	[[650, 110], [650, 210], [650, 310], [650, 410]],
	[[750, 110], [750, 210], [750, 310], [750, 410]]
]

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

// with options
add([
	pos(40, 40),
	color(BLACK),
	text("Score: 1234", {
		size: 24,
		width: 320, // it'll wrap to next line when width exceeds this value
		font: "sans-serif", // specify any font you loaded or browser built-in
	}),
])

function drawGrid() {

	// Big Box
	add([
		pos(440, 100),
		rect(400, 400),
		color('#bbada0'),
		area(),
	])

	// Little Boxes
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
}

function drawTiles() {
	for (let row=0; row<4; row++) {
		for (let col=0; col<4; col++) {
			if (board[row][col] > 0) {
				add([
					sprite("two"),
					scale(1),
					anchor("center"),
					pos(490 + col * 100,  150 + row * 100),
					area(),
				]);			
			}
		}
	}
}

function shiftNumbersLeft(arr) {
	let originalLength = arr.length;
	arr = arr.filter((e) => e != 0);
	while (arr.length < originalLength) {arr.push(0)};
	return arr;
}

function mergeSimilarNumbers(arr) {
	for (let i=0; i<4; i++) {
		if (arr[i] == arr[i+1]) {
			arr[i] *= 2;
			arr[i+1] = 0;	
		}
	}
	return arr;
}

// Move functions
function moveLeft() {
	for (let row=0; row<4; row++) {
		let temp = board[row];
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		board[row] = temp;
	}
}

function moveRight() {
	for (let row=0; row<4; row++) {
		let temp = board[row].reverse();
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		board[row] = temp.reverse();
	}
}

function moveUp() {
	for (let col=0; col<4; col++) {
		let temp = Array();
		for (let row=0; row<4; row++) {
			temp.push(board[row][col]);
		}
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		for (let row=0; row<4; row++) {
			board[row][col] = temp[row];
		}
	}
}

function moveDown() {
	for (let col=0; col<4; col++) {
		let temp = Array();
		for (let row=3; row>-1; row--) {
			temp.push(board[row][col]);
		}
		temp = shiftNumbersLeft(temp);
		temp = mergeSimilarNumbers(temp);
		temp = shiftNumbersLeft(temp);
		for (let row=3; row>-1; row--) {
			board[row][col] = temp[3-row];
		}
	}
}

// Event Listeners
onKeyPress("up", () => {
	moveUp();
});

onKeyPress("down", () => {
	moveDown();
});

onKeyPress("left", () => {
	moveLeft();
	printBoard()
	drawGrid();
	drawTiles();
});

onKeyPress("right", () => {
	moveRight();
});

function boardFull() {
	for (let row=0; row<4; row++) {
		for (let col=0; col<4; col++) {
			if (board[row][col] === 0) {
				return false;
			}
		}	
	}
	console.log("board full");
	return true;
}

function printBoard() {
	for (let row=0; row<4; row++) {
		console.log(board[row]);
	}
}

function addRandomTile() {
	if (!boardFull()) {
		// 90% chance of 2. 10% chance of 4
		let val = Math.random() < 0.9 ? 2 : 4;
		while (true) {
			let row = Math.floor(Math.random()*4);
			let col = Math.floor(Math.random()*4);
			if (board[row][col] === 0) {
				board[row][col] = val;
				console.log("adding: ", row, col, val)
				break;
			}
		}
	}
}

for (let i=0; i<5; i++) {
	addRandomTile();
}
printBoard()
drawGrid();
drawTiles();

