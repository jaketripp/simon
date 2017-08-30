
var numSeries = [4, 1, 4, 1, 1, 3, 4, 3, 3, 4, 1, 3, 3, 2, 2, 4, 3, 3, 4, 2, 1];
var quadrantSeries = [];

var quadrantKey = {
	1: '#topRight',
	2: '#topLeft',
	3: '#bottomLeft',
	4: '#bottomRight'
}

function init(){
	addNewStep();
	clickEvents();
	// computerAnimations();
}

function clickEvents(){
	$('.button').on('click', function(e){

		var id = '#' + e.target.id;

		playAudio(id);

		$(id).animate({
			opacity: 0.7,
		}, 200);

		$(id).animate({
			opacity: 1,
		}, 200);
	});
}

// function computerAnimations(){
// 	numSeries.forEach(function(num){
// 		var id = quadrantKey[num];
// 		playAudio(id);

// 		$(id).animate({
// 			opacity: 0.7,
// 		}, 200);

// 		$(id).animate({
// 			opacity: 1,
// 		}, 200);	
// 	});
// }

function playAudio(id){
	$(id + ' audio')[0].play();
}

// $('#congrats')[0].play();
// $('#fail')[0].play();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addNewStep(){
	var curr = getRandomInt(1,4);
	numSeries.push(curr);
	quadrantSeries.push(quadrantKey[curr]);
}


// have a global array of up to 20 numbers [1-4] inclusive
// when you press start, empty the array, generate new random number
// have an object that translates number to selector
// when you click the right sequence, push a new number to array
// when array is length 20, have cool semantic alert that you won

// have the current length of the array (current number of sequence)
// displayed always

// if you press the wrong button, semantic alert that it was wrong

// strict mode is a toggle so that if you get one wrong it restarts
// use audio for link finding cool thing when you win
// paper mario game over for when you lose


init();