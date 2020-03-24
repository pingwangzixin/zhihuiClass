var startX = document.getElementById('start'),
	pauzeX = document.getElementById('pauze'),
	clearX = document.getElementById('clear'),
	timeX = 0,
	h_timeX = 0,
	loopsX = 0,
	klikminX = 0,
	perc_vlak1X = 0,
	perc_vlak2X = 0,
	teller_looptX = false,
	soundsopenX = false,
	soundsX = 1,
	teller2X,
	tellerX;

document.getElementById('pauzeX').style.visibility = "hidden";

function timerX() {
	tellerX = setTimeout(
		function() {
			timeX--;
			updatetellerX();

		}, 1000);
}

function updateloopsX() {
	if (loopsX < 0) {
		loopsX = 0;
	}
	document.getElementById("loop_textX").innerHTML = loopsX;
}

// --- update TELLER ---
function updatetellerX() {
	if (timeX < 0) {

		if (loopsX > 0) {
			loopsX--;
			timeX = h_timeX
			sounds_choice_btnX();
			timerX();
			updateloopsX()
			// $(".clockpositin").css({"right":"0"});
		} else {
			clearTimeout(tellerX);
			timeX = 0;
			h_timeX = 0;
			hoogste_timeX();
			teller_looptX = false;
			document.getElementById('startX').style.visibility = "visible";
			document.getElementById('pauzeX').style.visibility = "hidden";
			sounds_choice_btnX();
			// $(".clockpositin").css({"right":"0"});
		}

	} else {
		timerX();
	}

	updatetextX();
}

function updatetextX() {
	var minutesX = Math.floor(timeX / 60);
	var secondsX = timeX - minutesX * 60;
	var minutesX = ('0' + minutesX).slice(-2);
	var secondsX = ('0' + secondsX).slice(-2);
	document.getElementById("timeshowX").innerHTML = (minutesX + " " + secondsX);
	perc_vlak1X = (timeX / h_timeX) * 100;
	perc_vlak2X = 100 - perc_vlak1X;
	if (teller_looptX == true) {
		document.getElementById("yellow_vlak1X").height = (perc_vlak1X / 100 * 55);
		document.getElementById("yellow_vlak2X").height = (perc_vlak2X / 100 * 55);
	}
}

function updateloopsX() {
	if (loopsX < 0) {
		loopsX = 0;
	}
	document.getElementById("loop_textX").innerHTML = loopsX;
}

//--- ---
function hoogste_timeX() {
	if (timeX >= h_timeX) {
		h_timeX = timeX;
		var h_minutesX = Math.floor(h_timeX / 60);
		var h_secondsX = h_timeX - h_minutesX * 60;
		var h_minutesX = ('0' + h_minutesX).slice(-2);
		var h_secondsX = ('0' + h_secondsX).slice(-2);
		document.getElementById("h_timeX").innerHTML = (h_minutesX + ":" + h_secondsX);
	}
}

function startbtnX() {

	var audioClickX = new Audio('/music/click1.wav');
	audioClickX.play();
	if (timeX > 0) {
		timerX();
		updatetextX();
		teller_looptX = true;
		hoogste_timeX();
		// $(".clockpositin").css({"right":"-324px"});
		document.getElementById('startX').style.visibility = "hidden";
		document.getElementById('pauzeX').style.visibility = "visible";
		document.getElementById('yellow_vlak3X').style.visibility = "visible";
	}
}

