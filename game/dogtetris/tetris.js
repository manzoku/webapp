var FIELD_W = 300, FIELD_H = 540;
var COLS = 10, ROWS = 18;
var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
var current_mino;
var current_x = 3, current_y = 0;
var field = [];
var score = 0;
var fieldXMargin = Math.floor(document.getElementById("field").getBoundingClientRect().left),
	fieldYMargin = Math.floor(document.getElementById("field").getBoundingClientRect().top);
var timerId;

for (var y = 0; y < ROWS; y++) {
	field[y] = [];
	for (var x = 0; x < COLS; x++) {
		field[y][x] = 0;
	}
}

createPattern(ctx, function() {
	current_mino = newMino();
	render();
	timerId = setInterval(tick, 500);
});

function render() {
	ctx.clearRect(0, 0, FIELD_W, FIELD_H);
	ctx.strokeStyle = "black";
	for (var y = 0; y < ROWS; y++) {
		for (var x = 0; x < COLS; x++) {
			drawBlock(x, y, field[y][x]);
		}
	}
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			drawBlock(current_x + x, current_y + y, current_mino[y][x]);
		}
	}
}
 
function drawBlock(x, y, block) {
	if (block) {
		ctx.fillStyle = PATTERNS[block - 1];
		ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
		//ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
	}
}
 
function tick() {
	var isNew = true;
	if (canMove(0, 1)) {
		current_y++;
		isNew = false;
	} else {
		fix();
		clearRows();
		current_mino = newMino();
		current_x = 3;
		current_y = 0;
	}
	render();
	if (isNew && !canMove(-1, 0) && !canMove(0, 1) && !canMove(0,1)) {
		clearInterval(timerId);
		alert("gameover");
	}
}
 
function fix() {
	for (var y = 0; y < 4; ++y) {
		for (var x = 0; x < 4; ++x) {
			if (current_mino[y][x]) {
				field[current_y + y][current_x	+ x] = current_mino[y][x];
			}
		}
	}
}
 
function canMove(move_x, move_y, move_mino) {
	var next_x = current_x + move_x;
	var next_y = current_y + move_y;
	var next_mino = move_mino || current_mino;
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			if (next_mino[y][x]) {
				if (next_y + y >= ROWS
							|| next_x + x < 0
							|| next_x + x >= COLS
							|| field[next_y + y][next_x + x]) {
					return false;
				}
			}
		}
	}
	return true;
}

function showScore() {
	document.getElementById("score").innerHTML = score;
}

function clearRows() {
	for (var y = ROWS - 1; y >=0; y--) {
		var fill = true;
		for (var x = 0; x < COLS; x++) {
			if (field[y][x] == 0) {
				fill = false;
				break;
			}
		}
		if (fill) {
			for (var v = y - 1; v >= 0; v--) {
				for (var x = 0; x < COLS; x++) {
					field[v + 1][x] = field[v][x];
				}
			}
			y++;
		score++;
		}
	}
	showScore();
}

function moveLeft() {
	if (canMove(-1, 0)) {
		current_x--;
	}
	render();
}
function moveRight() {
	if (canMove(1, 0)) {
		current_x++;
	}
	render();
}
function moveDown() {
	if (canMove(0, 1)) {
		current_y++;
	}
	render();
}
function rotation() {
	rotated = rotate(current_mino);
	if (canMove(0, 0, rotated)) {
		current_mino = rotated;
	}
	render();
}

document.body.onkeydown = function(e) {
	switch (e.keyCode) {
		case 37:
			moveLeft();
			break;
		case 39:
			moveRight();
			break;
		case 40:
			moveDown();
			break;
		case 32:
		case 38:
			rotation();
			break;
	}
}

document.getElementById("field").addEventListener('touchstart', function(e) {
	var x = e.targetTouches[0].clientX - fieldXMargin,
		y = e.targetTouches[0].clientY - fieldYMargin;
	if (x < 100) {
		moveLeft();
	} else if (200 < x) {
		moveRight();
	} else {
		if (y < 440) {
			rotation();
		} else {
			moveDown();
		}
	}
}, false);