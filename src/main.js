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
	[2,2,4,4],
	[2,4,4,2],
	[2,2,2,2],
	[2,4,2,4]
]

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
	for (let y=0; y<4; y++) {
		for (let x=0; x<4; x++) {
			if (Math.floor(Math.random() * 2) == 0) {
				add([
					sprite("two"),
					scale(1),
					anchor("center"),
					pos(490 + x * 100,  150 + y * 100),
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

console.log("Before: ", board);
moveLeft();
console.log("After: ", board);

function moveRight() {
	// TODO
}

function moveUp() {
	// TODO
}

function moveDown() {
	// TODO
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
});

onKeyPress("right", () => {
	moveRight();
});

drawGrid();
drawTiles();


