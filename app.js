
function buttonAnimations(){
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

function playAudio(id){
	$(id + ' audio')[0].play();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 


buttonAnimations();