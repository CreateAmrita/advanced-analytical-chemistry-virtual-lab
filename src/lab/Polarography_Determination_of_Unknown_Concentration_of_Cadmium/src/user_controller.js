(function(){
    angular
    .module('users',['FBAngular','ui.bootstrap','dialogs.main','pascalprecht.translate'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate','$translate','dialogs',
        UserController
    ])
    .config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){
        dialogsProvider.useBackdrop('static');
        dialogsProvider.useEscClose(false);
        dialogsProvider.useCopy(false);
        dialogsProvider.setSize('sm');
        $translateProvider.translations(language,{DIALOGS_ERROR:(_("Error")),DIALOGS_ERROR_MSG:(_("Set the initial mV less than or equal to -300 and final mV less than or equal to -608")),DIALOGS_CLOSE:(_("Okay"))}),$translateProvider.preferredLanguage(language);
    }]);
	   
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q, $scope, $element, Fullscreen, $mdToast, $animate, $translate, dialogs) {
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
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(help_array[1])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple()
            .content(help_array[2])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(help_array[3])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast4 = $mdToast.simple()
            .content(help_array[4])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast5 = $mdToast.simple()
            .content(help_array[5])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());

            var toast6 = $mdToast.simple()
            .content(help_array[6])
            .action(help_array[8])
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

        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = true;
        $scope.isActive1 = true; 

        $scope.hide_show_result = true; /** It hides the result value */ 
        $scope.control_disable = false;
        $scope.concentration_disable = false;
        $scope.graph_disable = true;
        $scope.reset_disable = true;
        
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

        /** Function for changing the drop down list Concentration */
        $scope.changeConcentration = function() {
            type=$scope.Enviornment;	
            concentrationEvent($scope); /** Function defined in experiment.js file */
        }

        /** Function for the button Load Cadmium Sample */
        $scope.loadCadmium = function() {
            loadCadmiumEvent($scope); /** Function defined in experiment.js file */
        }

        /** The keyup function for all events for validate the Initial mV and Final mV input boxes */
        $scope.inputValidationOnKeyUp = function() {
            inputValidation($scope, dialogs); /** Function defined in experiment.js file */
        }

        /** Function for changing the drop down list Scan Analysis */
        $scope.changeScanAnalysis = function() {
            scanAnalysisChange($scope); /** Function defined in experiment.js file */
        }

        /** Function for the button Plot Graph */
        $scope.plotGraph = function() {
            plotGraphEvent($scope); /** Function defined in experiment.js file */
        }

        /** Function for the button reset */
        $scope.reset = function() {
            resetExperiment(); /** Function defined in experiment.js file */
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