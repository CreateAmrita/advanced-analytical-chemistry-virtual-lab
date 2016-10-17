(function(){
    angular
       .module('users')
       .directive("experiment",directiveFunction)
})();
var current_test;
var kplus_test_values;
var naplus_test_values;
var beaker_values;
var hit_image_x;
var hit_image_y;
var hit_max_x ;
var hit_max_y;
var revertBeakers;
var current_test_beaker_number;
var aspirate_flag;
var enable_disable_beaker;
var sample_selected_flag;
var sample_number;
var beaker_init_position_y;
var reset_variables;
var beaker_drop_x;
var beaker_drop_y;
var beaker_init_position_x_array;
var machine_container;
function directiveFunction(){
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
			demoCanvas = document.getElementById("demoCanvas");
			demoCanvas.width = element[0].width;
			demoCanvas.height = element[0].height;
			machine_stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			loadingProgress(queue, machine_stage, demoCanvas.width)
			queue.on("complete", handleComplete, this);
            queue.loadManifest([
            {
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "machine",
                src: "././images/machine.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "number_board",
                src: "././images/number_board.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "top_object",
                src: "././images/top_object.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "beaker_solution",
                src: "././images/beaker_solution.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "apple_juice",
                src: "././images/apple_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "grape_juice",
                src: "././images/grape_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "guava_juice",
                src: "././images/guava_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "lemon_juice",
                src: "././images/lemon_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "lime_juice",
                src: "././images/lime_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "mango_juice",
                src: "././images/mango_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "orange_juice",
                src: "././images/orange_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "pappaya_juice",
                src: "././images/pappaya_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "tomato_juice",
                src: "././images/tomato_juice.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "beaker",
                src: "././images/beaker.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "normal_flame",
                src: "././images/kflame.png",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "second_flame",
                src: "././images/naflame.png",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "label",
                src: "././images/label.png",
                type: createjs.LoadQueue.IMAGE
            }]);
           machine_stage.enableDOMEvents(true);
   machine_stage.enableMouseOver();
   createjs.Touch.enable(machine_stage);
   tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
   machine_container = new createjs.Container(); /** Creating the machine container */
   machine_container.name = "machine_container";
   machine_stage.addChild(machine_container); /** Append it in the stage */
   /**handle complete function  */
            function handleComplete(){              
                loadImages(queue.getResult("background"),"background",0,0,"",0,machine_container);   
                loadImages(queue.getResult("machine"),"background",0,0,"",0,machine_container);                   
                loadImages(queue.getResult("number_board"),"number_board",60,300,"",0,machine_container);loadImages(queue.getResult("top_object"),"top_object",239,132,"",0,machine_container);loadImages(queue.getResult("beaker_solution"),"beaker_1",5,545,"pointer",0,machine_container);
				loadImages(queue.getResult("beaker_solution"),"beaker_2",80,545,"pointer",0,machine_container);
				loadImages(queue.getResult("beaker_solution"),"beaker_3",155,545,"pointer",0,machine_container);
				loadImages(queue.getResult("beaker_solution"),"beaker_4",230,545,"pointer",0,machine_container);  
				loadImages(queue.getResult("beaker"),"beaker_5",300,545,"pointer",0,machine_container);	
				loadImages(queue.getResult("grape_juice"),"beaker_6",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("guava_juice"),"beaker_7",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("lime_juice"),"beaker_8",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("lemon_juice"),"beaker_9",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("mango_juice"),"beaker_10",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("orange_juice"),"beaker_11",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("pappaya_juice"),"beaker_12",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("tomato_juice"),"beaker_13",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("apple_juice"),"beaker_14",300,545,"pointer",0,machine_container); 
				loadImages(queue.getResult("normal_flame"),"normal_flame",490,325,"",0,machine_container);  
				loadImages(queue.getResult("second_flame"),"second_flame",490,325,"",0,machine_container); 
				loadImages(queue.getResult("label"),"label1",45,620,"",0,machine_container);
				loadImages(queue.getResult("label"),"label2",120,620,"",0,machine_container);
				loadImages(queue.getResult("label"),"label3",195,620,"",0,machine_container);
				loadImages(queue.getResult("label"),"label4",270,620,"",0,machine_container);
				loadImages(queue.getResult("label"),"label5",345,620,"",0,machine_container);
				/** Textbox loading */
                setText("test_1",90,390,"138 IE","#ACCB30",1.2);  
				setText("instruction_headOne",435,185,"Switching ON the System","#000000",0.5,machine_container);
                setText("instruction_paraOne",435,192,"1. Switch ON the INSTRUMENT","#000000",0.3,machine_container);
                setText("instruction_paratwo",435,199,"2. Switch ON the COMPRESSOR","#000000",0.3,machine_container);
                setText("instruction_parathree",435,206,"3. Set instrument Gas Control to IGNITE Position ","#000000",0.3,machine_container);
                setText("instruction_parafour",435,213,"4. Ignite the flame by operating Cylinder","#000000",0.3,machine_container);
				setText("instruction_headtwo",435,222,"Switching OFF the System","#000000",0.5,machine_container);
				setText("instruction_parafive",435,229,"1. Switch OFF the Gas Supply ","#000000",0.3,machine_container);
				setText("instruction_parasix",435,236,"2. Aspirate DD water for 5 minutes","#000000",0.3,machine_container);
				setText("instruction_paraseven",435,241,"3. Aspirate Air for 5 minutes","#000000",0.3,machine_container);
				setText("beaker_label_1",56,635,_("Distilledwater"),"#000000",0.7,machine_container);
				setText("beaker_label_2",128,630,_("Standardsolution15ppm"),"#000000",0.65,machine_container);
				setText("beaker_label_3",204,630,_("Standardsolution10 ppm"),"#000000",0.65,machine_container);
				setText("beaker_label_4",278,630,_("Standardsolution5ppm"),"#000000",0.65,machine_container);
				setText("beaker_label_5",350,635,_("Fruit Juice"),"#000000",0.7,machine_container);
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */     
				initialisationOfVariables();/** Initializing the variables */
				mainfunction(scope);
				
				
			}//end handleComplete
            
            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */   
            function translationLabels(){
                /** This help array shows the hints for this experiment */
                help_array=[_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("help6"),_("Next"),_("Close")];
                scope.heading=_("Flame Photometry");
                scope.variables=_("Variables");                             
                scope.select_test=_("Select the Test:");
                scope.first_test=_("K+");
				scope.select_sample=_("Standard solution");
                scope.select_the_sample=_("Select the Sample:");                
                scope.thickness_of_material=_("Thickness of material (cm):");                
                scope.cold_water_temperature=_("Cold water temperature");
                scope.show_cross_section=_("Show cross section")
                scope.show_result=_("Show Result");
                scope.aspirate_btn=_("Aspirate");
				scope.start_test_btn=_("Start the test")
                scope.reset_btn=_("Reset");
				scope.copyright=_("copyright"); 
                /** The test_array contains the values and indexes of the dropdown */
                scope.test_array = [{test:_('K+'),type:0},{test:_('Na+'),type:1}]; 
				scope.sample_array=[{sample:_('Standard solution'),type:0},{sample:_('Grapes'),type:1},{sample:_('Guava'),type:2},{sample:_('Lime'),type:3},{sample:_('Lemon'),type:4},{sample:_('Mango'),type:5},{sample:_('Orange'),type:6},{sample:_('papaya'),type:7},{sample:_('Tomato'),type:8},{sample:_('Apple'),type:9}]
                scope.$apply();             
            }            
        }
    }
}
/** Createjs stage updation happens in every interval */
function updateTimer() {
    machine_stage.update();
}
/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize){
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    if(name=="beaker_label_1"||name=="beaker_label_2"||name=="beaker_label_3"||name=="beaker_label_4"||name=="beaker_label_5")
	_text.lineWidth=60;
	
	if(name=="test_1"){

		_text.font = "1.7em digiface";
	}
    machine_stage.addChild(_text); /** Adding text to the stage */
}
/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot,container){
    var _bitmap = new createjs.Bitmap(image).set({});     
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX=_bitmap.scaleY=1;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor;    
    container.addChild(_bitmap); /** Adding bitmap to the container */
}
/** All variables initialising in this function */
function initialisationOfVariables() {
	current_test=0; /** Variable that decides witch test is selected form the drop-down menu */
	kplus_test_values=[2.88,6.88,0.68,1.16,3.23,2.37,3.60,2.92,1.95]; /** variables used to set the result of k+ test */
	beaker_values=["0.00",15.00,10.00,5.00]; /** Initialising the values of standard solution inside the beaker */
	naplus_test_values=[3.00,3.00,1.00,2.00,4.00,0.00,4.00,6.00,2.00]/** variables used to set the result of Na+ test */
	hit_image_x = 450;
	hit_image_y = 650;
	hit_max_x = 500;
	hit_max_y = 500;
	aspirate_flag=false;
	sample_selected_flag=false;
	beaker_init_position_y=545;
	beaker_drop_x=430;
	beaker_drop_y=526
	beaker_init_position_x_array=[5,80,155,230,300];
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
	/** Resetting the images to its initial status */
	machine_container.getChildByName("second_flame").visible = false;
	for (var i = 6; i < 15; i++) { /** function for hiding  beakers */
		var _beaker_name = "beaker_" + i;
		beaker_name_container = machine_container.getChildByName(_beaker_name);
		beaker_name_container.visible=false;
	}
}