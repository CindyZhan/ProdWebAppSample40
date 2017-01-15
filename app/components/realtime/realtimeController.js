'use strict';
var IoTApp;
(function (IoTApp) {
    var controllers;
    (function (controllers) {
        /**
         * Class to display a device's metadata (device model, name, etc.) and realtime values for the device.
         *
         * The methods in this class make calls to the realtimeServiceProvider which then calls the
         * IoT Platform's WebAPI to retrive the realtime data. This code also makes calls to the deviceService and
         * channelService to retrieve the device meta data and channels with the WebAPI.
         **/
        var RealtimeController = (function () {
            /**
             * Constructor initializes the services and variables.
             **/
            function RealtimeController($interval, realtimeService, deviceService, channelService, adalService, appConstant) {
                var _this = this;
                this.$interval = $interval;
                this.sliderOptions = [];
                /**
                 * Function to populate the list of meta channels with the channels from the application configuration. This is the list
                 * of channels that the sample application will retrieve data for.
                 *
                 * By default this code uses the list of channels from app.module.ts (see app.constant CHANNEL_META for the list).
                 *
                 * You can choose to uncomment the block of code below to retrieve data for all of the channels associated with your
                 * device instead of the pre-defined list of channels.
                 **/
                this._getChannelMeta = function () {
                    var channelMetaInstance = IoTApp.ChannelMetaInstance.getInstance();
                    if (channelMetaInstance.length() == 0)
                        channelMetaInstance.setChannelMeta(_this.appConstant.CHANNEL_META);
                    /**
                     * Uncomment this code to get all of the channels from your device. This calls the IoT Platform's WebAPI
                     * to retrieve the list of channels supported by your device.
                     **/
                    /***
                    try {
                          // _isAuthenticated returns true if the user is authenticated to access the Get Device Channel REST API Service and false otherwise
                          // The Service code can be found in channelServiceProvider.js
                          if (this._isAuthenticated())
                          this.channelService.getChannelMeta(this._channelCallback);
                      } catch (e) {
                          console.log(e.message);
                       }
                    ***/
                };
                /**
                 * Function to read the realtime data using the IoT Platform's WebAPI.
                 **/
                this.getRealtimeData = function () {
                    try {
                        // Only call the REST API Service to retrieve the real time data if the user is authenticated.
                        if (_this._isAuthenticated()) {
                            // this.tags will be not be populated until getRealtimeData has been called once. 
                            if (_this.tags.length !== 0)
                                // Retrieve the realTime data using the WebAPI. This is called asynchronously and 
                                // _realtimeCallback is called with the results and/or an error message.
                                _this.realtimeService.getRealtimeData(_this.tags, _this._realtimeCallback);
                            else
                                // This is the first call to retrieve realtime data. Mimic a synchronous call
                                // to safely populate the tags variable with the channels that we are requesting.
                                setTimeout(_this._syncData, _this.appConstant.SYNC_DELAY);
                        }
                    }
                    catch (e) {
                        _this.errorMsgRealtime = e.message;
                    }
                };
                /**
                 * Function to retrieve the realtime data using the WebAPI synchronously.
                 **/
                this._syncData = function () {
                    _this.tags = IoTApp.ChannelMetaInstance.getInstance().getTags();
                    if (_this.tags.length === 0) {
                        _this.errorMsg = "Channels are not available ";
                        throw Error(_this.errorMsg);
                    }
                    _this.realtimeService.getRealtimeData(_this.tags, _this._realtimeCallback);
                };
                /**
                 * Function called when page first opens.
                 *
                 * Retrieve the device's metadata (Model name, name, etc.) by calling the WebAPI. Throws an error if the user is not authenticated.
                 **/
                this.getDeviceMeta = function () {
                    try {
                        if (!_this._isAuthenticated()) {
                            _this.errorMsg = "User is not authenticated. Please Login ";
                            throw Error(_this.errorMsg);
                        }
                        _this.deviceService.getDeviceMeta(_this._deviceCallback);
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                };
                /**
                 * Callback function that is called when realtime data has been received from the WebAPI.
                 *
                 * @param data: contains an array of realtime data objects.
                 * @param errorMsg: contains an error message if an error occured while retrieving data.
                 **/
                this._realtimeCallback = function (data, errorMsg) {
                    _this.realData = data;
                    _this._replaceTagValues(_this.realData);
                    _this.errorMsgRealtime = errorMsg;
                };
                /**
                 * Callback function that is called when the device's metadata has been received from the WebAPI.
                 *
                 * @param data: contains a device metadata object.
                 * @param errorMsg: contains an error message if an error occured while retrieving data.
                 **/
                this._deviceCallback = function (data, errorMsg) {
                    _this.deviceMeta = data;
                    _this.errorMsg = errorMsg;
                };
                /**
                 * Callback function that is called when the device's channel list has been received from the WebAPI.
                 *
                 * @param data: contains a device's channel list.
                 * @param errorMsg: contains an error message if an error occured while retrieving data.
                 **/
                this._channelCallback = function (data, errorMsg) {
                    // IoTApp.ChannelMetaInstance.getInstance() returns a pointer to the variable that holds the channel metadata.
                    // "data" is the JSON response that contains your retrieved channel list and metadata.
                    // To debug or inspect your retrieved data, look at the "data" parameter that gets passed to this function. 
                    // A console error log message will be displayed if an error is returned from the REST API service.
                    var channelMetaInstance = IoTApp.ChannelMetaInstance.getInstance();
                    channelMetaInstance.setChannelMeta(data);
                    console.log(errorMsg);
                };
                /**
                 * Function to set the data refresh to based on the interval from the application configuration. This function sets the Angular $interval to call
                 * getRealtimeData. By default the refresh value is set to 2 seconds (2000 ms). This value can be updated in app.module.ts.
                 **/
                this._pageRefresh = function () {
                    _this._isAuthenticated ? _this.$interval(_this.getRealtimeData, _this.appConstant.REAL_TIME_REFRESH) : _this;
                };
                /**
                 * Function to dynamically replace the channel number with the corresponding channel name.
                 * This is a convenience function to make the channels more readable for the user.
                 **/
                this._replaceTagValues = function (data) {
                    var channelMetaInstance = IoTApp.ChannelMetaInstance.getInstance();
                    var sliderDataIndex = 0;
                    for (var i = 0; i < data.length; i++) {
                        var channelDisplayName = channelMetaInstance.getChannelDisplayName(data[i].tag);
                        if (data[i].tag == _this.appConstant.SLIDER_CHANNEL_TAG) {
                            _this.sliderData = data[i];
                            sliderDataIndex = i;
                            _this.sliderOptions.value = data[i].value;
                        }
                        data[i].tag = channelDisplayName;
                    }
                    // remove slider data so that this is not displaye in channel list
                    data.splice(sliderDataIndex, 1);
                };
                /**
                 * Utility function that returns true if the user is authenticated and false otherwise.
                 **/
                this._isAuthenticated = function () {
                    return _this.adalService.userInfo.isAuthenticated;
                };
                this.realtimeService = realtimeService;
                this.deviceService = deviceService;
                this.adalService = adalService;
                this.channelService = channelService;
                this.appConstant = appConstant;
                this.tags = [];
                this.errorMsg = '';
                this.errorMsgRealtime = '';
                this.sliderOptions = {
                    value: 0,
                    options: {
                        floor: 0,
                        ceil: 100,
                        step: 0.001,
                        precision: 3,
                        draggableRange: true,
                        showSelectionBar: false,
                        hideLimitLabels: true,
                        readOnly: true,
                        disabled: false,
                        showTicks: false,
                        showTicksValues: false,
                        hidePointerLabels: true
                    }
                };
                this._getChannelMeta();
                this._pageRefresh();
            }
            RealtimeController.$inject = ['$interval', 'IoTApp.Services.RealtimeServiceProvider',
                'IoTApp.Services.DeviceServiceProvider', 'IoTApp.Services.ChannelServiceProvider', 'adalAuthenticationService', 'APP_CONSTANT'];
            return RealtimeController;
        }());
        controllers.RealtimeController = RealtimeController;
        angular.module("IoTApp").controller("IoTApp.controllers.RealtimeController", ['$interval', 'IoTApp.Services.RealtimeServiceProvider', 'IoTApp.Services.DeviceServiceProvider', 'IoTApp.Services.ChannelServiceProvider', 'adalAuthenticationService', 'APP_CONSTANT', RealtimeController]);
    })(controllers = IoTApp.controllers || (IoTApp.controllers = {}));
})(IoTApp || (IoTApp = {}));
