function mainfunction(scope){


		machine_container.getChildByName("beaker_5").mouseEnabled = false; /** Initially disabling the mouseEnabled functionality of  fifth beaker */
				for (var i = 1; i < 15; i++) { /** function for enabling the click functionality to the corresponding beakers */
					var _beaker_name = "beaker_" + i;
					beaker_name_container = machine_container.getChildByName(_beaker_name);
					beaker_name_container.on("pressmove", function(evt) {
						current_test_beaker_name = this.name;
						dragAndDrop_Beaker(current_test_beaker_name);
						current_test_beaker_number = current_test_beaker_name.slice(7); /** Slicing the current beaker number */
					});
				}
				/**Drag functionality of beaker */
				function dragAndDrop_Beaker(current_test_beaker_name) {
					machine_container.getChildByName(current_test_beaker_name).on("pressmove", function(evt) {
						evt.target.x = evt.stageX-60;
						evt.target.y = evt.stageY-60;
						tub_current_position_x = evt.stageX;
						tub_current_position_y = evt.stageY;
						enable_disable_beaker(false)  /** Disabling the mouseEnabled functionality of other beakers  */
						machine_container.getChildByName(current_test_beaker_name).mouseEnabled = true;
					});
					
					/**Drop functionality of Beaker. */
					machine_container.getChildByName(current_test_beaker_name).on("pressup", function(evt) {
						if (tub_current_position_x > hit_image_x && tub_current_position_y < hit_image_y && tub_current_position_x < hit_max_x && tub_current_position_y > hit_max_y) { /**Finding the Drop area of the Beaker. */
							/** setting the beaker in the bottom of the machine */
							machine_container.getChildByName(current_test_beaker_name).x = beaker_drop_x; 
							machine_container.getChildByName(current_test_beaker_name).y = beaker_drop_y; 
							enable_aspirate(scope)/** enabling the aspirate button */
							scope.sample_disable=true; /** It disabling the sample drop-down */ 
							scope.test_disable=true;/** It disabling the test drop-down */ 
							scope.$apply();
							if(aspirate_flag && sample_selected_flag){ /* if the fruit juice is selected */
								scope.aspirate_disable=true; /** It disabling the aspirate button */ 
								scope.start_test_disable=false; /** It enables the "start test" button */ 
								scope.$apply();
							}
						} else {
							revertBeakers() /** calling the revertBeakers function for replace the beakers in its original position */
						}
					});
				}
				function enable_aspirate(){/** function for enabling the aspirate button */
					scope.aspirate_disable=false; /** It enable the button 'Aspirate' */ 
					scope.$apply();
				}
				/**Function is used to revert the beakers in it original position. */
			    revertBeakers=function () {
					machine_container.getChildByName("beaker_1").y = beaker_init_position_y;
					machine_container.getChildByName("beaker_1").x = beaker_init_position_x_array[0];
					machine_container.getChildByName("beaker_2").y =beaker_init_position_y; 
					machine_container.getChildByName("beaker_2").x = beaker_init_position_x_array[1];
					machine_container.getChildByName("beaker_3").y = beaker_init_position_y;
					machine_container.getChildByName("beaker_3").x = beaker_init_position_x_array[2]; 
					machine_container.getChildByName("beaker_4").y = beaker_init_position_y;
					machine_container.getChildByName("beaker_4").x = beaker_init_position_x_array[3];
					machine_stage.getChildByName("test_1").text ="138 IE"; /** set the display value normal */
					scope.aspirate_disable=true; /** It disabling the button 'Aspirate' */ 
					scope.$apply();
					changeFlame(1) /** Changing the flame in normal */
					for (var i = 5; i < 15; i++) { /** Reverting the fruit juice contain beakers on its initial position   */
						var _beaker_name = "beaker_" + i;
						machine_container.getChildByName(_beaker_name).y = beaker_init_position_y;
						machine_container.getChildByName(_beaker_name).x = beaker_init_position_x_array[4];
						scope.start_test_disable=true; /** It disabling the "start test" button */ 
						scope.test_disable=false; /** It disabling the "test" drop-down menu */ 
						scope.$apply();
					}
					
					if(sample_number>=6){ /** if we select the fruit juice contain beakers, the select test drop-down disables while it revert */ 
						scope.test_disable=true;
						scope.$apply(); 
					}
					else{
						enable_disable_beaker(true);/** Enabling the beakers drag functionality */
					}
					if(aspirate_flag){
						scope.sample_disable=false;  /** enabling the sample drop-down */
						scope.$apply();
					}
					
			    }
				
				enable_disable_beaker= function (on_off_value){/** This function is used for enabling the and disabling the mouseEnabled functionality of the beakers */
					machine_container.getChildByName("beaker_1").mouseEnabled = on_off_value;
					machine_container.getChildByName("beaker_2").mouseEnabled = on_off_value;
					machine_container.getChildByName("beaker_3").mouseEnabled = on_off_value;
					machine_container.getChildByName("beaker_4").mouseEnabled = on_off_value;
				}
				
				reset_variables =function (){ /** function is used to reset the variable values and buttons */
					scope.sample_disable=true;  
					scope.start_test_disable=true; 
					scope.test_disable=false;
					scope.aspirate_disable=true;
					scope.select_sample=0;
					scope.first_test=0;
				}
			}

