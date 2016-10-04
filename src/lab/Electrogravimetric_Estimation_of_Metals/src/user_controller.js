(function(){
    angular
    .module('users',['FBAngular'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        UserController
    ]);
       
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate) {
        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {        
            var toast = $mdToast.simple()
            .content(helpArray[0])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(helpArray[1])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
          
            var toast2 = $mdToast.simple()
            .content(helpArray[2])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(helpArray[3])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
			
			var toast4 = $mdToast.simple()
            .content(helpArray[4])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
			
			var toast5 = $mdToast.simple()
            .content(helpArray[5])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
			var toast6 = $mdToast.simple()
            .content(helpArray[6])
            .action(helpArray[8])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());      

            $mdToast.show(toast).then(function() {
                $mdToast.show(toast1).then(function() {
                    $mdToast.show(toast2).then(function() {
                        $mdToast.show(toast3).then(function() {
							$mdToast.show(toast4).then(function() {
								$mdToast.show(toast5).then(function() {
									$mdToast.show(toast6).then(function() {
									});
								});
							}); 
                        });
                    });
                });
            });     
        };
  
        var self = this;
        self.selected     = null;
        self.users        = [ ];
        self.toggleList   = toggleUsersList;  	
		$scope.voltage_ctrls_show = true; /** It show the 'concentration' slider */
		$scope.analyte_ctrls_disable = false; /** It hide the the disable property of 'time of flow' drop down */
		$scope.voltage_ctrls_disable = false; /** It hide the the disable property of 'concentration' slider */
		$scope.pause_ctrls_disable = true; 
		$scope.showValue = false; /** It hides the 'Result' tab */
        $scope.showVariables = false; /** I hides the 'Variables' tab */
		$scope.isActive = true;
        $scope.isActive1 = true;
        $scope.goFullscreen = function () {
            /** Full screen */
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
 
        /** Click event function of the Reset button */
        $scope.resetBtn = function() {
            resetExperiment($scope); /** Function defined in experiment.js file */
        };
		
		/** Click event function of the start button */
		$scope.startFn = function() {
			if($scope.start_btn_label == stop_btn_var)
			{
				stopExperiment($scope);
				$scope.start_btn_label = start_btn_var;
			}
			else
			{
			resetWatch();
			for(var i=0;i<circle_arr.length;i++)
			{
			electrogravimetric_stage.removeChild(circle_arr[i]);
			}
			$scope.start_btn_label = stop_btn_var;
			start_flag = true;
			pause_flag = false;
			$scope.pause_ctrls_disable = false;
			$scope.analyte_ctrls_disable = true;
			$scope.voltage_ctrls_disable = true;
			$scope.time_ctrls_disable = true;
			$scope.resistance_ctrls_disable = true;
			total_weight = (parseFloat(10).toFixed(2));
			$scope.total_weight_value = total_weight;
			}
        };
		
		/** Change event function of time of flow drop down */
		$scope.setAnalyte =function(){
                setAnalyteFn($scope);
        }
		/** Change event function of resistance slider */
		$scope.adjustResistance = function() {
			adjustResistanceFn($scope);
		}
		/** Change event function of voltage slider */
		$scope.displayVoltage = function() {
			displayVoltageFn($scope);
		}
		/** Change event function of time slider*/
		$scope.setTime = function() {
			setTimeFn($scope);
		}
		/** Click event function of the pause button */
		$scope.pause = function() {
			if($scope.pause_btn_label == play_btn_var)
			{
				playFn($scope);
			}
			else
			{
				pauseFn($scope);
			}
		}
		$scope.toggle = function() {
			$scope.showValue = !$scope.showValue;
			$scope.isActive = !$scope.isActive;
		};
		$scope.toggle1 = function() {
			$scope.showVariables = !$scope.showVariables;
			$scope.isActive1 = !$scope.isActive1;
		};
        /**
        * First hide the bottom sheet IF visible, then
        * hide or Show the 'left' sideNav area
        */
        function toggleUsersList() {
			$mdSidenav('right').toggle();
        }
    }
})();