
var sequence = [];

var key = {
	1: '#red',
	2: '#green',
	3: '#yellow',
	4: '#blue'
}

function init(){
	generateSequence();
	events();
	animateSequence();
}

function events(){
	$('.button').on('click', function(e){

		var id = '#' + e.target.id;
		playAudio(id);
		$(id).addClass('picked');		
		
	});
	$('.buttons').on('transitionend', '.button', removeTransition);
}

function removeTransition(e) {
    if (e.originalEvent.propertyName !== 'opacity') {
    	return;
    }
	e.target.classList.remove('picked');
  }


function playAudio(id){
	var audio = $(id + ' audio')[0];
	audio.play();
}

// if they get all 20 in a row
// $('#congrats')[0].play();

// if strict mode is toggled and they miss one
// $('#fail')[0].play();
// then clear 

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence(){
	sequence = [];
	for (var i = 1; i <= 20; i++){
		var curr = getRandomInt(1,4);
		sequence.push(key[curr]);
	}
	console.log(sequence);
}

function animateSequence(){

	var count = 0;

	var endIntervalID = setInterval(function(){
		playAudio(sequence[count]);
		$(sequence[count]).addClass('picked');
		$(sequence[count]).on('transitionend', removeTransition);
		count++;		
	}, 1000);

	setTimeout(function(){
		clearInterval(endIntervalID);
	},21500)
	
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

// iterate through quadrant array and make sure that you click the right one
// if you don't, play the computer animations again and let the user try again
// if you get them all, add a new step



init();