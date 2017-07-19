'use strict';
var IoTApp;
(function (IoTApp) {
    var Routes = (function () {
        function Routes() {
        }
        Routes.configureRoutes = function ($routeProvider) {
            /**
             * Provider to direct user to correct HTML and JS code based on their URL extension
             **/
            $routeProvider.when("/realtime", {
                controller: "RealtimeController",
                templateUrl: "./app/realtime/realtimeTemplate.html",
                controllerAs: "realtime"
            }).when("/timeseries", {
                controller: "TimeSeriesController",
                templateUrl: "./app/timeseries/timeseriesTemplate.html",
                controllerAs: "timeseries"
            }).when("/login",{
                 controller: "Login",
                templateUrl: "./app/login/loginTemplate.html",
                controllerAs: "login"
            }).when("/command",{
                 controller: "CommandController",
                templateUrl: "./app/command/commandTemplate.html",
                controllerAs: "command"
            });
            /**
             * Default to the realtime page by default.
             **/
            $routeProvider.otherwise({ redirectTo: "/login" });
        };
        Routes.$inject = ["$routeProvider"];
        return Routes;
    }());
    IoTApp.Routes = Routes;
})(IoTApp || (IoTApp = {}));
