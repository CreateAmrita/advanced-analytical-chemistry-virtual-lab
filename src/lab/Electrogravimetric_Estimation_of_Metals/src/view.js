(function() {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();
/** Variables declarations */
var timer, exp_canvas, start_flag;

var selected_analyte_index;

var stir_counter, timer_interval ,load_flag;

var voltage, resistance, current, time;

var FARADAY_CONST, NO_OF_ELECTRONS, CATHODE_BOUNADARY_X, CATHODE_BOUNADARY_Y;

var analyteName, cathodeName, anodeName, chemicalEquiavalent;

var total_weight,rheostat_initial_x;

var circle_name, mass;

var circle_arr , mass_arr;

var sec, circle_count;

var platinum_text;

function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if ( element[0].width > element[0].height ) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if ( element[0].offsetWidth > element[0].offsetHeight ) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
			exp_canvas = document.getElementById("demoCanvas"); /** Initialization of canvas element */
			exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;
			electrogravimetric_stage  = new createjs.Stage("demoCanvas") /** Initialization of stage element */
            queue = new createjs.LoadQueue(true); /** Initialization of queue object */
            queue.installPlugin(createjs.Sound);
			loadingProgress(queue,electrogravimetric_stage,exp_canvas.width) /** Preloader function */
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{ /** Loading all images into queue */
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            },  {
				id: "cathode",
                src: "././images/cathode.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
				id: "rheostat",
                src: "././images/rheostat.svg",
                type: createjs.LoadQueue.IMAGE
			},{
				id: "beaker",
                src: "././images/beaker_top.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
				id: "switch_top",
				src: "././images/switch_top.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "switch",
				src: "././images/switch.svg",
				type: createjs.LoadQueue.IMAGE
            },  {
				id: "stirrer1",
				src: "././images/stirrer1.svg",
				type: createjs.LoadQueue.IMAGE
            } , {
				id: "stirrer2",
				src: "././images/stirrer2.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "stirrer3",
				src: "././images/stirrer3.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "stirrer4",
				src: "././images/stirrer4.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "stirrer5",
				src: "././images/stirrer5.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "stirrer6",
				src: "././images/stirrer6.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "niso4_solution",
				src: "././images/niso4_solution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pbso4_solution",
				src: "././images/pbso4_solution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "cuso4_solution",
				src: "././images/cuso4_solution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "cdso4_solution",
				src: "././images/cdso4_solution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "mnso4_solution",
				src: "././images/mnso4_solution.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "wires",
				src: "././images/wires.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "anode",
				src: "././images/anode.svg",
				type: createjs.LoadQueue.IMAGE
            }
            ]);
            
			/** Activates mouse listeners on the stage */
            electrogravimetric_stage.enableDOMEvents(true);
            electrogravimetric_stage.enableMouseOver();
			timer = setInterval(function(){updateTimer(scope)},25); /** Stage update function in a timer */          
            function handleComplete() { 
				/** loading Background image */
                loadImages(queue.getResult("background"), "background", 0, 0, "", 0 ); 
                /** Function for setting stopwatch */
				createStopwatch (electrogravimetric_stage,-20,250,.5);
				/** Loading all images in the queue to the stage */				
				loadImages(queue.getResult("rheostat"), "rheostat",465, 510, "", 0);
				loadImages(queue.getResult("cuso4_solution"), "cuso4_solution",295, 235, "", 0);
				loadImages(queue.getResult("mnso4_solution"), "mnso4_solution",295, 235, "", 0);
				loadImages(queue.getResult("niso4_solution"), "niso4_solution",295, 235, "", 0);
				loadImages(queue.getResult("cdso4_solution"), "cdso4_solution",295, 235, "", 0);
				loadImages(queue.getResult("pbso4_solution"), "pbso4_solution",295, 235, "", 0);
				loadImages(queue.getResult("anode"), "anode",315, 213, "", 0);
				loadImages(queue.getResult("cathode"), "cathode", 316, 250, "", 0, 1, 1);
				loadImages(queue.getResult("beaker"), "beaker",285, 210, "", 0);
				loadImages(queue.getResult("wires"), "wires", 0, 0, "", 0 ); 
				loadImages(queue.getResult("switch"), "switch",559, 417, "", 0);
				getChild("switch").rotation = -40;
				loadImages(queue.getResult("switch_top"), "switch_top",538, 385, "", 0);
				/** Text loading */
				setText("ammeter_txt", 110, 510, _("1.000"), "#000000", 1);
				setText("voltmeter_txt", 330, 440, _("1.000"), "#000000", 1);
                translationLabels(); /** Translation of strings using gettext */
				/** Initializing the variables */
                initialisationOfVariables(scope); 
				/** Initializing image visibility status*/
				initialisationOfImages();
				/** Function call for changing cathode, anode based on the solution selected */
				setAnalyteFn(scope);
				/** loading stirrer images */
				for ( var i=1; i<=6; i++ ) {
                    loadImages(queue.getResult("stirrer"+i), "stirrer"+i, 345, 340, "", 0, electrogravimetric_stage, 1);
                }
				/** Adding playFn function to click event of play button in clock */
				clockContainer.getChildByName("play").on("click",function(){
					/** enabling the pause button after a play click in the stop watch */
					if ( start_flag ) {
						scope.pause_btn_label = pause_btn_var;
					}
                });
				/** Adding pauseFn function to click event of pause button in clock */
				clockContainer.getChildByName("pause").on("click",function(){
					/**enabling the play button after a pause click in the stop watch */
					if ( start_flag ) {
						scope.pause_btn_label = play_btn_var;
					}
					scope.$apply();
				});
            }
			
			/** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
			function translationLabels() {
				/** This help array shows the hints for this experiment */
				helpArray = [_("help1"), _("help2"), _("help3"), _("help4"),_("help5"),_("help6"),_("help7"), _("Next"), _("Close")];
				/** Experiment name */
				scope.heading = _(" Electrogravimetric Estimation of Metals");
				/** Label for voltage slider */
				scope.voltage_label = _("Voltage")
				/** Unit for voltage */
                scope.voltage_unit = _("V");
				/** Label for resistance slider */
				scope.resistance_label = _("Resistance")
				/** Unit for resistance */
				scope.resistance_unit = _("Ω");
				/** Label for time slider */
				scope.time_label = _("Time")
				/** Unit for time */
				scope.time_unit = _("min");
				/** Labels for buttons */
				start_btn_var =_("start");
				stop_btn_var =_("stop");
				pause_btn_var =_("pause");
				play_btn_var =_("play");
				platinum_text = _('Platinum');
				scope.reset = _("Reset");
				scope.variables = _("variables");
				scope.result = _("result");
				scope.copyright = _("copyright");
				/** Labels for select solution */
				scope.selectSolution_label = _("Select Solution :");
				/** Labels for cathode */
				scope.cathode_label = _("Cathode");
				/** Labels for anode */
				scope.anode_label = _("Anode");
				/** Labels for initial weight of cathode */
				scope.initial_weight_label = _("Initial weight of cathode : 10.00 g");
				/** Labels for total weight of cathode */
				scope.total_weight_label = _("Total weight of cathode");
				/** Unit for total weight */
				scope.total_weight_unit = _("g");
				/** Initializing solution array*/
				scope.selectSolutionArray = [{optionsSolution: _('CuSO₄'),type: 0}, {optionsSolution: _('PbSO₄'),type: 1}, {optionsSolution: _('MnSO₄'),type: 2},{optionsSolution: _('NiSO₄'),type: 3}, {optionsSolution: _('CdSO₄'),type: 4}];
				/** Setting initial value of cathode and anode*/
				scope.cathode_value = platinum_text;
				scope.anode_value = platinum_text;
            }
        }
    }
}

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	/** Constant values of Faraday constant and number of electrons */
	FARADAY_CONST = 96500;
	NO_OF_ELECTRONS = 2;
	/** Setting the boundary of circle formation inside the cathode */
	CATHODE_BOUNADARY_X = 390;
	CATHODE_BOUNADARY_Y = 330;
	timer_interval = 0.5; /** Interval of the timer and clock to be execute */
	rheostat_initial_x = 450; /** Setting the initial x value of rheostat */
	total_weight = (parseFloat(10).toFixed(2));/** Initialising total value of cathode */
	scope.total_weight_value = total_weight; /**Setting total value of cathode */
	/**Setting the flag value as true after all image loading */
	load_flag = true;
	/**Initialising the index of analyte */
	selected_analyte_index = 0;	
	/** Variable to hide disable property of time, voltage, resistance controls */
	scope.voltage_ctrls_disable = false;
	scope.resistance_ctrls_disable = false;
	scope.time_ctrls_disable = false;
	/** Variable to show time, voltage, resistance label controls */
	scope.time_ctrls_show = true;
	scope.voltage_ctrls_show = true;
	scope.resistance_ctrls_show = true;
	/**Setting initial value of voltage,resistance, time controls */
	scope.voltage_value = 1;
	scope.resistance_value = 1;
	scope.time_value = 1;
	resistance = 1; /** Initial value of resistance */
	voltage = 1; /** Initial value of voltage */
	time = 1; /** Initial value of time */
	current = 1; /** Initial value of current */
	circle_count = 1; /** Variable for counting the circles  */
	stir_counter = 0; /** Variable for counting the stirrer frames */
	/** Variable to show cathode controls */
	scope.cathode_ctrls_show = true;
	/** Variable to hide disable property of cathode controls */
	scope.cathode_ctrls_disable = false;
	/** Variable to hide disable property of analyte controls */
	scope.analyte_ctrls_disable = false;
	scope.analyte_Mdl = 0; /** Initialising index of analyte */
	scope.cathode_Mdl = 0; /** Initialising index of cathode */
	scope.anode_Mdl = 0; /** Initialising index of anode */
	scope.start_btn_label = start_btn_var; /** Setting start button label  */
	scope.pause_btn_label = pause_btn_var; /** Setting pause button label  */
	scope.pause_ctrls_disable = true; /** Variable to disable pause button controls */
	start_flag = false; /**  Initializing the start_flag as true for checking the experiment started */
	getChild("ammeter_txt").text ="1.000"; /** Initialising ammeter reading */
	getChild("voltmeter_txt").text = "1.000"; /** Initialising voltmeter reading */
	getChild("rheostat").x = "465"; /** Initialising rheostat x position */
	circle_arr = []; /** Initialising circle array */
	mass = 0; /** Initialising mass */
	/** Initialising mass array values*/
	mass_arr = ['10.05','10.06','10.09','10.12','10.15','10.18','10.20','10.24','10.30','10.40','10.50','10.60','10.90','11.10','12.20','13.10','15.30'];
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
	getChild("cuso4_solution").visible = false;
	getChild("pbso4_solution").visible = false;
	getChild("mnso4_solution").visible = false;
	getChild("niso4_solution").visible = false;
	getChild("cdso4_solution").visible = false;
}

