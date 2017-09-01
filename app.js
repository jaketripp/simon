// =========
// VARIABLES
// =========

var sequence = [];
var userSequence;
var round = 1;
var numberToWin = 3;

var key = {
	1: '#red',
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

function removeEventHandlers(){
	$('.tile').off();
	$('.buttons').off();
	$('input').off();
	$('label#restart').off();
}

// ==============
// MAIN FUNCTIONS
// ==============

function init(){
	generateSequence();
	animateSequence();
}

function clickEvents(){
	// animation and audio for tiles
	$('.tile').on('click', function(e){

		var id = '#' + e.target.id;
		playAudio(id);
		$(id).addClass('picked');		
		
	});
	$('.buttons').on('transitionend', '.tile', removeTransition);

	// store whether strict mode enabled or not
	$('input[type="checkbox"]').on('click',function(){
	   if ($(this).attr('data-clicked') === 'true') {
			$(this).attr('data-clicked', 'false');
	   } else {
			$(this).attr('data-clicked', 'true');
	   }
	});

	// restart button
	$('label#restart').on('click', function(){
		reset();
		animateSequence();
	});
}

function updateDOM(){
	$('label#round')[0].textContent = minTwoDigits(round);
	if (round === numberToWin){
		$('label#round')[0].textContent = 'FINAL';
	}
}

function reset(){
	round = 1;
	updateDOM();
	generateSequence();
	console.log(userSequence);
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

function generateSequence(){
	sequence = [];
	userSequence = [];
	for (var i = 1; i <= numberToWin; i++){
		var curr = getRandomInt(1,4);
		sequence.push(key[curr]);
	}
	console.log(sequence);
}

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
	
	$('.buttons').on('click', '.tile', function(e){
		

		if (userSequence.length <= round){

			var id = '#' + e.target.id;
			userSequence.push(id);

		} 
		console.log(userSequence)
		outcomeOfUserSequence();
	});
}

function outcomeOfUserSequence(){
	// if strict mode, generate new sequence and reset round back to 1
	if (!checkUserSequence()) {

		var strictMode = $('input[type="checkbox"]').attr('data-clicked');
		if (strictMode === 'true'){
			reset();
		}
		setTimeout(function(){
			$('#fail')[0].play();
		}, 1000);
		setTimeout(function(){
			animateSequence();
		}, 5000)
	} else {
		console.log('user sequence length ' + userSequence.length);
		console.log('round ' + round);

		// final sequence done
		if (userSequence.length === numberToWin){
			setTimeout(function(){
				winMessage();
			}, 300);
			return;
		}
		// did correct sequence so far
		if (userSequence.length === round){
			round++;
			updateDOM();
			setTimeout(function(){
				animateSequence();
			}, 1000);
		}

	}
}

function winMessage(){
	$('#congrats')[0].play();
	reset();

	$('.ui.modal')
		.modal('setting', 'transition', 'fade')
		.modal({
			onDeny: function(){
				return true;
			},
			onApprove: function(){
				setTimeout(function(){
					animateSequence();
				}, 300);
			},
		})
		.modal('show');
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


// when array is length 20, have cool semantic alert that you won

// strict mode is a toggle so that if you get one wrong it restarts

init();