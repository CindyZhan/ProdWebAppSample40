var IoTApp;
(function (IoTApp) {
    var controllers;
    (function (controllers) {
        /**
         * Class to display a device's time series data.
         *
         * The top 10 values from the selected channels are displayed.
         * The methods in this class make calls to the timeseriesServiceProvider which then calls the
         * IoT Platform's WebAPI to retrive the time series data.
         **/
        var TimeSeriesController = (function () {
			
            /**
             * Constructor initializes the services and variables.
             **/
            function TimeSeriesController(TimeSeriesService, constants, adalService) {
                var _this = this;
				
                /**
                 * Function to populate the channel list
                 * Note that in our sample application you must navigate to the realtime data page to populate the channel list
                 * before navigating to the time series page. This should always be this case since the realtime page is the default page
                 * for the application.
                 **/
                this._setDefaultChannels = function () {
                    _this.channels = IoTApp.ChannelMetaInstance.getInstance().getDisplayNameList();
                    if (_this.channels.length == 0)
                        _this.errorMsg = "Load Realtime page first , channels are not available";
                };
				
                /**
                 * Function to set the default start date. Default value is two days prior to the current date.
                 **/
                this._setDefaultStartDate = function () {
                    var datenew = new Date();
                    datenew.setDate(datenew.getDate() - 2);
                    datenew.setHours(0, 0, 0, 0);
                    _this.startDate = datenew.toLocaleString().replace(',', '').replace(/[^ -~]/g,'');
                };
				
                /**
                 * Function to set the default end date. Default value is 11:59:59 of the current date.
                 **/
                this._setDefaultEndDate = function () {
                    var datenew = new Date();
                    datenew.setHours(23, 59, 59);
                    _this.endDate   = datenew.toLocaleString().replace(',', '').replace(/[^ -~]/g,'');
					
                };
				
                /**
                 * Function to read the time series data using the IoT Platform's WebAPI.
                 **/
                this.getTimeSeriesData = function () {
                    try {
                        _this._clearAllData();
                        var utcStartDate = _this._processDate(_this.startDate);
                        var utcEndDate = _this._processDate(_this.endDate);
                        var tag = _this._processChannelData(_this.channelMeta);
                        _this.timeseriesService.getTimeSeriesData(utcStartDate, utcEndDate, tag, this._getChannelTrait(_this.channelMeta), _this._getTimeSeriesCallback);
                    }
                    catch (e) {
                        _this.errorMsg = e.message;
                    }
                };
				
                /**
                 * Callback function that is called when realtime data has been received from the WebAPI.
                 *
                 * @param data: contains an array of time series data objects.
                 * @param errorMsg: contains an error message if an error occured while retrieving data.
                 **/
                this._getTimeSeriesCallback = function (data, errorMsg) {
					data.sort(function(a,b) {return (a.time > b.time) ? -1 : ((b.time > a.time) ? 1 : 0); } );
                    for (var i = 0; i < data.length; i++) {
                        data[i].channel = _this._getChannelDisplayName(data[i].channel);
                        _this.timeseriesData.push(data[i]);
                    }
                    _this.errorMsg = errorMsg;
                };
                /**
                 * Function to validate date as a valid UTC date.
                 **/
                this._processDate = function (date) {
                    if (date == undefined)
                        throw new Error('Date is not provided, please enter using this format mm/dd/YYYY HH:mm:ss');
                    var _date;
                    _date = Date.parse(date);
                    if (isNaN(_date))
                        throw new Error('Date Format is not correct, please use this format mm/dd/YYYY HH:mm:ss');
                    var validDate = new Date(_date);
                    return validDate.toUTCString();
                };
				
                /**
                 * Function to retrieve the channels as selected by the user.
                 **/
                this._processChannelData = function (channelDisplayName) {
                    var _channel = "";
                    var channelInstance = IoTApp.ChannelMetaInstance.getInstance();
                    if (channelDisplayName == undefined)
                        return [channelInstance.getTagName(_this.channels[0])];
                    _channel = channelInstance.getTagName(channelDisplayName);
                    return _channel;
                };
                /**
                 * Function to return the display name for a channel given its tagname.
                 **/
                this._getChannelDisplayName = function (tagName) {
                    var channelInstance = IoTApp.ChannelMetaInstance.getInstance();
                    return channelInstance.getChannelDisplayName(tagName);
                };
				
                /**
                 * Function to remove timeseries data and error messages. Resets page for subsequent calls to the WebAPI.
                 **/
                this._clearAllData = function () {
                    _this.timeseriesData.splice(0, _this.timeseriesData.length);
                    _this.errorMsg = "";
                };
				
                /**
                 * Function to disable the 'Refresh' button if the user is not authenticated
                 **/
                this._disableOnAuthentication = function () {
                    if (_this.adalService.userInfo.isAuthenticated)
                        return false;
                    _this.errorMsg = 'User is not Authenticated. Please Login';
                    return true;
                };
				
				/**
				 * Function to return channelName to display in list on TimeSeries page.
				 **/
				this._getChannelName = function (channelName) {
					return channelName + this._getChannelTrait(channelName);
				}
				
				/**
				 * Function to return the trait to use for a given channel. 
				 * All of the channels in this sample are hard-wired to use the avg value except
				 * for Energy Forward Phase A, B & C which return the actual value.
				 **/
				this._getChannelTrait = function (channelName) {
					if (channelName == "Energy Forward Phase A" ||
					    channelName == "Energy Forward Phase B" ||
						channelName == "Energy Forward Phase C") 
						return ".v";
					else
						return ".avg";
				}
                this.timeseriesService = TimeSeriesService;
                this.adalService = adalService;
                this.timeseriesData = new Array();
                this.appConstant = constants;
                this._setDefaultStartDate();
                this._setDefaultEndDate();
                this._setDefaultChannels();
                this._disableOnAuthentication();
            }
            TimeSeriesController.$inject = ["IoTApp.Services.TimeSeriesServiceProvider", "APP_CONSTANT", "adalAuthenticationService"];
            return TimeSeriesController;
        }());
        controllers.TimeSeriesController = TimeSeriesController;
        angular.module("IoTApp").controller("IoTApp.controllers.TimeSeriesController", ['IoTApp.Services.TimeSeriesServiceProvider', 'APP_CONSTANT', 'adalAuthenticationService', TimeSeriesController]);
    })(controllers = IoTApp.controllers || (IoTApp.controllers = {}));
})(IoTApp || (IoTApp = {}));