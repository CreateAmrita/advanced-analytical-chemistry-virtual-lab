(function() {
    angular
        .module('users')
        .directive("experiment", directiveFunction)
})();

/** Variables declaraions */

var polarography_stage, tick, paralogram, derivative, chart, exp_canvas;
var average_diffusion, diffusion, mass_flow_rate, applied_voltage, average_diffusion_half, center, slope;

/** Constant variable declarations */
var DIFFUSION_CONST, DIFFUSION_LOG_CONST, MASS_CONST, VOLTAGE_CONST, MIN_FINAL_MV_CONST, CURRENT_VOLTAGE_LIMIT_CONST; 
var X_AXIS_ARRAY_FOURTH_CONST, X_AXIS_ARRAY_THIRD_CONST, X_AXIS_ARRAY_SEC_LAST_CONST, X_AXIS_ARRAY_VALUE_THIRD_CONST;

/** Arrays declarations */
var help_array = concentration_array = analysis_array = dataplot_array = [];
var x_axis_array = y_axis_array = x_axis_array_value = y_axis = x_axis = [];

var unknown_concentration_array=["1.5","2.5","3.5","4.5"]; /** The random values for unknown concentration */

function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, dialogs) {
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

            /** Initialisation of stage */
            polarography_stage = new createjs.Stage("demoCanvas"); 
			queue = new createjs.LoadQueue(true);       
			/** Preloading the images */
			queue.loadManifest([{
				id: "background",
				src: "././images/background.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "cadmium",
				src: "././images/cadmium.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "hand_with_glass",
				src: "././images/hand_with_glass.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "hand",
				src: "././images/hand.svg",
				type: createjs.LoadQueue.IMAGE
			}]);			
            queue.installPlugin(createjs.Sound);
            loadingProgress(queue,polarography_stage,exp_canvas.width); 
            queue.on("complete", handleComplete, this);                     
            polarography_stage.enableDOMEvents(true);
            polarography_stage.enableMouseOver();
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */

            function handleComplete() {
                /** Initializing the variables */
                initialisationOfVariables(); 
				/**loading images, text and containers*/
                loadImages(queue.getResult("background"), "background", -45, -35, "", 0, polarography_stage, 1);
				loadImages(queue.getResult("cadmium"), "cadmium", 60, 550, "", 0, polarography_stage, 0.8);
                loadImages(queue.getResult("hand_with_glass"), "hand_with_glass", 350, 700, "", 0, polarography_stage, 0.8);
                loadImages(queue.getResult("hand"), "hand", 60, 550, "", 0, polarography_stage, 0.8);

                setText("graph_text", 330, 50, "", "black", 1, polarography_stage); /** Label for the graph heading */
                document.getElementById("graphDiv").style.display = "block"; /** Set graph div display style as block */
				/** Initializing control side variables */
                initialisationOfControls(scope);
				/** Function call for images used in the apparatus visibility */
                initialisationOfImages(); 
                /** Function for plotting the graph */
                makeGraph(scope);
				/** Translation of strings using gettext */
                translationLabels(); 
                /** Value calculation function */
                calculation(scope); 
            }

            /** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("Next"), _("Close")];
                scope.heading = _("Polarography - Determination of Unknown Concentration of Cadmium");
                scope.variables = _("Variables");
                scope.result = _("Result");
                scope.copyright = _("copyright");
                scope.choose_concentration = _("Concentration (mM):");
                scope.load_cadmium_txt = _("Load Cadmium Sample");
                scope.drop_time_txt = _("Drop Time (sec)");
                scope.scan_rate_txt = _("Scan Rate (mV/Sec)");
                scope.initial_mV = _("Initial mV:");
                scope.final_mV = _("Final mV:");
                scope.scan_analysis_txt = _("Scan Analysis:");
                scope.e_id = _("Polarogram");
                scope.plot_graph_txt = _("Plot Graph");
                scope.reset_txt = _("Reset");
                polarogram = _("Polarogram");
                derivative = _("Derivative");
                scope.average_diffusion = _("Average Diffusion");
                /** This array for Concentration dropdown values */
                scope.concentration_array = [{
                    concentration: 1,
                    type: 1,
                    index: 0
                }, {
                    concentration: 2,
                    type: 2,
                    index: 1
                }, {
                    concentration: 3,
                    type: 3,
                    index: 2
                }, {
                    concentration: 4,
                    type: 4,
                    index: 3
                }, {
                    concentration: 5,
                    type: 5,
                    index: 4
                }, {
                    concentration: _('Unknown'),
                    /** The random values for unknown concentration is in unknown_concentration_array. 
                    Here that array values are randomly taken when we choose unknown concentration. */
                    type: unknown_concentration_array[Math.floor(Math.random()*unknown_concentration_array.length)],
                    index: 5
                }];
                /** This array for Scan Analysis drop down */
                scope.analysis_array = [{
                    analysis: _('Polarogram'),
                    type: 1,
                    index: 0
                }, {
                    analysis: _('Derivative'),
                    type: 2,
                    index: 1
                }];                
                scope.$apply();
            }
        }
    }
}

/** All the texts loading and added to the natural_convection_stage */
function setText(name, textX, textY, value, color, fontSize, container) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    container.addChild(_text); /** Adding text to the container */
}

/** All the images loading and added to the natural_convection_stage */
function loadImages(image, name, xPos, yPos, cursor, rot, container, scale) {
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX = _bitmap.scaleY = scale;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = rot;
    _bitmap.cursor = cursor;
    container.addChild(_bitmap); /** Adding bitmap to the container */
}

/** Function to return child element of stage */
function getChild(child_name) {
    return polarography_stage.getChildByName(child_name); /** Returns the child element of stage */
}

/** Initialisation of all controls */
function initialisationOfControls(scope) {
    scope.Concentration = 1; /** Initial concentration */
    scope.mVinitial = -300; /** Initial mV */
    scope.mVfinal = -1000; /** Final mV */
    scope.result_value = 0; /** Initial result value */
    scope.scan_analysis = 1; /** Initial scan analysis */
}
 
/** All variables initialising in this function */
function initialisationOfVariables() {
    average_diffusion = diffusion = mass_flow_rate = applied_voltage = average_diffusion_half = center = slope = 0;
    DIFFUSION_CONST = 23610.81;
    DIFFUSION_LOG_CONST = 5;
    MASS_CONST = 0.0591;
    VOLTAGE_CONST = -647;
    MIN_FINAL_MV_CONST = 608;
    X_AXIS_ARRAY_FOURTH_CONST = 0.5;
    X_AXIS_ARRAY_THIRD_CONST = 50;
    X_AXIS_ARRAY_SEC_LAST_CONST = 200;
    X_AXIS_ARRAY_VALUE_THIRD_CONST = -16.525;
	CURRENT_VOLTAGE_LIMIT_CONST = 299;
}

/** Set the initial status of the bitmap and 
text depends on its visibility and initial values */
function initialisationOfImages() {
    getChild("hand").visible = false; /** Initialy hand and cadmium are not displayed */
    getChild("cadmium").visible = false;
}

/** Stage updation function */
function updateTimer() {
    polarography_stage.update();
}