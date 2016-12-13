/** Function for getting the points of graph */
function getPoints(evt) {
    var circle = new createjs.Shape(); /** Drawing small circles as points */
    circle.graphics.beginFill("green").drawCircle(0, 0, 2);
    circle.x = evt.stageX;
    circle.y = evt.stageY;
    graph_container.addChild(circle);
    var graph_line = new createjs.Shape(); /** Drawing the lines for connecting two points */
    graph_line.id = nth_obj;
    graph_line.graphics.setStrokeStyle(1);
    graph_line.graphics.beginStroke("red");
    graph_line.graphics.moveTo(prev_x_val, prev_y_val);
    graph_line.graphics.lineTo(evt.stageX, evt.stageY);
    graph_line.graphics.endStroke();
    graph_container.addChild(graph_line);
    line_obj_array[nth_obj] = graph_line; /** Pushing the graph lines into an array */
    nth_obj++; /** Increment of array index */
    prev_x_val= circle.x; /** Taking the previous point x and y value in variables */
    prev_y_val= circle.y;
}

/** Function for the movement of testtube */
function moveTesttube(testtube, x_pos, y_pos) {
    testtube_flag = false;
    getChild(testtube).on("click", function(evt) { /** Testtube click function */       
        getChild(testtube).mouseEnabled = false;
        getChild(testtube).x = 555;
        getChild(testtube).y = 390;
        testtubeInMachine(testtube, x_pos, y_pos); /** Function for testtube placed in machine */
    });
}

/** Function for testtube placed in machine */
function testtubeInMachine(testtube, x_pos, y_pos) {
    testtube_in_machine_flag = true;
    var testtube_tween = createjs.Tween.get(getChild(testtube)).to({
        y: 450
    }, 1000).call(function() {    
        testtube_count += 1;
        buttonClickEvents("abs_button_up"); /** Abs button click event */
        testtubeReturn(testtube, x_pos, y_pos); /** Testtube returning to the stand while clicking on the corresponding testtube */
        if ( testtube_count >= 2 ) {
            graph_listner = graph_container.on("click", getPoints); /** Marking the points while clicking on graph container */
        } 
    });
}

 /** Testtube returning to the stand while clicking on the corresponding testtube */
function testtubeReturn(testtube, x_pos, y_pos) {
    testtube_return_rect.mouseEnabled = false;
    testtube_return_rect.on("mousedown", function(event) { /** Testtube return mouse down function */
        testtube_return_rect.mouseEnabled = false;        
        getChild(testtube).x = x_pos;
        getChild(testtube).y = y_pos;
        testtube_flag = true; 
        testtube_in_machine_flag = false;
        getChild("abs_value_txt").text = "000";   
        if ( testtube_count == 11 && sample_entry ) {
            dragSampleOneArrow();
            sample_entry = false;
        }  
        if ( testtube_count == 12 ) { /** If all 12 testtube's absorbance were found */
            testtube_count++;
            dragSampleTwoArrow(); /** Function for Sample2 arrow drag event */
        }
    });
    testtube_return_rect.on("pressup", function(event) { /** Testtube return press up function */         
        if ( testtube_flag ) {            
            if ( testtube_count == 1 ) {
                moveTesttube("testtube_with_solution1", 103, 50); /** Testtube1 movement function with respect to the testtube count */
            } else if ( testtube_count == 2 ) {
                moveTesttube("testtube_with_solution2", 156, 50); /** Testtube2 movement function with respect to the testtube count */
            } else if ( testtube_count == 3 ) {
                moveTesttube("testtube_with_solution3", 209, 50); /** Testtube3 movement function with respect to the testtube count */
            } else if ( testtube_count == 4 ) {
                moveTesttube("testtube_with_solution4", 262, 50); /** Testtube4 movement function with respect to the testtube count */
            } else if ( testtube_count == 5 ) {
                moveTesttube("testtube_with_solution5", 315, 50); /** Testtube5 movement function with respect to the testtube count */
            } else if ( testtube_count == 6 ) {
                moveTesttube("testtube_with_solution6", 368, 50); /** Testtube6 movement function with respect to the testtube count */
            } else if ( testtube_count == 7 ) {
                moveTesttube("testtube_with_solution7", 421, 50); /** Testtube7 movement function with respect to the testtube count */
            } else if ( testtube_count == 8 ) {
                moveTesttube("testtube_with_solution8", 473, 50); /** Testtube8 movement function with respect to the testtube count */
            } else if ( testtube_count == 9 ) {
                moveTesttube("testtube_with_solution9", 526, 50); /** Testtube9 movement function with respect to the testtube count */
            } else if ( testtube_count == 10 ) {
                moveTesttube("testtube_with_solution10", 578, 50); /** Testtube10 movement function with respect to the testtube count */
            } else if ( testtube_count == 11 ) {
                moveTesttube("testtube_with_solution11", 630, 50); /** Testtube11 movement function with respect to the testtube count */
            }
        }
    });            
}

