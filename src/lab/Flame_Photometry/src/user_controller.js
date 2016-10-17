(function(){
    angular
    .module('users',['FBAngular','ui.bootstrap','dialogs.main','pascalprecht.translate'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate', '$translate','dialogs',
        UserController
    ])
   .config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){
		dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(false);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');
        $translateProvider.translations(language,{DIALOGS_ERROR:(_("Error")),DIALOGS_ERROR_MSG:(_("Voltage of both heaters must be same.")),DIALOGS_CLOSE:(_("Okay"))}),$translateProvider.preferredLanguage(language);
	}]);
	   
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate, $translate, dialogs) {
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
            .content(help_array[0])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(help_array[1])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple()
            .content(help_array[2])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(help_array[3])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast4 = $mdToast.simple()
            .content(help_array[4])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());            

            var toast5 = $mdToast.simple()
            .content(help_array[5])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

         
           

            $mdToast.show(toast).then(function() {
                $mdToast.show(toast1).then(function() {
                    $mdToast.show(toast2).then(function() {
                        $mdToast.show(toast3).then(function() {
                            $mdToast.show(toast4).then(function() {
                                $mdToast.show(toast5).then(function() {
                                    
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
    
        $scope.showValue = false; /** It hides the 'Result' tab */
        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = true;
        $scope.isActive1 = true;
        
        $scope.test_disable=false; /** It disables the controls drop down box 'select test'*/        
        $scope.sample_disable=true; /** It disables the controls drop down box 'select sample' */        
        $scope.aspirate_disable=true; /** It disables the button 'Aspirate' */        
        $scope.start_test_disable=true; /** It disables the button 'Start The Test' */        
        $scope.hide_show_result=false; /** It hides the show result check box */   
        $scope.show_result_disable=true; /** It disables the show result check box */   
        $scope.diameter=10; /** Initial diameter slider value */
        $scope.thickness=0.5; /** Initial compass box position slider value */
        $scope.temperature=0; /** Initial magnetic field result value */
        $scope.conductivity_value=0;
		
        $scope.goFullscreen = function () {
            /** Full screen */
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
        
        $scope.toggle = function () {
            $scope.showValue=!$scope.showValue;
            $scope.isActive = !$scope.isActive;
        };	
        $scope.toggle1 = function () {
            $scope.showVariables=!$scope.showVariables;
            $scope.isActive1 = !$scope.isActive1;
        };
		
		/** Function for changing the drop down list */
        $scope.changeSample = function(){
            type=$scope.select_sample;
            selected_sample= $scope.select_sample;
            samplechangeOption($scope); /** Function defined in experiment.js file */
        }
		/** Function for changing the drop down list */
        $scope.test_ChangeOptionFn = function(){
            type=$scope.selected_Test;
            selected_Test= $scope.selected_Test;
            test_ChangeOption($scope); /** Function defined in experiment.js file */
        } 		
        /** Change event function of Diameter slider */
        $scope.diameterSlider = function() {
            diameterSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of Thickness slider */
        $scope.thicknessSlider = function() {
            thicknessSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of Chamber temperature slider */
        $scope.temperatureSlider = function() {
            temperatureSliderFN($scope); /** Function defined in experiment.js file */
        }
        /** Change event function of the check box Show cross section */
        $scope.showCrossSection = function() {
            showCrossSectionFN($scope);
        }
        
        /** Click event function of reset button */
        $scope.resetBtn = function() {
            resetExperiment(); /** Function defined in experiment.js file */
        }
		/** Enabling the aspirate button */
		$scope.enable_aspirateFN=function(){
			scope.aspirate_disable=false; /** It disables the button 'Aspirate' */ 
		}
			/** Function for aspirate button click  */
		$scope.aspirateSampleFN=function(){
			aspirateSample();/** Function defined in experiment.js file */
		}
			/** Function for start test button click  */
		$scope.start_testFN=function(){
			start_test();/** Function defined in experiment.js file */
		}
		
		
		
        /**
        * First hide the bottom sheet IF visible, then
        * hide or Show the 'left' sideNav area
        */
        function toggleUsersList() {
            $mdSidenav('right').toggle();
        }
    }
})();
