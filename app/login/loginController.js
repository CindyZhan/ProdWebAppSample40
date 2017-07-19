
var module = angular.module("IoTApp");
module.controller('Login',['loginService','$scope','$location',loginController]);

function loginController(loginService,$scope,$location){
      /**
         * @function init
         */
        $scope.init = function() {
            //On load screen logic
            //Display application on Login Page
            $scope.displayError('');
            $scope.validateCache();

        };

        /**
         * @function validateCache
         */
        $scope.validateCache = function() {
            /*
            If user is logged in, navigate to Device page
             */
            var isValid = loginService.validateToken();
            if (isValid) {
               $location.path('/realtime');
            }
        };

        /**
         * @function login
         */
        $scope.login = function() {
        /*
            Validate username & password
        */
            $scope.displayError('');
            if ($scope.username == undefined || $scope.username.trim().length === 0) {
                $scope.displayError('Provide User Name');
                return;
            }
            if ($scope.password == undefined || $scope.password.trim().length === 0) {
                $scope.displayError('Provide Password');
                return;
            }

            /*
            Save token and create session for user
            */

            loginService.createSession($scope.username, $scope.password).then(function(isAuthenticated) {
                loginService.validateToken();
                $location.path('/realtime');
            }, function(error) {
                var message = 'Provide correct credentials';
                if(error !=='Unauthorized'){
                   message = error
                 }
                 $scope.displayError(message);
            });
        };

        /**
         * @function displayError
         * @param message
         */
        $scope.displayError = function(message) {
            if(message.length>0){
            $scope.loginmessage = message;
            $scope.hasError = true;
            }else{
                $scope.hasError = false;
            }
        };

}
