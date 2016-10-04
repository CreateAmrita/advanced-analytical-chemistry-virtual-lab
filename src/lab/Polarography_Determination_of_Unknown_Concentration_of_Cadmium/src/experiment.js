/** Change concentration dropdown event */
function concentrationEvent(scope) {
    calculation(scope); /** All value and graph plotting calculations are in this function */
}

/** Hand returns back after loading cadmium */
function handBack(scope) {
    getChild("hand_with_glass").visible = false; /** Hand with glass image set visible false */
    getChild("hand").visible = true; /** Hand and cadmium image set visible true */
    getChild("cadmium").visible = true;
    scope.graph_disable = false; /** Enable Plot Graph button */
    var hand_return_tween = createjs.Tween.get(getChild("hand")).to({
        x: 350, y: 700
    }, 1000); /** Tween of hand movement after loading cadmium */
    scope.$apply();  
}

/** Load Cadmium butten event */
function loadCadmiumEvent(scope) {
    var hand_movement_tween = createjs.Tween.get(getChild("hand_with_glass")).to({
        x: 60, y: 550
    }, 1000); /** Hand tween movement for loading cadmium */
    setTimeout(function() { handBack(scope)}, 1500); /** Hand returns back after loading cadmium */
    scope.concentration_disable = true; /** Select concentration drop down are disabled */
}

/** Scan analysis dropdown change event */
function scanAnalysisChange(scope) {
    calculation(scope); /** All value and graph plotting calculations are in this function */
    if ( scope.scan_analysis == 1 ) { /** If scan analysis is polarogram */      
        getChild("graph_text").text = polarogram;
    } else { /** Else derivative */
        getChild("graph_text").text = derivative;
    }
}

/** Plot Graph button event */
function plotGraphEvent(scope) {
    makeGraph(scope); /** Function for plotting the graph */
    calculation(scope); /** All value and graph plotting calculations are in this function */    
    scope.hide_show_result = false; /** Display the result */
    scope.reset_disable = false; /** Reset button enabled */
    scope.control_disable = true; /** Other controls are disabled */
    scope.graph_disable = true; /** Graph button disabled */
    scope.load_cadmium_disable = true; /** Load Cadmium button disabled */
}

/** Initial mV and final mV text value validation */
function inputValidation(scope, dialogs) {
    if ( scope.mVinitial > -300 ) { /** If initial mV greater than -300 */
        dialogs.error(); /** Error alert */
        scope.mVinitial = -300; /** Set default initial mV */
    } else if ( scope.mVfinal > -608 ) { /** If final mV greater than -608 */
        dialogs.error(); /** Error alert */
        scope.mVfinal = -1000; /** Set default final mV */
    }
}

/** Reset the experiment in the reset button event */
function resetExperiment() {
    window.location.reload();
}

/** Draws a chart in canvas js for making graph plotting */
function makeGraph(scope){
    chart= new CanvasJS.Chart("graphDiv", {
        axisX: {
            title: _("Voltage (mV)"),
            titleFontSize: 12,
            minimum:scope.mVfinal,
            maximum:0,
            labelAngle:-30
        },
        axisY2: {
            title: _("Current")+" (µA/div)",
            titleFontSize: 12,
            minimum:0,
            maximum:25
        },
        data: [{
            color: "red",
            type: "line",
            markerType: "circle",  
            markerSize:5,           
            lineThickness: 1.5,
            axisYType: "secondary",
            /** Array contains momentum data for Object A */
            dataPoints: dataplot_array
        }]  
    });
    /** Rendering the graph for momentum*/  
    chart.render();   
}

/** Calculation starts here */

