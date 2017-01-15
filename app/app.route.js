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
                controller: "IoTApp.controllers.RealtimeController",
                templateUrl: "./app/components/realtime/realtimeView.html",
                controllerAs: "realtime"
            }).when("/timeseries", {
                controller: "IoTApp.controllers.TimeSeriesController",
                templateUrl: "./app/components/timeseries/timeseriesView.html",
                controllerAs: "timeseries"
            }).when("/deviceCommand",
			{
				controller: "IoTApp.controllers.CommandController",
				templateUrl: "app/components/deviceCommand/CommandView.html",
				controllerAs: "command"
			});
            /**
             * Default to the realtime page by default.
             **/
            $routeProvider.otherwise({ redirectTo: "/realtime" });
        };
        Routes.$inject = ["$routeProvider"];
        return Routes;
    }());
    IoTApp.Routes = Routes;
})(IoTApp || (IoTApp = {}));
