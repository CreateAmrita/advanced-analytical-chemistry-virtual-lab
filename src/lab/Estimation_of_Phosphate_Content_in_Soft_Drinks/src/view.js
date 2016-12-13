(function() {
    angular
        .module('users')
        .directive("experiment", directiveFunction)
})();

/** Variables declaraions */

var estimation_phosphate_stage, tick, exp_canvas;

var testtube_count, testtube_flag, testtube_movement_timer, graph_container;

var sample1_x_line_timer, sample1_line_initial_x, prev_sample1_line_initial_x;

var sample2_x_line_timer, sample2_line_initial_x, prev_sample2_line_initial_x;

var down_listner, press_listner, up_listner, graph_listner, down_listner_2;

var press_listner_2, up_listner_2, sample_entry, prev_x_val, prev_y_val, nth_obj, collide_x_line, mouse_over_graph, testtube_in_machine_flag;

/** Arrays declarations */
var line_obj_array = help_array = [];

/** Createjs shapes declarations */
var testtube_return_rect = new createjs.Shape();
var container_border_rect = new createjs.Shape();
var graph_tooltip_rect = new createjs.Shape();

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

            /** Initialisation of stage */
            estimation_phosphate_stage = new createjs.Stage("demoCanvas");
            queue = new createjs.LoadQueue(true);     
            /** Preloading the images */
            queue.loadManifest([{
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "t_button_down",
                src: "././images/t_button_down.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "t_button_up",
                src: "././images/t_button_up.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "abs_button_down",
                src: "././images/abs_button_down.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "abs_button_up",
                src: "././images/abs_button_up.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "auto_zero_button_down",
                src: "././images/auto_zero_button_down.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "auto_zero_button_up",
                src: "././images/auto_zero_button_up.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow_blue",
                src: "././images/arrow_blue.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "arrow_green",
                src: "././images/arrow_green.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "machine_top",
                src: "././images/machine_top.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "testtube_empty",
                src: "././images/testtube_empty.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "testtube_with_solution",
                src: "././images/testtube_with_solution.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "testtube_stand",
                src: "././images/testtube_stand.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "graph",
                src: "././images/graph.svg",
                type: createjs.LoadQueue.IMAGE
            }]);
            queue.installPlugin(createjs.Sound);
            queue.on("complete", handleComplete, this);
            loadingProgress(queue,estimation_phosphate_stage,exp_canvas.width);

            estimation_phosphate_stage.enableDOMEvents(true);
            estimation_phosphate_stage.enableMouseOver();
            createjs.Touch.enable(estimation_phosphate_stage);
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */

            /** Creating the graph container, that we have to mark the points inside the graph container that is inside the grid */
            graph_container = new createjs.Container(); 
            graph_container.name = "graph_container";            
            graph_container.alpha = 1;

            function handleComplete() {
                /** Initializing the variables */
                initialisationOfVariables();
                /** Loading images, text and containers */
                loadImages(queue.getResult("background"), "background", 0, 0, "", 0, estimation_phosphate_stage, 1);          
                loadImages(queue.getResult("graph"), "graph", 10, 222, "", 0, estimation_phosphate_stage, 1.25);
                loadImages(queue.getResult("testtube_empty"), "testtube_empty", 50, 50, "pointer", 0, estimation_phosphate_stage, 1); 
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution1", 103, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution2", 156, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution3", 209, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution4", 262, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution5", 315, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution6", 368, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution7", 421, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution8", 473, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution9", 526, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution10", 578, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_with_solution"), "testtube_with_solution11", 630, 50, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("testtube_stand"), "testtube_stand", 10, 70, "", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("machine_top"), "machine_top", 0, 0, "", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("t_button_down"), "t_button_down", 540, 542, "", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("t_button_up"), "t_button_up", 540, 540, "pointer", 0, estimation_phosphate_stage, 1);                
                loadImages(queue.getResult("abs_button_down"), "abs_button_down", 500, 542, "", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("abs_button_up"), "abs_button_up", 500, 540, "pointer", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("auto_zero_button_down"), "auto_zero_button_down", 460, 541, "", 0, estimation_phosphate_stage, 1);                
                loadImages(queue.getResult("auto_zero_button_up"), "auto_zero_button_up", 460, 540, "pointer", 0, estimation_phosphate_stage, 1);                
                loadImages(queue.getResult("arrow_blue"), "arrow_sample1", 373, 562.5, "move", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("arrow_green"), "arrow_sample2", 401, 562.5, "move", 0, estimation_phosphate_stage, 1);
                loadImages(queue.getResult("arrow_blue"), "legend_blue", 340, 198, "move", 180, estimation_phosphate_stage, 0.5);
                loadImages(queue.getResult("arrow_green"), "legend_green", 340, 218, "move", 180, estimation_phosphate_stage, 0.5);
                container_border_rect.graphics.beginFill("white"); /** Creating graph container border */
                container_border_rect.graphics.drawRect(58, 233, 285, 330);
                container_border_rect.alpha = 0.1;
                graph_container.addChild(container_border_rect); /** Append it in the container */  
                estimation_phosphate_stage.addChild(graph_container); /** Append it in the stage */                

                setText("blank_text", 38, 115, _("Blank"), "black", 0.9, 0, estimation_phosphate_stage); /** Label for blank testtube */
                setText("sample1_text", 561, 115, _("Sample1"), "black", 0.75, 0, estimation_phosphate_stage); /** Label for sample1 testtube */
                setText("sample2_text", 615, 115, _("Sample2"), "black", 0.75, 0, estimation_phosphate_stage); /** Label for sample2 testtube */
                setText("legend_text_blue", 350, 195, _("Sample 1"), "black", 0.75, 0, estimation_phosphate_stage); /** Label for legend text Sample1 */
                setText("legend_text_green", 350, 215, _("Sample 2"), "black", 0.75, 0, estimation_phosphate_stage); /** Label for legend text Sample2 */
                setText("abs_value_txt", 480, 525, "CL63", "white", 2, 0, estimation_phosphate_stage); /** Label for abs value display text */
                setText("graph_tooltip_value", 480, 525, "12", "black", 0.8, 0, estimation_phosphate_stage); /** Label for abs value display text */
                setText("x_axis_legend", 80, 600, _("Volume of Phosphate Solution (ml)"), "black", 0.9, 0, estimation_phosphate_stage); /** Label for abs value display text */
                setText("y_axis_legend", 23, 450, _("Absorbance"), "black", 0.9, 270, estimation_phosphate_stage); /** Label for abs value display text */

                /** Function call for images used in the apparatus visibility */
                initialisationOfImages();
                /** Translation of strings using gettext */
                translationLabels();

                /** Rect for testtube returning while the click event of rect */
                testtube_return_rect.graphics.beginFill("red").drawRect(540, 445, 40, 80); 
                testtube_return_rect.alpha = 0.01;
                testtube_return_rect.cursor = "pointer";
                estimation_phosphate_stage.addChild(testtube_return_rect);

                if ( testtube_count == 0 ) { /** Testtube count is the count of moved testtube */
                    moveTesttube("testtube_empty", 50, 50, 103, 50); /** Function for the movement of blank testtube */
                }
                
                buttonClickEvents("t_button_up"); /** Effects of button %T */
                buttonClickEvents("auto_zero_button_up"); /** Effects of button Auto Zero */

                graph_container.on("mouseover", function(event) { /** Set a flag as true on graph container mouse over */
                    mouse_over_graph = true;
                });
                graph_container.on("mouseout", function(event) { /** Set it as false on graph container mouse over */
                    mouse_over_graph = false;
                });
                      
                displayGraphTooltip(); /** Function for making tooltip for display the graph x and y values */
                scope.$apply();
            }

            /** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("Next"), _("Close")];
                scope.heading = _("Estimation of Phosphate Content in Soft Drinks");
                scope.variables = _("Instructions");
                scope.result = _("Messages");
                scope.copyright = _("copyright");
                scope.instruction1 = _("instruction1");
                scope.instruction2 = _("instruction2");
                scope.instruction3 = _("instruction3");
                scope.instruction4 = _("instruction4");
                scope.instruction5 = _("instruction5");
                scope.instruction6 = _("instruction6");
                scope.instruction7 = _("instruction7");
                scope.reset_txt = _("Reset");
                scope.$apply();
            }
        }
    }
}

/** All the texts loading and added to the natural_convection_stage */
function setText(name, textX, textY, value, color, fontSize, rot, container) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    _text.rotation = rot;
    if ( name == "abs_value_txt" ) {
        _text.font = "2em digiface";
    }
    container.addChild(_text); /** Adding text to the container */
}

