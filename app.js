
var sequence = [];
var userSequence;

var key = {
	1: '#red',
	2: '#green',
	3: '#yellow',
	4: '#blue'
}

function init(){
	generateSequence();
	animateSequence();
}

function clickEvents(){
	$('.button').on('click', function(e){

		var id = '#' + e.target.id;
		playAudio(id);
		$(id).addClass('picked');		
		
	});
	$('.buttons').on('transitionend', '.button', removeTransition);

	$('label#restart').on('click', reset);
}

function updateDOM(){
	$('label#round')[0].textContent = minTwoDigits(round);
}

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

function reset(){
	round = 1;
	updateDOM();
	generateSequence();
	animateSequence();
	console.log(userSequence);
}



function removeEventHandlers(){
	$('.button').off();
	$('.buttons').off();
	$('label#restart').off();
}

function removeTransition(e) {
    if (e.originalEvent.propertyName !== 'opacity') {
    	return;
    }
	e.target.classList.remove('picked');
  }


function playAudio(id){
	var audio = $(id + ' audio')[0];
	audio.currentTime = 0;
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
	userSequence = [];
	for (var i = 1; i <= 20; i++){
		var curr = getRandomInt(1,4);
		sequence.push(key[curr]);
	}
	console.log(sequence);
}

// increment this every time the user does this many clicks correct
// when it gets to 20, press
var round = 1;

function animateSequence(){

	removeEventHandlers();

	var i = 0;
	var timeToKillInterval = (round * 1000) + 500

	var endIntervalID = setInterval(function(){
		playAudio(sequence[i]);
		$(sequence[i]).addClass('picked');
		$(sequence[i]).on('transitionend', removeTransition);
		i++;		
	}, 1000);

	setTimeout(function(){
		clearInterval(endIntervalID);
		clickEvents();
		trackUserSequence();
	},timeToKillInterval);	
}

function trackUserSequence(){
	userSequence = [];
	removeEventHandlers();
	clickEvents();

	$('.buttons').on('click', '.button', function(e){
		

		if (userSequence.length <= round){

			var id = '#' + e.target.id;
			userSequence.push(id);

		} 
		console.log(userSequence)

		// if strict mode, generate new sequence and reset round back to 1
		if (!checkUserSequence()) {
			setTimeout(function(){
				$('#fail')[0].play();
			}, 1000);
			setTimeout(function(){
				animateSequence();
			}, 5000)
		} else {
			console.log('user sequence length ' + userSequence.length);
			console.log('round ' + round);
			if (userSequence.length === round){
				round++;
				updateDOM();
				setTimeout(function(){
					animateSequence();
				}, 1000);
					
			}
			// set to 21 eventually
			if (round === 21){
				setTimeout(function(){
					$('#congrats')[0].play();
				}, 300);
			}
		}
	});
}

// as soon as you get one wrong play the sad thing
// wait until the end of the round to play the right thing 

function checkUserSequence(){

	var miniSequence = sequence.slice(0, round);

    for(var i = 0; i < userSequence.length; i++) {
        if(miniSequence[i] !== userSequence[i]) {
            return false;
        }
    }
    return true;
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