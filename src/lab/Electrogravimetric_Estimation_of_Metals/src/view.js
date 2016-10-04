(function() {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();
/** Variables declarations */
var timer, exp_canvas, start_flag;
var selected_analyte_index;
var stir_counter;
var voltage, resistance, current, time;
var FARADAY_CONST, NO_OF_ELECTRONS;
var selectCathodeArray = [];
var analyteName,cathodeName, anodeName, chemicalEquiavalent;
var circle_name;
var sec, count;
var circle_arr=[];
var mass_arr=['10.05','10.06','10.09','10.12','10.15','10.18','10.20','10.24','10.30','10.40','10.50','10.60','10.90','11.10','12.20','13.10','15.30'];
var mass =0;
var load_flag ;
var total_weight;
function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if (element[0].width > element[0].height) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if (element[0].offsetWidth > element[0].offsetHeight) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
			exp_canvas = document.getElementById("demoCanvas");
			exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;
			/** Creating the stage for the experiment. */
			electrogravimetric_stage  = new createjs.Stage("demoCanvas")
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
			loadingProgress(queue,electrogravimetric_stage,exp_canvas.width)
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{
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
            
			/** Initialisation of stage */
            electrogravimetric_stage.enableDOMEvents(true);
            electrogravimetric_stage.enableMouseOver();
			timer =setInterval(function(){updateTimer(scope)},25);/** Stage update function in a timer */          
            function handleComplete() { 
			 
				/** loading Background image */
                loadImages(queue.getResult("background"), "background", 0, 0, "", 0 ); 
                /** Function for setting stopwatch */
				createStopwatch (electrogravimetric_stage,-20,250,1);
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
				initialisationOfImages();
				setAnalyteFn(scope);
				for ( var i=1; i<=6; i++ ) {
                    loadImages(queue.getResult("stirrer"+i), "stirrer"+i, 345, 340, "", 0, electrogravimetric_stage, 1);
                }
				/** Adding playFn() function to click event of play button in clock */
				clockContainer.getChildByName("play").on("click",function(){
				/** enabling the pause button after a play click in the stop watch */
				if(start_flag)
				{
					scope.pause_btn_label = pause_btn_var;
				}
                });
				/** Adding pauseFn() function to click event of pause button in clock */
				clockContainer.getChildByName("pause").on("click",function(){
				/**enabling the play button after a pause click in the stop watch */
				if(start_flag)
				{
					scope.pause_btn_label = play_btn_var;
					scope.$apply();
				}
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
				scope.selectSolutionArray = [{optionsSolution: _('CuSO₄'),type: 0}, {optionsSolution: _('PbSO₄'),type: 1}, {optionsSolution: _('MnSO₄'),type: 2},{optionsSolution: _('NiSO₄'),type: 3}, {optionsSolution: _('CdSO₄'),type: 4}];
				scope.cathode_value = _('Platinum');
				scope.anode_value = _('Platinum');
            }
        }
    }
}

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	/**constant values of Faraday constant and number of electrons*/
	FARADAY_CONST = 96500;
	NO_OF_ELECTRONS = 2;
	total_weight = (parseFloat(10).toFixed(2));
	scope.total_weight_value = total_weight;
	load_flag = true;
	selected_analyte_index = 0;	
	scope.voltage_ctrls_disable = false;
	scope.resistance_ctrls_disable = false;
	scope.time_ctrls_disable = false;
	scope.time_ctrls_show = true;
	scope.voltage_ctrls_show = true;
	scope.resistance_ctrls_show = true;
	scope.voltage_value = 1;
	scope.resistance_value = 1;
	scope.time_value = 1;
	resistance = 1;
	voltage = 1;
	time = 1;
	current = 1;
	count = 1;
	stir_counter = 0;
	scope.cathode_ctrls_show = true;
	scope.cathode_ctrls_disable = false;
	scope.analyte_ctrls_disable = false;
	scope.analyte_Mdl = 0;
	scope.cathode_Mdl = 0;
	scope.anode_Mdl = 0; 
	scope.start_btn_label = start_btn_var;
	scope.pause_btn_label = pause_btn_var;
	scope.pause_ctrls_disable = true;
	start_flag = false;
	getChild("ammeter_txt").text ="1.000";
	getChild("voltmeter_txt").text = "1.000";
	getChild("rheostat").x = "465";
	circle_arr=[];
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
function loadAnalytes(scope)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{
		retrieveData(xmlhttp,scope)
	}
	};
	xmlhttp.open("GET", "./xml/electrogravimetry.xml", true);
	xmlhttp.send();	
}

/**function for rotating magnetic stirrer*/
function magnetMovement(scope)
{
	/** Creating timer for rotating magnetic_stirrer */
	stir_counter++;
	stirrerRotate(stir_counter);
	if (stir_counter >= 6) {
		stir_counter = 0;
	}
	if(start_flag && pause_flag == false)
	{
	scope.start_btn_label = stop_btn_var;
	startExperiment(scope);
	}	
}
/**function for enabling one stirrer at a time*/
function stirrerRotate(count) {
	for (var i = 1; i <=6; i++) {
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
	if(name=="voltmeter_txt" || name=="ammeter_txt"){
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
	if (name == "switch") {
        _bitmap.regX = image.width/4.5;
        _bitmap.regY = image.height;
    }
    _bitmap.rotation = rot;
    _bitmap.cursor = cursor;
    electrogravimetric_stage.addChild(_bitmap); /** Adding bitmap to the container */
    blur_image_width = _bitmap.image.width; /**Passing the width of the cell for blur function */
    blur_image_height = _bitmap.image.height; /**Passing the height of the cell for blur function */
}
