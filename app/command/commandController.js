var module = angular.module("IoTApp");
module.controller('CommandController',['loginService','$scope','APP_CONSTANT','commandService',commandController]);

function commandController(authService,$scope,APP_CONSTANT,commandService){

        var commandController = this;

           this.init = function(){
                var isAuthenticated =  authService.isAuthenticated();
                commandController.activeTab();
                if(isAuthenticated){
                        $scope.numbers = ['2', '3', '4', '5', '6', '7', '8'];
                        $scope.selectedNumber = '2';        
                        commandController.drawIndicator('blue');
                         $scope.username = authService.getUserName();
                }
           }


           this.drawIndicator = function (color) {
                    var canvas = document.getElementById('circleIndicator');
                    var context = canvas.getContext('2d');
                    var centerX = canvas.width / 7;
                    var centerY = canvas.height / 2;
                    var radius = 25;
                    context.beginPath();
                    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                    context.fillStyle = color;
                    context.fill();
                    context.lineWidth = 2;
                    context.strokeStyle = '#003300';
                    context.stroke();
                    $scope.$applyAsync();
                    
                };
                this.sendCommand = function (commandType) {
                    var tag = APP_CONSTANT.COMMAND_CHANNEL;
                    commandController.displayMessage('');
                    commandController.drawIndicator('blue');
                    if (commandType == 'LED') {
                        //call service to send command;
                       var  command = "1";
                        commandController.sendDeviceCommand(tag,command);
                    }
                    else if (commandType == 'NUMBER') {
                       var command = $scope.selectedNumber.toString();
                        commandController.sendDeviceCommand(tag,command);
                    }
                };

                 /**
                 * Function called send command is called.
                 *
                 * Sends a command to device by calling the WebAPI. Throws an error if the user is not authenticated.
                 **/
                this.sendDeviceCommand = function (tag,command) {
                   
                      var token = authService.getToken();
                       commandService.sendCommand(APP_CONSTANT.DEVICE_UUID, tag,command,token).then(
                           function(response){
                              commandController.displayMessage('Command Sent Successfully');
                                if (command == "1") 
                                    commandController.drawIndicator('green'); 
                              
                        
                           },function(error){
                                if (command == "1") 
                                    commandController.drawIndicator('red');
                                commandController.displayError(error);
                              
                           });
                   
                };
                
        /**
         * @function displayError
         * @param message
         */
        this.displayError = function(message) {
            if(message.length>0){
            $scope.errorMsg = message;
            $scope.hasError = true;
            $scope.$applyAsync();
            }else{
            $scope.hasError = false;
            $scope.$applyAsync();
            }
        };

        this.displayMessage = function(message){
            $scope.message = message;
            $scope.$applyAsync();
        };

          /*
            To logout from current session
        */

        this.logout = function(){
	        authService.logout();	
	    };

      this.activeTab = function(pagename){
         if(pagename === 'command'){
               return "active-tab";
              }
    };

}