/** Change the test depends on the selection from the dropdown box */
function test_ChangeOption(scope) {
    selected_Test = scope.first_test;
	current_test=selected_Test;
	scope.sample_disable=true;
}
/** Change the juice sample on the selection from the dropdown box */
function samplechangeOption(scope) {
    selected_sample =scope.select_sample;
	sample_number= parseInt(selected_sample)+5;
	for (var i = 5; i < 15; i++) { 
		var _beaker_name = "beaker_" + i;
		beaker_name_container = machine_container.getChildByName(_beaker_name);
		beaker_name_container.visible=false;
	}
	machine_container.getChildByName("beaker_"+sample_number).visible=true; 
	if(sample_number>=6){
		sample_selected_flag=true;
		enable_disable_beaker(false) 
		scope.test_disable=true;
	}
	else{
		sample_selected_flag=false;
		enable_disable_beaker(true) 
		scope.test_disable=false;
	}
}
/** function for aspirate the sample */
function aspirateSample(scope){
	aspirate_flag=true;
	if(current_test==0){
		machine_stage.getChildByName("test_1").text = beaker_values[current_test_beaker_number-1]+" ppm";
		changeFlame(1);
	}
	else{
		machine_stage.getChildByName("test_1").text = beaker_values[current_test_beaker_number-1]+" ppm";
		changeFlame(0);
		if(current_test_beaker_number == 1){
			changeFlame(1);
		} 
	}
}
/** Function for changing the flames inside the machine */
function changeFlame(flame){		
	if(flame==1){
		machine_container.getChildByName("normal_flame").visible = true;
		machine_container.getChildByName("second_flame").visible = false;
	}
	else{
		machine_container.getChildByName("normal_flame").visible = false;
		machine_container.getChildByName("second_flame").visible = true;
	}
}
/** function for start the test  */
function start_test(scope){
	if(current_test==0){
		machine_stage.getChildByName("test_1").text = kplus_test_values[current_test_beaker_number-6]	+" ppm";
		changeFlame(1);
	}
	else{
		machine_stage.getChildByName("test_1").text = naplus_test_values[current_test_beaker_number-6]	+" ppm";
		changeFlame(0);
	}
}
/** Reset function */
function resetExperiment(scope) {
	machine_container.getChildByName("beaker_1").y = beaker_init_position_y;
	machine_container.getChildByName("beaker_1").x = beaker_init_position_x_array[0];
	machine_container.getChildByName("beaker_2").y =beaker_init_position_y;
	machine_container.getChildByName("beaker_2").x = beaker_init_position_x_array[1];
	machine_container.getChildByName("beaker_3").y = beaker_init_position_y;
	machine_container.getChildByName("beaker_3").x = beaker_init_position_x_array[2]; 
	machine_container.getChildByName("beaker_4").y = beaker_init_position_y;
	machine_container.getChildByName("beaker_4").x = beaker_init_position_x_array[3]; 
	machine_container.getChildByName("beaker_5").y = beaker_init_position_y;
	machine_container.getChildByName("beaker_5").x = beaker_init_position_x_array[4]; 
	machine_container.getChildByName("beaker_1").mouseEnabled = true;
	machine_container.getChildByName("beaker_2").mouseEnabled = true;
	machine_container.getChildByName("beaker_3").mouseEnabled = true;
	machine_container.getChildByName("beaker_4").mouseEnabled = true;
	machine_container.getChildByName("normal_flame").visible = true;
	machine_container.getChildByName("second_flame").visible = false;
	reset_variables(); 
	machine_stage.getChildByName("test_1").text = "138 IE";
	for (var i = 5; i < 15; i++) { 
		var _beaker_name = "beaker_" + i;
		beaker_name_container = machine_container.getChildByName(_beaker_name);
		beaker_name_container.visible=false;
	}
	machine_container.getChildByName("beaker_5").visible=true;
	aspirate_flag=false;
	sample_selected_flag=false;
	current_test=0;
					
}