/** Function for Sample1 arrow drag event */
function dragSampleOneArrow() {
    collide_x_line = new createjs.Shape();
    down_listner = getChild("arrow_sample1").on("mousedown", mouseDown); /** Sample1 arrow mouse down event, mouseDown function is calling on this */
    press_listner = getChild("arrow_sample1").on("pressmove", mousePress); /** Sample1 arrow mouse press event, mousePress function is calling on this */
    up_listner = getChild("arrow_sample1").on("pressup", mouseUp); /** Sample1 arrow press up event, mouseUp function is calling on this */
}

/** Function for Sample2 arrow drag event */
function dragSampleTwoArrow() {
    down_listner_2 = getChild("arrow_sample2").on("mousedown", mouseDown); /** Sample2 arrow mouse down event, mouseDown function is calling on this */
    press_listner_2 = getChild("arrow_sample2").on("pressmove", mousePress); /** Sample2 arrow mouse press event, mousePress function is calling on this */
    up_listner_2 = getChild("arrow_sample2").on("pressup", mouseUp); /** Sample2 arrow press up event, mouseUp function is calling on this */
}

/** Function for drawing collide point x line of sample1 on draging sample1 arrow */
function drawCollideXlineOne() {
    if ( sample1_line_initial_x < 340 ) {
        sample1_line_initial_x++;
        collide_x_line.graphics.moveTo(prev_sample1_line_initial_x, getChild("arrow_sample1").y).setStrokeStyle(1).beginStroke("BLUE").lineTo(sample1_line_initial_x, getChild("arrow_sample1").y); 
        collide_x_line.graphics.endStroke();
        prev_sample1_line_initial_x = sample1_line_initial_x;
        graph_container.addChild(collide_x_line);
        for ( i = 1; i < line_obj_array.length; i++ ) {
            /** Check whether the collide point x line hit with the graph line */
            if ( line_obj_array[i].hitTest(sample1_line_initial_x, getChild("arrow_sample1").y) ) { 
                collide_x_line.graphics.moveTo(prev_sample1_line_initial_x, getChild("arrow_sample1").y).setStrokeStyle(1).beginStroke("BLUE").lineTo(sample1_line_initial_x, 563);
                clearInterval(sample1_x_line_timer);
                down_listner = getChild("arrow_sample1").on("mousedown", mouseDown);
                press_listner = getChild("arrow_sample1").on("pressmove", mousePress);
                up_listner = getChild("arrow_sample1").on("pressup", mouseUp);
            }
        }
    } else {
        clearInterval(sample1_x_line_timer);
        down_listner = getChild("arrow_sample1").on("mousedown", mouseDown);
        press_listner = getChild("arrow_sample1").on("pressmove", mousePress);
        up_listner = getChild("arrow_sample1").on("pressup", mouseUp);
    }
}