function pauzebtnX() {
	//alert("jhk");
	clearTimeout(tellerX);
	updatetextX();
	teller_looptX = false;
	document.getElementById('startX').style.visibility = "visible";
	document.getElementById('pauzeX').style.visibility = "hidden";
	document.getElementById('yellow_vlak3X').style.visibility = "hidden";
}
/* Clear button */
function clearbtnX() {
	document.getElementById("timeshowX").innerHTML = ("00 00");
	timeX = 0;
	h_timeX = 0;
	loopsX = 0;
	clearTimeout(tellerX);
	updatetextX();
	hoogste_timeX();
	updateloopsX();
	make_sound_hiddenX();
	teller_looptX = false;
	document.getElementById('startX').style.visibility = "visible";
	document.getElementById('pauzeX').style.visibility = "hidden";
	perc_vlak1X = 0;
	document.getElementById("yellow_vlak1X").height = perc_vlak1X;
	perc_vlak2X = 55;
	document.getElementById("yellow_vlak2X").height = perc_vlak2X;
}

function plus10btnX() {
	timeX = timeX + 600;
	if (timeX > 5999) {
		timeX = 5999
	}
	if (teller_looptX == true) {
		hoogste_timeX();
	}
	updatetextX();
};

function plus1btnX() {
	timeX = timeX + 60;
	if (timeX > 5999) {
		timeX = 5999
	}
	if (teller_looptX == true) {
		hoogste_timeX();
	}
	updatetextX();
};

function plus0010btnX() {
	timeX = timeX + 10;
	if (timeX > 5999) {
		timeX = 5999
	}
	if (teller_looptX == true) {
		hoogste_timeX();
	}
	updatetextX();
};


function min10btnX() {
	if (timeX >= 600) {
		timeX = timeX - 600;
	} else if (timeX < 600 && loopsX == 0) {
		clearTimeout(tellerX);
		timeX = 0;
		h_timeX = 0;
		hoogste_timeX();
		teller_looptX = false;
		document.getElementById('startX').style.visibility = "visible";
		document.getElementById('pauzeX').style.visibility = "hidden";
		perc_vlak1X = 0;
		document.getElementById("yellow_vlak1X").height = (perc_vlak1X / 100 * 55);
		perc_vlak2X = 100;
		document.getElementById("yellow_vlak2X").height = (perc_vlak2X / 100 * 55);
	} else if (timeX < 600 && loopsX > 0) {
		loopsX--;
		updateloopsX();
		timeX = h_timeX;
	}
	updatetextX();
};


function min1btnX() {
	if (timeX >= 60) {
		timeX = timeX - 60;
	} else if (timeX < 60 && loopsX == 0) {
		clearTimeout(tellerX);
		timeX = 0;
		h_timeX = 0;
		hoogste_timeX();
		teller_looptX = false;
		document.getElementById('startX').style.visibility = "visible";
		document.getElementById('pauzeX').style.visibility = "hidden";
		perc_vlak1X = 0;
		document.getElementById("yellow_vlak1X").height = (perc_vlak1X / 100 * 55);
		perc_vlak2X = 100;
		document.getElementById("yellow_vlak2X").height = (perc_vlak2X / 100 * 55);
	} else if (timeX < 60 && loopsX > 0) {
		loopsX--;
		updateloopsX();
		timeX = h_timeX;
	}
	updatetextX();
};


function min0010btnX() {
	if (timeX >= 10) {
		timeX = timeX - 10;
	} else if (timeX < 10 && loopsX == 0) {
		clearTimeout(tellerX);
		timeX = 0;
		h_timeX = 0;
		hoogste_timeX();
		teller_looptX = false;
		document.getElementById('startX').style.visibility = "visible";
		document.getElementById('pauzeX').style.visibility = "hidden";
		perc_vlak1X = 0;
		document.getElementById("yellow_vlak1X").height = (perc_vlak1X / 100 * 55);
		perc_vlak2X = 100;
		document.getElementById("yellow_vlak2X").height = (perc_vlak2X / 100 * 55);
	} else if (timeX < 10 && loopsX > 0) {
		loopsX--;
		updateloopsX();
		timeX = h_timeX;
	}
	updatetextX();
};


//------loops------
function loopplusbtnX() {
	loopsX = loopsX + 1;
	if (loopsX > 9) {
		loopsX = 9;
	};
	updateloopsX();
};

function loopminbtnX() {
	loopsX = loopsX - 1;
	updateloopsX();
};


