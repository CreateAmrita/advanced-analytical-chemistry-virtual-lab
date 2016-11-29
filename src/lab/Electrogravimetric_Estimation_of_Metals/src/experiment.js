/** Event handling functions starts here */
/** Function to get the corresponding anode, cathode of selected analyte */
function retrieveData(xml,scope){
	var xmlDoc = xml.responseXML;
	var xmlData = xmlDoc.getElementsByTagName("ANALYTE");
	/** Fetching chemicalEquiavalent of analytes from xml */
	for ( var i=0; i < xmlData.length; i++ ) {
		chemicalEquiavalent = (xmlData[selected_analyte_index].getElementsByTagName("CHMLEQU")[0].childNodes[0].nodeValue);	
	}
	/** Setting the cathode, anode values based on the solution change */
	if ( selected_analyte_index == 3 || selected_analyte_index == 4 ) {
		scope.cathode_Mdl = 1;
		scope.cathode_value = _('Cu on platinum'); /** Setting the cathode value of the solution Niso4, Cdso4 */
		scope.anode_value = platinum_text; /** Setting the anode value of the solution Niso4, Cdso4 */
	} else if ( selected_analyte_index == 2 ) {
		scope.cathode_value = platinum_text; /** Setting the cathode value of the solution Niso4, Mnso4 */
		scope.anode_value = _('Platinum dish'); /** Setting the anode value of the solution Niso4, Mnso4 */
	} else {
		scope.anode_value = platinum_text; /** Setting the cathode value of the solution Cuso4, Pbso4 */
		scope.cathode_value = platinum_text; /** Setting the anode value of the solution Cuso4, Pbso4 */
		
	}
	scope.$apply();
}

/** Createjs stage updation happens in every interval */
function updateTimer(scope) {
	/** Function call for stirring animation only after the image loading */
	if ( load_flag ) {
		magnetMovement(scope); /** Function call to rotate the stirrer in the solution*/
	}
	electrogravimetric_stage.update();
}

/** Function for setting controls(anode,cathode) while changing the solution */
function setAnalyteFn(scope) {
	selected_analyte_index = scope.analyte_Mdl; /** Setting the solution combo box index to a variable  */
	loadAnalytes(scope); /** Changing the controls based on selected solution */
	initialisationOfImages(); /** setting visibility of all images to false while changing the solution */ 
	/** Setting selected solution visibility to true */
	switch (selected_analyte_index) {
		case "0" :
		getChild("cuso4_solution").visible = true;
		break;
		case "1":
		getChild("pbso4_solution").visible = true;
		break;
		case "2" :
		getChild("mnso4_solution").visible = true;
		break;
		case "3":
		getChild("niso4_solution").visible = true;
		break;
		case "4" :
		getChild("cdso4_solution").visible = true;
		break;	
	}
}

/** Function to pause the stopwatch */
function pauseFn(scope) {
	pause_flag = true;
	scope.pause_btn_label = play_btn_var;
	pauseWatch();
}

/** Function to play the stopwatch */
function playFn(scope) {
	scope.pause_btn_label = pause_btn_var;
	showWatch(electrogravimetric_stage);
	pause_flag = false;
}

/** Function to adjust the resistance */
function adjustResistanceFn(scope) {
	resistance = scope.resistance_value;
	getChild("rheostat").x = rheostat_initial_x + (resistance*15);
	currentCalculation();
}

/** Function to display voltage in voltmeter */	
function displayVoltageFn(scope) {
	voltage = (scope.voltage_value);
	getChild("voltmeter_txt").text = voltage.toFixed(3);;
	currentCalculation();
}

/** Function to calculate the current */	
function currentCalculation() {
	current = (voltage/resistance);
	getChild("ammeter_txt").text = current.toFixed(3);
}

/** Function to adjust the time on slider change */	
function setTimeFn(scope) {
	time = scope.time_value; 
}