/** Function for drawing collide point x line of sample2 on draging sample2 arrow */
function drawCollideXlineTwo() {
    if ( sample2_line_initial_x < 340 ) {
        sample2_line_initial_x++;
        collide_x_line.graphics.moveTo(prev_sample2_line_initial_x, getChild("arrow_sample2").y).setStrokeStyle(1).beginStroke("GREEN").lineTo(sample2_line_initial_x, getChild("arrow_sample2").y); 
        collide_x_line.graphics.endStroke();
        prev_sample2_line_initial_x = sample2_line_initial_x;
        graph_container.addChild(collide_x_line);
        for(i = 1; i < line_obj_array.length; i++){
            /** Check whether the collide point x line hit with the graph line */
            if(line_obj_array[i].hitTest(sample2_line_initial_x, getChild("arrow_sample2").y)){
                collide_x_line.graphics.moveTo(prev_sample2_line_initial_x, getChild("arrow_sample2").y).setStrokeStyle(1).beginStroke("GREEN").lineTo(sample2_line_initial_x, 563);
                clearInterval(sample2_x_line_timer);
                down_listner_2 = getChild("arrow_sample2").on("mousedown", mouseDown);
                press_listner_2 = getChild("arrow_sample2").on("pressmove", mousePress);
                up_listner_2 = getChild("arrow_sample2").on("pressup", mouseUp);
            }
        }
    } else {
        clearInterval(sample2_x_line_timer);
        down_listner_2 = getChild("arrow_sample2").on("mousedown", mouseDown);
        press_listner_2 = getChild("arrow_sample2").on("pressmove", mousePress);
        up_listner_2 = getChild("arrow_sample2").on("pressup", mouseUp);
    }    
}

/** Mouse down event function */
function mouseDown(evt){
    this.parent.addChild(this);
    this.offset = {
        y: this.y - evt.stageY
    };
}

/** Mouse press event function */
function mousePress(evt){
    if ( evt.stageY > 235 && evt.stageY < 562 ) {
        this.y = evt.stageY + this.offset.y;
    }
}

/** Mouse up event function */
function mouseUp(evt){
    if ( evt.target.name == "arrow_sample1" ) {
        clearInterval(sample1_x_line_timer);
        getChild("arrow_sample1").off("mousedown", down_listner);
        getChild("arrow_sample1").off("pressmove", press_listner);
        getChild("arrow_sample1").off("pressup", up_listner);
        sample1_line_initial_x = prev_sample1_line_initial_x = 58;    
        sample1_x_line_timer = setInterval(function() {
            drawCollideXlineOne("arrow_sample1","BLUE");
        }, 10); /** Draw x line timer of sample1 */
    } else {
        clearInterval(sample2_x_line_timer);
        getChild("arrow_sample2").off("mousedown", down_listner_2);
        getChild("arrow_sample2").off("pressmove", press_listner_2);
        getChild("arrow_sample2").off("pressup", up_listner_2);
        sample2_line_initial_x = prev_sample2_line_initial_x = 58;
        sample2_x_line_timer = setInterval(function() {
            drawCollideXlineTwo("arrow_sample2","GREEN");
        }, 10); /** Draw x line timer of sample2 */ 
    }
}

/** Function for machine button click event */
function buttonClickEvents(name) {
    getChild(name).on("mousedown", function(evt) { /** Button mouse down function */
        getChild(name).visible = false;
        if ( name == "abs_button_up" & testtube_in_machine_flag ) { /** If the clicked button is Abs button with respect to the testtube */
            switch ( testtube_count ) {
                case 1:
                    getChild("abs_value_txt").text = "000";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 2:
                    getChild("abs_value_txt").text = "0.20";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 3:
                    getChild("abs_value_txt").text = "0.31";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 4:
                    getChild("abs_value_txt").text = "0.41";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 5:
                    getChild("abs_value_txt").text = "0.51";
                    testtube_return_rect.mouseEnabled = true;
                break;
                case 6:
                    getChild("abs_value_txt").text = "0.60";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 7:
                    getChild("abs_value_txt").text = "0.71";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 8:
                    getChild("abs_value_txt").text = "0.81";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 9:
                    getChild("abs_value_txt").text = "0.92";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 10:
                    getChild("abs_value_txt").text = "1.02";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                case 11:
                    getChild("abs_value_txt").text = "0.22";
                    testtube_return_rect.mouseEnabled = true;
                    break;					
                case 12:
                    getChild("abs_value_txt").text = "0.34";
                    testtube_return_rect.mouseEnabled = true;
                    break;
                default:
                    getChild("abs_value_txt").text = "CL63";
                    break;
            }
        }
    });   
    getChild(name).on("pressup", function(event) { /** Button press up event */
        getChild(name).visible = true;
    });
}

/** Reset the experiment in the reset button event */
function resetExperiment() {
    window.location.reload();
}

/** Calculation starts here */

/** Calculation ends here */