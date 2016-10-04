/** Event handling functions starts here */
/** Function to get the corresponding anode, cathode of selected analyte */
function retrieveData(xml,scope)
{
	var xmlDoc = xml.responseXML;
	var xmlData = xmlDoc.getElementsByTagName("ANALYTE");
	for (var i=0; i < xmlData.length; i++) {
	chemicalEquiavalent = (xmlData[selected_analyte_index].getElementsByTagName("CHMLEQU")[0].childNodes[0].nodeValue);	
	} 
	if(selected_analyte_index == 3 || selected_analyte_index == 4)
	{
		scope.cathode_Mdl = 1;
		scope.cathode_value = _('Cu on platinum');
		scope.anode_value = _('Platinum');
	}
	else if(selected_analyte_index == 2)
	{
		scope.cathode_value = _('Platinum');
		scope.anode_value = _('Platinum dish');
		scope.$apply();
	}
	else
	{
		scope.anode_value = _('Platinum');
		scope.cathode_value = _('Platinum');
	}
	scope.$apply();
}

/** Createjs stage updation happens in every interval */
function updateTimer(scope) {
if(load_flag)
{
	magnetMovement(scope);
}
	electrogravimetric_stage.update();
}

/** Function for setting controls while changing the system */
function setAnalyteFn(scope)
{
	selected_analyte_index = scope.analyte_Mdl;
	loadAnalytes(scope);
	getChild("cuso4_solution").visible = true;
	switch (selected_analyte_index) {
		case "0" :
		initialisationOfImages();
		getChild("cuso4_solution").visible = true;
		break;
		case "1":
		initialisationOfImages();
		getChild("pbso4_solution").visible = true;
		break;
		case "2" :
		initialisationOfImages();
		getChild("mnso4_solution").visible = true;
		break;
		case "3":
		initialisationOfImages();
		getChild("niso4_solution").visible = true;
		break;
		case "4" :
		initialisationOfImages();
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
function adjustResistanceFn(scope){
	resistance = scope.resistance_value;
	getChild("rheostat").x = (getChild("background").x+450)+(resistance*15);
	currentCalculation();
}

/** Function to display voltage in voltmeter */	
function displayVoltageFn(scope){
	voltage = (scope.voltage_value);
	getChild("voltmeter_txt").text = voltage.toFixed(3);;
	currentCalculation();
}

/** Function to calculate the current */	
function currentCalculation()
{
	current = (voltage/resistance);
	getChild("ammeter_txt").text = current.toFixed(3);
}

/** Function to adjust the time on slider change */	
function setTimeFn(scope)
{
	time = scope.time_value; 
}

/** Function to start experiment */
function startExperiment(scope) {
	start_flag = true;
	getChild("switch").rotation = 0;
	pause_flag = false;	
	expWatch(scope);
	/** pause the stopwatch while the time reaches the input time */
	if(minute == time)
	{
		scope.pause_ctrls_disable = true;
		pauseWatch();
		start_flag = false;
	}
	else{
	var min;
	min = minute;
	/** calculation of seconds using the stopwatch */
	if(minute>=1)
	{
		if(second == "00")
		{
			sec = parseFloat(second)+(60*min);
			massOfSubstance(sec,scope);
		}
		else if(sec >= 60){
		sec = parseFloat(second)+(60*min);
		massOfSubstance(sec,scope);
		}
	}
	else
	{
		sec = second;
		if(second != "00")
		{
			massOfSubstance(sec,scope);
			
		}	
	}
	}
	/** checking the total weight matches the mass array values */
  	for(var i=0; i< mass_arr.length; i++)
	{
		if(mass_arr[i] == scope.total_weight_value)
		{
			if(i < 10)
			{
			count = 0;
			count = count + i;
			draw(count);
			}
			else
			{
			count = 1;
			count = count*i+50;
			draw(count);
			}
		}
	} 	
}
/** Function call to draw circles */
function draw(count)
{
	for(var i=0; i<count; i++)
	{
		drawCircle(Math.random()*demoCanvas.width,Math.random()*demoCanvas.height,.5,"rgb(128,128,128)");
		drawCircle(Math.random()*demoCanvas.width,Math.random()*demoCanvas.height,.5,"#4A5357");
	}
}
/** Function for drawing circles */
function drawCircle(x,y,r,color)
{
	circle_name = new createjs.Shape();
	circle_name.graphics.beginStroke(color);
    circle_name.graphics.setStrokeStyle(3);
	if(x>getChild("cathode").x+2 && x <390&& y >getChild("cathode").y+2 && y<330)
    {
		circle_name.graphics.beginFill(color).arc(x, y,r, 0, 2 * Math.PI); 
	}
	electrogravimetric_stage.addChild(circle_name);
	circle_arr.push(circle_name);
}
/** Function to stop the experiment */
function stopExperiment(scope)
{
	getChild("switch").rotation = -40;	
	pause_flag = true;
	scope.pause_ctrls_disable = true;
	start_flag = false;
	pauseWatch();
}

/** Function for running the stopwatch in a timer */
function expWatch(scope) {
    if ( !pause_flag ) {
        showWatch(electrogravimetric_stage);
    }
}

/** Function for finding the weight of cathode */
function massOfSubstance(t,scope)
{
	mass =((chemicalEquiavalent * current * sec )/(NO_OF_ELECTRONS*FARADAY_CONST)); 
	total_weight = (parseFloat(mass)+(10)).toFixed(2);
	scope.total_weight_value = total_weight;
	scope.$apply();
}		

/** Reset the experiment in the reset button event */
function resetExperiment(scope) {
	for(var i=0;i<circle_arr.length;i++)
	{
	electrogravimetric_stage.removeChild(circle_arr[i]);
	}
	getChild("switch").rotation = -40;
	start_flag = false;	
	pause_flag = true;
	resetWatch();
	selected_analyte_index= 0;
	initialisationOfVariables(scope);
	getChild("cuso4_solution").visible = true;
	initialisationOfImages();
	setAnalyteFn(scope);
}

/** Function to return child element of stage */
function getChild(child_name) {
    return electrogravimetric_stage.getChildByName(child_name);
}
