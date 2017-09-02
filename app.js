// =========
// VARIABLES
// =========

var sequence = [];
var userSequence;
var round = 1;
var numberToWin = 20;

var key = {
	1: '#orange',
	2: '#green',
	3: '#yellow',
	4: '#blue'
}

// ===================
// AUXILIARY FUNCTIONS
// ===================

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==============
// MAIN FUNCTIONS
// ==============

function init(){
	generateSequence();
	animateSequence();
}

function generateSequence(){
	sequence = [];
	userSequence = [];
	for (var i = 1; i <= numberToWin; i++){
		var curr = getRandomInt(1,4);
		sequence.push(key[curr]);
	}
}

function animateSequence(){
	removeEventHandlers();

	var i = 0;
	// amount of milliseconds to end the setInterval
	var timeToKillInterval = (round * 1000) + 500

	var endIntervalID = setInterval(function(){
		playAudio(sequence[i]);
		$(sequence[i]).addClass('picked');
		$(sequence[i]).on('transitionend', removeTransition);
		i++;		
	}, 1000);

	// after animation, end the setInterval, add click events, track user
	setTimeout(function(){
		clearInterval(endIntervalID);
		trackUserSequence();
	},timeToKillInterval);	
}


// EVENTS
function clickEvents(){
	// animation and audio for tiles
	$('.tile').on('click', function(e){
		var id = '#' + e.target.id;
		playAudio(id);
		$(id).addClass('picked');		
	});
	$('.buttons').on('transitionend', '.tile', removeTransition);

	// restart button
	$('#restart').on('click', function(){
		reset();
		animateSequence();
	});

	keyDownEvent();
}

// just for fun, doesn't get tracked though (kinda an Easter Egg)
function keyDownEvent(){

	var keyCodeToColor = {
		82: "#orange",
		71: "#green",
		89: "#yellow",
		66: "#blue"
	}

	$('body').keydown(function(e){
		if (keyCodeToColor[e.which]){
			var id = keyCodeToColor[e.which];
			playAudio(id);
			$(id).addClass('picked');
		}
	})

	$('.buttons').on('transitionend', '.tile', removeTransition);
}

// updates the round number
function updateDOM(){
	$('label#round')[0].textContent = 'ROUND ' + minTwoDigits(round);
	if (round === numberToWin){
		$('label#round')[0].textContent = 'FINAL ROUND';
	}
}

// RESETTING
function reset(){
	round = 1;
	updateDOM();
	generateSequence();
}

function removeTransition(e) {
    if (e.originalEvent.propertyName !== 'opacity') {
    	return;
    }
	e.target.classList.remove('picked');
}

function removeEventHandlers(){
	$('.tile').off();
	$('.buttons').off();
	$('input').off();
	$('#restart').off();
	$('body').off();
}

// plays audio (allows to play again before finishing completely)
function playAudio(id){
	var audio = $(id + ' audio')[0];
	audio.currentTime = 0;
	audio.play();
}

function trackUserSequence(){
	userSequence = [];
	removeEventHandlers();
	clickEvents();
	
	$('.buttons').on('click', '.tile', function(e){

		if (userSequence.length <= round){
			var id = '#' + e.target.id;
			userSequence.push(id);
		} 

		outcomeOfUserSequence();
	});
}

// checks if user presses a wrong tile
function checkUserSequence(){

	// the sequence so far
	var miniSequence = sequence.slice(0, round);

	// if the user doesn't match the sequence so far, return false
    for(var i = 0; i < userSequence.length; i++) {
        if(miniSequence[i] !== userSequence[i]) {
            return false;
        }
    }
    return true;
}

function outcomeOfUserSequence(){
	// user pressed wrong tile
	if (!checkUserSequence()) {

		// with strict mode
		strictModeAndLost();

		setTimeout(function(){
			animateSequence();
		}, 2000)

	// user pressed right tile
	} else {
		ifUserWon();
		ifUserCompletedRound();
	}
}

// play the trumpet sound, reset stuff, animate new sequence
function strictModeAndLost(){
	var strictModeEnabled = $('input[type="checkbox"]').prop('checked');
	if (strictModeEnabled){
		setTimeout(function(){
			$('#fail')[0].play();
		}, 1000);
		reset();
		setTimeout(function(){
			animateSequence();
		}, 7000)
		return;
	}
}

function ifUserWon(){
	// final sequence done
	if (userSequence.length === numberToWin){
		setTimeout(function(){
			winMessage();
		}, 300);
		return;
	}
}

function ifUserCompletedRound(){
	// did correct sequence so far
	if (userSequence.length === round){
		round++;
		updateDOM();
		setTimeout(function(){
			animateSequence();
		}, 1000);
	}
}

// congrats sound, reset, and semantic modal for if user won
function winMessage(){
	$('#congrats')[0].play();
	reset();

	$('.ui.modal')
		.modal('setting', 'transition', 'fade')
		.modal({
			onApprove: function(){
				setTimeout(function(){
					animateSequence();
				}, 300);
			}
		})
		.modal('show');
}

init();