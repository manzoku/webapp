var MINOS = [
	[
		[1, 1, 1, 1],
		[0, 0, 0, 0] // I テトリミノ
	],
	[
		[0, 1, 1, 0],
		[0, 1, 1, 0] // O テトリミノ
	],
	[
		[0, 1, 1, 0],
		[1, 1, 0, 0] // S テトリミノ
	],
	[
		[1, 1, 0, 0],
		[0, 1, 1, 0] // Z テトリミノ
	],
	[
		[1, 0, 0, 0],
		[1, 1, 1, 0] // J テトリミノ
	],
	[
		[0, 0, 1, 0],
		[1, 1, 1, 0] // L テトリミノ
	],
	[
		[0, 1, 0, 0],
		[1, 1, 1, 0] // T テトリミノ
	]
];
 
var PATTERNS = [];

function newMino() {
	var id = Math.floor(Math.random() * MINOS.length);
	var mino = [];
	for (var y = 0; y < 4; y++) {
		mino[y] = [];
		for (var x = 0; x < 4; x++) {
			mino[y][x] = 0;
			if (MINOS[id][y]) {
				if (MINOS[id][y][x]) {
					mino[y][x] = id + 1;
				}
			}
		}
	}
	return mino;
}
 
function rotate(mino) {
	var rotated = [];
	for (var y = 0; y < 4; ++y) {
		rotated[y] = [];
		for (var x = 0; x < 4; ++x) {
			rotated[y][x] = mino[x][- y + 3];
		}
	}
	return rotated;
}

function shuffle(array) {
	var n = array.length, t, i;
	while (n) {
		i = Math.floor(Math.random() * n--);
		t = array[n];
		array[n] = array[i];
		array[i] = t;
	}
	return array;
}

function createPattern(context, callback) {
	var imgSrc = ['images/web_001.png','images/web_002.png','images/web_003.png','images/web_004.png','images/web_005.png','images/web_006.png','images/web_007.png','images/web_008.png'],
		img = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
		state = 0;
	imgSrc = shuffle(imgSrc);
	for (i=0; i<img.length; i++) {
		img[i].src = imgSrc[i];
		img[i].onload = function() {
			PATTERNS.push(context.createPattern(this, 'repeat'));
			state++;
			if (state >= img.length) {
				callback();
			}
		};
	}
}