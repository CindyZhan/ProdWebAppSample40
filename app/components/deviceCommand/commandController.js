'use strict';
var IoTApp;
(function (IoTApp) {
    var controllers;
    (function (controllers) {
        /**
         * Class to send commands to a device.
         *
         * The methods in this class make calls to the deviceCommandServiceProvider which then calls the
         * IoT Platform's WebAPI to send the device commands.
         *
         **/
        var CommandController = (function () {
            /**
             * Constructor initializes the services and variables.
             **/
            function CommandController($interval, realtimeService, commandService, adalService, appConstant) {
                var _this = this;
                this.$interval = $interval;
                this.drawIndicator = function () {
                    var canvas = document.getElementById('circleIndicator');
                    var context = canvas.getContext('2d');
                    var centerX = canvas.width / 7;
                    var centerY = canvas.height / 2;
                    var radius = 25;
                    context.beginPath();
                    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
					if (_this.command == '0') {
						context.fillStyle = 'black';
					} else if (_this.command == '1') {
						context.fillStyle = 'red';
					} else if (_this.command == '2') {
						context.fillStyle = 'green';
					} else if (_this.command == '3') {
						context.fillStyle = 'yellow';
					} else if (_this.command == '4') {
						context.fillStyle = 'blue';
					} else if (_this.command == '5') {
						context.fillStyle = 'magenta';
					} else if (_this.command == '6') {
						context.fillStyle = 'cyan';
					} else if (_this.command == '7') {
						context.fillStyle = 'white';
					}
                    context.fill();
                    context.lineWidth = 2;
                    context.strokeStyle = '#003300';
                    context.stroke();
                };
				/**
                 * Function to read the realtime data using the IoT Platform's WebAPI.
                 **/
                this.getLEDColor = function () {
                    try {
                        // Only call the REST API Service to retrieve the real time data if the user is authenticated.
                        if (_this._isAuthenticated()) {
							// Retrieve the current value of the LED from channel 12866
                            _this.realtimeService.getRealtimeData([_this.appConstant.COMMAND_CHANNEL], _this.realtimeCallback);
                        }
                    }
                    catch (e) {
                        _this.errorMsgRealtime = e.message;
                    }
                };
				this.realtimeCallback = function (data, errorMsg) {
					if(data.length > 0)
					_this.command = data[0].value;
					_this.drawIndicator();
					document.getElementById('colorDropdown').value = data[0].value;

                    _this.errorMsgRealtime = errorMsg;
                };
				/**
				 * Function to send the command that sets the LED color.
				 **/
                this.sendCommand = function (commandType) {
                    _this.tag = _this.appConstant.COMMAND_CHANNEL;
                    if (commandType == 'NUMBER') {
                        _this.command = _this.selectedNumber;
                        _this.sendDeviceCommand();
                    }
                };
                /**
                 * Function called send command is called.
                 *
                 * Sends a command to device by calling the WebAPI. Throws an error if the user is not authenticated.
                 **/
                this.sendDeviceCommand = function () {
                    try {
                        if (!_this._isAuthenticated()) {
                            _this.errorMsg = "User is not authenticated. Please Login ";
                            throw Error(_this.errorMsg);
                        }
                        _this.successMessage = "";
                        _this.commandService.sendCommand(_this.appConstant.DEVICE_UUID, _this.tag, _this.command, _this._deviceCommandCallback);
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                };
                /**
                 * Callback function that is called when the device's command has been sent to WebAPI.
                 *
                 * @param data: contains a response object.
                 * @param errorMsg: contains an error message if an error occured while retrieving data.
                 **/
                this._deviceCommandCallback = function (data, errorMsg) {
                    _this.errorMsg = errorMsg;
					_this.drawIndicator();
                    if (errorMsg == "") {
                        _this.successMessage = "Command sent successfully to Device.";
                    }
                };
                /**
                 * Utility function that returns true if the user is authenticated and false otherwise.
                 **/
                this._isAuthenticated = function () {
                    return _this.adalService.userInfo.isAuthenticated;
                };
                this._disableOnAuthentication = function () {
                    if (_this.adalService.userInfo.isAuthenticated)
                        return false;
                    _this.errorMsg = 'User is not Authenticated. Please Login';
                    return true;
                };
                this.realtimeService = realtimeService;
                this.commandService = commandService;
                this.adalService = adalService;
                this.appConstant = appConstant;
                this.errorMsg = '';
                this.errorMsgCommand = '';
                this.tag = "";
				this.selectedNumber = 1;
                this.command = "0";
                this.drawIndicator();
				this.getLEDColor();
                this._disableOnAuthentication();
            }
            CommandController.$inject = ['$interval', 'IoTApp.Services.RealtimeServiceProvider', 'IoTApp.Services.CommandServiceProvider', 'adalAuthenticationService', 'APP_CONSTANT'];
            return CommandController;
        })();
        controllers.CommandController = CommandController;
        angular.module("IoTApp").controller("IoTApp.controllers.CommandController", ['$interval', 'IoTApp.Services.RealtimeServiceProvider', 'IoTApp.Services.CommandServiceProvider', 'adalAuthenticationService', 'APP_CONSTANT', CommandController]);
    })(controllers = IoTApp.controllers || (IoTApp.controllers = {}));
})(IoTApp || (IoTApp = {}));
//# sourceMappingURL=commandController.js.map