/** Function to start experiment */
function startExperiment(scope) {
	start_flag = true;
	getChild("switch").rotation = 0;
	clearInterval(timer);
	timer =setInterval(function(){updateTimer(scope)},25);
	expWatch(scope);
	/** pause the stopwatch while the time reaches the input time */
	if ( minute == time ) {
		scope.pause_ctrls_disable = true;
		pauseWatch();
		start_flag = false;
	} else {
		var _min;
		_min = minute;
		/** calculation of seconds using the stopwatch */
		if ( minute>=1 ) {
			if ( second == "00" ) {
				sec = parseFloat(second)+(60*_min); /** Adding seconds when the stopwatch display the value '00' */
				massOfSubstance(sec,scope); /** Function call to find the mass of cathode */
			}
			else if ( sec >= 60 ) {
				sec = parseFloat(second)+(60*_min); /** Adding seconds after each minute */
				massOfSubstance(sec,scope); /** Function call to call the mass of cathode */
			}
		}
		/** Calculating the mass of substance in the first 1 minute */
		else
		{
			sec = second;
			if ( second != "00" ) {
				massOfSubstance(sec,scope); /** Function call to calculate the mass of cathode till the stopwatch display the value '00'*/
			}	
		}
	}
	/** checking the total weight matches the mass array values */
  	for ( var i=0; i< mass_arr.length; i++ ) {
		if ( mass_arr[i] == scope.total_weight_value ) {
			/** counting the number of circle to be drawn when mass of cathode less then 10.50 */
			if ( i < 10 ) {
				circle_count = 0;
				circle_count = circle_count + i;
				draw(circle_count);
			}
			/** counting the number of circle to be drawn when mass of cathode greater then 10.50 */
			else {
				circle_count = 1;
				circle_count = circle_count*i+50;
				draw(circle_count);
			}
		}
	} 	
}
/** Function call to draw circles */
function draw(count) {
	for ( var i=0; i<count; i++ ) {
		/** drawing circle inside the cathode using two different colour */
		drawCircle(Math.random()*demoCanvas.width,Math.random()*demoCanvas.height,.5,"rgb(128,128,128)");
		drawCircle(Math.random()*demoCanvas.width,Math.random()*demoCanvas.height,.5,"#4A5357");
	}
}
/** Function for drawing circles */
function drawCircle(x,y,r,color) {
	circle_name = new createjs.Shape();
	circle_name.graphics.beginStroke(color);
    circle_name.graphics.setStrokeStyle(3);
	/** To restrict the circle formation inside the boundary */
	if ( x>getChild("cathode").x+2 && x < CATHODE_BOUNADARY_X && y >getChild("cathode").y+2 && y < CATHODE_BOUNADARY_Y ) {
		circle_name.graphics.beginFill(color).arc(x, y,r, 0, 2 * Math.PI); 
	}
	electrogravimetric_stage.addChild(circle_name);
	circle_arr.push(circle_name);
}
/** Function to stop the experiment */
function stopExperiment(scope) {
	getChild("switch").rotation = -40;	/** Changing the switch to original position */
	pause_flag = true;
	scope.pause_ctrls_disable = true;
	start_flag = false;
	pauseWatch(); /** Pausing the stop watch while stopping the experiment */
}

/** Function for running the stopwatch in a timer */
function expWatch(scope) {
    if ( !pause_flag ) {
        showWatch(electrogravimetric_stage);
    }
}

/** Function for finding the weight of cathode */
function massOfSubstance(t,scope) {
	/** mass of substance deposited on cathode =Z*I*T/n*F  where, z is the chemical equivalent; I is the current;T is the time; n is the number of electrons;F is the FARADAY CONSTANT */
	mass =((chemicalEquiavalent * current * sec )/(NO_OF_ELECTRONS*FARADAY_CONST)); 
	total_weight = (parseFloat(mass)+(10)).toFixed(2); /** Finding the total weight of the cathode */
	scope.total_weight_value = total_weight; /** Setting the total weight of cathode */
	scope.$apply();
}		

/** Reset the experiment in the reset button event */
function resetExperiment(scope) {
	/** Removing all circle formed inside the cathode while resetting */
	for ( var i=0;i<circle_arr.length;i++ ) {
		electrogravimetric_stage.removeChild(circle_arr[i]);
	}
	getChild("switch").rotation = -40; /** Changing the switch to original position */
	start_flag = false;	
	pause_flag = true;
	resetWatch(); /** Function call to reset the stopwatch */
	selected_analyte_index= 0;
	initialisationOfVariables(scope); /** resetting all variable values*/
	initialisationOfImages(); /** resetting all images visibility to false */
	getChild("cuso4_solution").visible = true; /** Changing the solution as cuso4 while resetting */
	loadAnalytes(scope); /** Changing the controls based on the analyte  */
}

/** Function to return child element of stage */
function getChild(child_name) {
    return electrogravimetric_stage.getChildByName(child_name);
}