/** Function for calling xml file for set data to combobox*/
function loadAnalytes(scope) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
			retrieveData(xmlhttp,scope)
		}
	};
	xmlhttp.open("GET", "./xml/electrogravimetry.xml", true);
	xmlhttp.send();	
}

/** Function for rotating magnetic stirrer*/
function magnetMovement(scope) {
	/** Creating timer for rotating magnetic_stirrer */
	stir_counter++;
	stirrerRotate(stir_counter);
	if ( stir_counter >= 6 ) {
		stir_counter = 0;
	}
	/** Function call to start the experiment only when the start button is clicked */
	if ( start_flag && pause_flag == false ) { /** pause flag is used to check whether the pause button click */
		scope.start_btn_label = stop_btn_var; /** change the start button label to stop while starting the experiment */
		startExperiment(scope);
	}	
}
/** Function for enabling one stirrer at a time*/
function stirrerRotate(count) {
	for ( var i = 1; i <=6; i++ ) {
		getChild("stirrer"+i).alpha = 0;
	}
	getChild("stirrer" +count).alpha = 1;
}
/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
	if ( name=="voltmeter_txt" || name=="ammeter_txt" ) {
		_text.font = "2em digiface";
	}
    electrogravimetric_stage.addChild(_text); /** Adding text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot) {
	var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX = _bitmap.scaleY = 1;
    _bitmap.name = name;
	/** Setting registration point for switch */
	if ( name == "switch" ) {
        _bitmap.regX = image.width/4.5;
        _bitmap.regY = image.height;
    }
    _bitmap.rotation = rot;
    _bitmap.cursor = cursor;
    electrogravimetric_stage.addChild(_bitmap); /** Adding bitmap to the stage */
}