function calculation(scope) {
    x_axis_array = []; /** Clear the arrays */
    y_axis_array = [];
    y_axis = [];
    x_axis = [];
    x_axis_array_value = [];
    dataplot_array = [];
    average_diffusion = (scope.Concentration/1000)*DIFFUSION_CONST; /** Calculate the average diffusion */
    diffusion = Math.log10((average_diffusion-DIFFUSION_LOG_CONST)/DIFFUSION_LOG_CONST); /** Diffusion calculation */
    mass_flow_rate = (MASS_CONST/2)*diffusion; /** Mass flow rate calculation */
    applied_voltage = VOLTAGE_CONST-mass_flow_rate; /** Applied voltage calculation */
    average_diffusion_half = average_diffusion/DIFFUSION_LOG_CONST;
    center = average_diffusion_half/2; /** Center point calculation */
    slope = ((applied_voltage+MIN_FINAL_MV_CONST)/center).toFixed(3); /** Slope calculation */
    scope.result_value = average_diffusion.toFixed(2); /** Display the average diffusion value as result */
    y_axis_array.push(0, 0, 0); /** Initial three values of y_axis_array and y_axis are pushed here */
    y_axis.push(0, 0, 0);
    x_axis_array.push(0, scope.mVinitial); /** x_axis_array initial two values are pushed here */

    if ( scope.scan_analysis == 1 ) { /** If the graph is polarogram */
        for ( var i=0.1; i<=CURRENT_VOLTAGE_LIMIT_CONST; i+=.1 ) {
            y_axis_array.push(i); /** Rest of the values are pushed in y_axis_array */
            if ( i < average_diffusion_half ) { 
                y_axis.push(i); /** The i value is pushed in y_axis till the i value is < average diffusion half */
            }
        }
        for ( var j = y_axis.length; j<=CURRENT_VOLTAGE_LIMIT_CONST; j++ ) {        
            y_axis.push(average_diffusion_half); /** Rest of the y_axis array value set as average_diffusion_half */
        }   

        /** Calculate the fourth element of x_axis_array */
        var x_axis_array_fourth = slope*X_AXIS_ARRAY_FOURTH_CONST-MIN_FINAL_MV_CONST;

        /** Calculate the third element of x_axis_array */
        var x_axis_array_third = x_axis_array_fourth-X_AXIS_ARRAY_THIRD_CONST;

        /** Push third and fourth elements in to x_axis_array */ 
        x_axis_array.push(x_axis_array_third, x_axis_array_fourth); 

        for ( var k=4; k<=9; k+=1 ) {
            /** Calculate fifth to tenth values of x_axis_array */
            var x_axis_array_rest_values = slope*y_axis_array[k]-MIN_FINAL_MV_CONST; 
            x_axis_array.push(x_axis_array_rest_values); /** Push that values to x_axis_array */
        }

        /** Calculate the second last value of x_axis_array */
        var x_axis_array_sec_last = scope.mVfinal+X_AXIS_ARRAY_SEC_LAST_CONST; 

        /** Push second last value and last value to the x_axis_array */
        x_axis_array.push(x_axis_array_sec_last, scope.mVfinal);

        /** Calculate the third element of x_axis_array_value */
        var x_axis_array_value_third = X_AXIS_ARRAY_VALUE_THIRD_CONST*y_axis[2]-MIN_FINAL_MV_CONST; 

        /** Push first three values to x_axis_array_value */
        x_axis_array_value.push(0, scope.mVinitial, x_axis_array_value_third); 

        for ( var m=3; m<=CURRENT_VOLTAGE_LIMIT_CONST; m++ ) {
            /** Calculating the rest of the values for x_axis_array_value */
            var x_axis_array_value_rest = slope*y_axis_array[m]-MIN_FINAL_MV_CONST; 
            x_axis_array_value.push(x_axis_array_value_rest); /** Push the values to x_axis_array_value */
        }
        for ( var n=0; n<=CURRENT_VOLTAGE_LIMIT_CONST; n++ ) { 
            if ( y_axis_array[n] <= 2*center ) { /** Check whether the y_axis_array value is less than or equal to double of center value */
               x_axis.push(x_axis_array_value[n]); /** Push the x_axis_array_value to x_axis */
            }
        }
        for ( var p=x_axis.length; p<=CURRENT_VOLTAGE_LIMIT_CONST; p++ ) {            
            x_axis.push(scope.mVfinal); /** Set rest of the value as mv final value in x_axis array */
        }
        for ( var q=0; q<=CURRENT_VOLTAGE_LIMIT_CONST; q++ ) {  
            dataplot_array.push({x:x_axis[q], y:y_axis[q]}); /** Push x_axis and y_axis array to dataplot_array for ploting graph */
        }
    } else { /** If the graph is derivative */
        for ( var i=0.1; i<=CURRENT_VOLTAGE_LIMIT_CONST; i+=0.1 ) {
            y_axis_array.push(i); /** Rest of the values are pushed in y_axis_array */
            if ( i < center ) {
                y_axis.push(i); /** The i value is pushed in y_axis till the i value is < center */
            }
        } 
        var last_val = y_axis[y_axis.length-2]; /** Find the current last value of y_axis array */
        for ( var j = last_val; j>=0; j-=0.1 ) { 
            y_axis.push(j); /** Rest of the y_axis array values are calculating by substracting 0.1 from the last_val till the value is 0 */                
        }
        for ( var k = y_axis.length-1; k<=CURRENT_VOLTAGE_LIMIT_CONST; k++ ) {        
            y_axis.push(0); /** Set the rest of the value of y_axis array is 0 */
        }

        /** Calculate the fourth element of x_axis_array */
        var x_axis_array_fourth = slope*y_axis_array[3]-MIN_FINAL_MV_CONST;

        /** Calculate the third element of x_axis_array */ 
        var x_axis_array_third = x_axis_array_fourth-X_AXIS_ARRAY_THIRD_CONST;

        /** Push third and fourth elements in to x_axis_array */
        x_axis_array.push(x_axis_array_third, x_axis_array_fourth);

        for ( var m=4; m<=9; m+=1 ) {
            /** Calculate fifth to tenth values of x_axis_array */
            var x_axis_array_rest_values = slope*y_axis_array[m]-MIN_FINAL_MV_CONST; 
            x_axis_array.push(x_axis_array_rest_values); /** Push that values to x_axis_array */
        }

        /** Calculate the second last value of x_axis_array */
        var x_axis_array_sec_last = scope.mVfinal+X_AXIS_ARRAY_SEC_LAST_CONST;

        /** Push second last value and last value to the x_axis_array */ 
        x_axis_array.push(x_axis_array_sec_last, scope.mVfinal); 

        /** Calculate the third element of x_axis_array_value */
        var x_axis_array_value_third = X_AXIS_ARRAY_VALUE_THIRD_CONST*y_axis_array[2]-MIN_FINAL_MV_CONST;

        /** Push first three values to x_axis_array_value */
        x_axis_array_value.push(0, scope.mVinitial, x_axis_array_value_third);

        for ( var n=3; n<=CURRENT_VOLTAGE_LIMIT_CONST; n++ ) {
            /** Calculating the rest of the values for x_axis_array_value */
            var x_axis_array_value_rest = (parseFloat(slope)*parseFloat(y_axis_array[n]))-MIN_FINAL_MV_CONST;
            x_axis_array_value.push(x_axis_array_value_rest); /** Push the values to x_axis_array_value */
        }
        for ( var p=0; p<=CURRENT_VOLTAGE_LIMIT_CONST; p++ ) {
            if ( y_axis_array[p] < (average_diffusion_half-0.1) ) { /** Check whether the y_axis_array value is less than or equal to double of center value */
                x_axis.push(x_axis_array_value[p]); /** Push the x_axis_array_value to x_axis */
            }
        }               
        for ( var q = x_axis.length; q<=CURRENT_VOLTAGE_LIMIT_CONST; q++ ) {            
            x_axis.push(scope.mVfinal); /** Set rest of the value as mv final value in x_axis array */        
        }
        for ( var r = 0; r<=CURRENT_VOLTAGE_LIMIT_CONST; r++ ) {  
            dataplot_array.push({x:x_axis[r], y:y_axis[r]}); /** Push x_axis and y_axis array to dataplot_array for ploting graph */
        }
    }
}

/** Calculation ends here */