document.getElementById('totalsoundsX').style.visibility = "hidden";

function soundsbtnX() {
	if (soundsopenX == false) {
		soundsopenX = true;
		make_sound_visibleX();
	} else {
		soundsopenX = false;
		make_sound_hiddenX();
	}
};


function make_sound_visibleX() {
	document.getElementById("backX").height = 240;
	document.getElementById('totalsoundsX').style.visibility = "visible";
}

function make_sound_hiddenX() {
	document.getElementById("backX").height = 197;
	document.getElementById('totalsoundsX').style.visibility = "hidden";
}

function sounds1_btnX() {
	soundsX = 1;
	document.getElementById("sounds_backX").style.left = "9px";
	sounds_choice_btnX();
}

function sounds2_btnX() {
	soundsX = 2;
	document.getElementById("sounds_backX").style.left = "52px";
	sounds_choice_btnX();
}

// 							function sounds3_btnX() {
// 								soundsX = 3;
// 								document.getElementById("sounds_backX").style.left = "95px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds4_btnX() {
// 								soundsX = 4;
// 								document.getElementById("sounds_backX").style.left = "138px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds5_btnX() {
// 								soundsX = 5;
// 								document.getElementById("sounds_backX").style.left = "181px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds6_btnX() {
// 								soundsX = 6;
// 								document.getElementById("sounds_backX").style.left = "224px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds7_btnX() {
// 								soundsX = 7;
// 								document.getElementById("sounds_backX").style.left = "267px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds8_btnX() {
// 								soundsX = 8;
// 								document.getElementById("sounds_backX").style.left = "310px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds9_btnX() {
// 								soundsX = 9;
// 								document.getElementById("sounds_backX").style.left = "353px";
// 								sounds_choice_btnX();
// 							}
// 
// 							function sounds10_btnX() {
// 								soundsX = 10;
// 								document.getElementById("sounds_backX").style.left = "396px";
// 								sounds_choice_btnX();
// 							}
// 
function sounds_choice_btnX() {



	if (soundsX == 1) {
		var audioS1X = new Audio('/music/timer2_cowbell.mp3');
		audioS1X.play();
	}
	if (soundsX == 2) {
		var audioS2X = new Audio('/music/timer1_dingdong.mp3');
		audioS2X.play();
	}
	// 								if (soundsX == 3) {
	// 									var audioS3X = new Audio('https://www.classroomscreen.com/timer/timer3_buzzer.mp3');
	// 									audioS3X.play();
	// 								}
	// 								if (soundsX == 4) {
	// 									var audioS4X = new Audio('https://www.classroomscreen.com/timer/timer4_egg.mp3');
	// 									audioS4X.play();
	// 								}
	// 								if (soundsX == 5) {
	// 									var audioS5X = new Audio('https://www.classroomscreen.com/timer/timer5_coin.mp3');
	// 									audioS5X.play();
	// 								}
	// 								if (soundsX == 6) {
	// 									var audioS6X = new Audio('https://www.classroomscreen.com/timer/timer6_harp.mp3');
	// 									audioS6X.play();
	// 								}
	// 								if (soundsX == 7) {
	// 									var audioS7X = new Audio('https://www.classroomscreen.com/timer/timer7_arabic.mp3');
	// 									audioS7X.play();
	// 								}
	// 								if (soundsX == 8) {
	// 									var audioS8X = new Audio('https://www.classroomscreen.com/timer/timer8_country.mp3');
	// 									audioS8X.play();
	// 								}
	// 								if (soundsX == 9) {
	// 									var audioS9X = new Audio('https://www.classroomscreen.com/timer/timer9_mario.mp3');
	// 									audioS9X.play();
	// 								}
	// 								if (soundsX == 10) {
	// 									var audioS10X = new Audio('https://www.classroomscreen.com/timer/timer10_tropical.mp3');
	// 									audioS10X.play();
	// 								}



}
