/**
 * Global Variables
 */

var numberOfTimes = 10;
var totalTrials = 0;
var trialStatus = 0;
var trialStartTimeStamp = null;

var counter = 0;
var countdown = 3;
var timer = null;
var countdowntimer = null;
var mode = null;
var currentType = null;
var uiCalls =0;
var trialNumber = 0;
var categories = [];
var audio = null;

var answers = [];

/**
 *Wait for the DOM to load. Init eveything once loaded.
 */
$(document).ready(function() {

	init();
	//Add listenener to the button
});

function init() {

	$('#thanks').hide();

	$('#content').hide();

	$.getJSON('sounds.json', function(data) {
		audio = eval(data);
		totalTrials = audio.length * numberOfTimes;
	});

	$.getJSON('categories.json', function(data) {
		categories = eval(data);
	});
	//Set the mode
	if (mode == null)
		setMode();
	else {

		cacheSoundFiles(0);
			
		//Draw all the elements on the screen
	}

}

function setMode() {
	$("#content").hide();
	// set mode
	$.getJSON('getData.php', function(resp) {
		resp = eval(resp);
		console.log(resp);
		mode = resp[0];

		trialStartTimeStamp = $.now();
		init();

	});
}

jQuery.fn.center = function() {
	this.css("position", "absolute");
	// this.css("top", Math.max(0, (($(window).height() -$(this).outerHeight()) / 2) ) + "px");
	// this.css("left", Math.max(0, (($(window).width() -$(this).outerWidth())) / 2) + "px");
	//

	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");

	return this;
};
function positionOnCircle(itemNo, item) {

	var degrees = 72 * itemNo;

	//set the angle of the point, then convert it into radians
	var radians = degrees * Math.PI / 180;

	var x = 250 * Math.cos(radians);
	var y = 250 * Math.sin(radians);

	item.attr('id', itemNo);

	item.css("position", "absolute");
	//if(itemNo==0){

	var ny = Math.max(0, (($(window).height() - item.outerHeight()) / 2 + $(window).scrollTop() + y ));
	var nx = Math.max(0, (($(window).width() - item.outerWidth()) / 2 + $(window).scrollLeft() + x));

	var oy = Math.max(0, (($(window).height()) / 2));
	var ox = Math.max(0, (($(window).width()) / 2));

	item.css("top", ny + "px");

	item.css("left", nx + "px");

	//console.log("(x:" + x + "y:" + y + ")" + "(ox:" + ox + "oy:" + oy + ")" + "(nx:" + nx + "ny:" + ny + ")");
	//}
}

function renderUI() {
	if(uiCalls==0){
		uiCalls++;
	$("#sound").prop("muted", false);
	//hide the progress related ui elements
	$('#progressWrapper').hide();
	//Show the content
	$("#content").show();

	//Centre the Next Trial Button and countdown text
	$('#nextTrial').center();

	//init the trialNumber counter
	$("#trialsCompleted").html("Trials Completed: " + trialNumber + "/" + totalTrials);

	//Position the other buttons in a circle around the cetre button
	$.each($('.answers'), function(i, item) {
		positionOnCircle(i, $(item));
		var $img = $('<img>').attr('src', categories[i].img);
		$img.attr('width', '75px');
		$img.attr('height', '75px');
		$(item).append($img);
	});
	//Add listeners
	$('#nextTrial').click(function(obj) {
		if (trialNumber > totalTrials)
			finishTrial();
		else
			startCountdown();

	});
	$('.answers').click(function(event) {
		if (timer) {

			stopInterval();
			$("#nextTrial").show();
			$(this).children('.reactionTime').html(counter * 10 + " ms");
			if ($(this).attr('id') == currentType) {

				var answer = new Object();
				//answer.timeStamp = event.timeStamp;
				answer.timeStamp = trialStartTimeStamp;
				answer.mode = mode;
				answer.trialNo = trialNumber;
				answer.reactionTime = counter * 10;

				answers.push(answer);

				trialNumber++;
				if (trialNumber == totalTrials)
					finishTrial();

				increaseCount(currentType);
				$("#trialsCompleted").html("Trials Completed: " + trialNumber + "/" + totalTrials);
				$("#triangle").show();
				$('#nextTrial label').html('');
				$(this).addClass('correct');

			} else {
				$("#trialsCompleted").html("Trials Completed: " + trialNumber + "/" + totalTrials);
				$("#triangle").show();
				$('#nextTrial label').html('');
				$(this).addClass('wrong');

			}
		}

	});
}
}

function tic() {
	counter++;
}

function countdowntic() {
	countdown--;
	$('#timer').html(countdown);
	if (countdown == 0) {
		stopCountdown();
		startSounds();

	}
}

function reset() {
	clearInterval(timer);
	counter = 0;
}

function startInterval() {
	timer = setInterval("tic()", 10);
	$('.answers').show();
	$('#nextTrial').hide();
}

function stopInterval() {
	clearInterval(timer);
}

function startCountdown() {

	if (timer)
		reset();
	countdowntimer = setInterval("countdowntic()", 1000);
	$("#nextTrial").prop("disabled", true);
	$("#triangle").hide();
	$('#timer').html(countdown);
	$('.reactionTime').empty();
	$('.answers').removeClass('correct wrong');
	$('.answers').hide();
}

function stopCountdown() {
	if (countdowntimer)
		clearInterval(countdowntimer);
	countdown = 3;
	$('.answers').show();
	$("#nextTrial").prop("disabled", false);
}

function startSounds() {
	var type = getRandomNum();
	currentType = type;
	if (audio[type].count < numberOfTimes) {
		var src = getSoundSRC(type);
		console.log(type + ":" + src);
		$('#sound').attr('src', src);

		$('#sound')[0].play();
		startInterval();

		if (!checkTrialStatus)
			finishTrial();
	} else
		startSounds();
}

function getRandomNum() {
	return Math.floor(Math.random() * 5);
}

function getSoundSRC(type) {
	return audio[type].sounds[mode];
}

function increaseCount(type) {
	audio[type].count++;
}

function checkTrialStatus() {
	var count = 0;
	$.each(audio, function(i, item) {
		if (item.count < numberOfTimes)
			count++;
	});
	return count;
}

function cacheSoundFiles(count) {
	if (count == null)
		var count = 0;

	if (count < 5) {
		console.log("caching file :" + count);
		
		$("#sound").attr('src', getSoundSRC(count));
		$("#sound").prop("muted", true);
		$("#sound")[0].play();
		$("#sound").bind('ended', function() {
				count++;
			updateProgress(count * 20);
			
				cacheSoundFiles(count);
		
			// else{
				// renderUI();
				// return;
			// }
		});
	}
	else{
				renderUI();
				return;
			}
}

function finishTrial() {
	console.log('finishTrial');

	$('.round-button').hide();

	$.ajax({
		type : "POST",
		url : "saveData.php",
		data : {
			"data" : JSON.stringify(answers),
		},
	}).done(function(response) {
		$('#thanks').html(response);

	});

	$('#thanks').show();
}

function updateProgress(value) {
	$('#soundProgressBar').attr('aria-valuetransitiongoal', value);
	$('.progress-bar').progressbar();
}