/** All the images loading and added to the natural_convection_stage */
function loadImages(image, name, xPos, yPos, cursor, rot, container, scale) {
    var _bitmap = new createjs.Bitmap(image).set({});
    if ( name == "arrow_sample1" || name == "arrow_sample2" ) {
        _bitmap.regY = _bitmap.image.height / 2;
    }
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
    return estimation_phosphate_stage.getChildByName(child_name); /** Returns the child element of stage */
}
 
/** All variables initialising in this function */
function initialisationOfVariables() {
    testtube_count = 0;
    sample1_line_initial_x = 58;
    sample2_line_initial_x = 58;
    nth_obj = 0; 
    sample_entry = true;
    testtube_flag = false;
    mouse_over_graph = false;  
    testtube_in_machine_flag = false;  
}

/** Set the initial status of the bitmap and 
text depends on its visibility and initial values */
function initialisationOfImages() {
    getChild("testtube_empty").mouseEnabled = true;
    getChild("graph_tooltip_value").alpha = 0;
    graph_tooltip_rect.alpha = 0;
}

/** Stage updation function */
function updateTimer() {
    estimation_phosphate_stage.update();
}

/** Function for making tooltip for display the graph x and y values */
function displayGraphTooltip() {    
    estimation_phosphate_stage.on("stagemousemove", function(event) {
        if ( mouse_over_graph ) { /** If the mouse is over the grid */
            getChild("graph_tooltip_value").alpha = 1;
            graph_tooltip_rect.graphics.clear().beginFill("red").drawRect(event.stageX, event.stageY-20, 90, 20); /** Tooltip rect creating */
            graph_tooltip_rect.alpha = 0.2;
            estimation_phosphate_stage.addChild(graph_tooltip_rect);
            /** Finding the x and y values of graph and display it on the text area */
            getChild("graph_tooltip_value").text = "X:"+((event.stageX-60)/155).toFixed(2)+", Y:"+(Math.abs(event.stageY-560)/300).toFixed(2);
            getChild("graph_tooltip_value").x = event.stageX+3;
            getChild("graph_tooltip_value").y = event.stageY-7;
        } else { /** Else its out of the grid */
            graph_tooltip_rect.alpha = 0;
            getChild("graph_tooltip_value").alpha = 0;
        }
    });
}