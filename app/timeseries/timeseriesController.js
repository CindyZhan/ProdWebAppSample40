var module = angular.module("IoTApp");
module.controller('TimeSeriesController',['loginService','$scope','timeseriesService','APP_CONSTANT','channelMetaInstance',timeseriesController]);

function timeseriesController(authService,$scope,timeseriesService,APP_CONSTANT,channelMetaInstance){

    var timeseriesController = this;

        this.init = function(){
           
              this.activeTab();
            var isAuthenticated = authService.isAuthenticated();
            if(!isAuthenticated){
                timeseriesController.displayError('User is not authenticated');
                return;
            }
                this._setDefaultStartDate();
	        	$scope.username = authService.getUserName();
                this._setDefaultEndDate();
                this._setDefaultChannels();
             
        };

	this.logout = function(){
	authService.logout();
		
	};


     /**
                 * Function to populate the channel list
                 * Note that in our sample application you must navigate to the realtime data page to populate the channel list
                 * before navigating to the time series page. This should always be this case since the realtime page is the default page
                 * for the application.
                 **/
                this._setDefaultChannels = function () {
		    var channel = channelMetaInstance.getChannels();
		    if ( channel == undefined || channel.length ==0){
                         
			timeseriesController.displayError('Load Realtime page first to initialize channels');

		    }
                    $scope.channels = channelMetaInstance.getDisplayNameList();
                    $scope.channelMeta = $scope.channels[0];
                    
                };
		    
                 /**
                 * Function to set the default start date. Default value is two days prior to the current date.
                 **/
                this._setDefaultStartDate = function () {
                    var datenew = new Date();
                    datenew.setDate(datenew.getDate() - 2);
                    datenew.setHours(0, 0, 0, 0);
                    $scope.startDate = datenew.toLocaleString().replace(',', '').replace(/[^ -~]/g,'');
                };
				
                /**
                 * Function to set the default end date. Default value is 11:59:59 of the current date.
                 **/
                this._setDefaultEndDate = function () {
                    var datenew = new Date();
                    datenew.setHours(23, 59, 59);
                    $scope.endDate   = datenew.toLocaleString().replace(',', '').replace(/[^ -~]/g,'');
					
                };
				
                /**
                 * Function to read the time series data using the IoT Platform's WebAPI.
                 **/
                this.getTimeSeriesData = function() {
                    try {
                        timeseriesController.displayError('');
			            $scope.timeseriesData = [];
                        var utcStartDate = timeseriesController._processDate($scope.startDate);
                        var utcEndDate = timeseriesController._processDate($scope.endDate);
                        var tag = timeseriesController._processChannelData($scope.channelMeta);
                        var token = authService.getToken();
                        var trait = timeseriesController._getChannelTrait($scope.channelMeta)
                        var tag_trait = tag+trait;
                        timeseriesService.getTimeSeriesData(utcStartDate, utcEndDate, tag_trait, token).then(function(data){
			                data.sort(function(a,b) {return (a.time > b.time) ? -1 : ((b.time > a.time) ? 1 : 0); } );
                            $scope.timeseriesData = data;
                            $scope.$applyAsync();
                        },
                        function(error){
			                timeseriesController.displayError(error);
                        });
                    }
                    catch (e) {
                         timeseriesController.displayError(e.message);
                    }
                };
				
                /**
                 * Callback function that is called when realtime data has been received from the WebAPI.
                 *
                 * @param data: contains an array of time series data objects.
                 * @param errorMsg: contains an error message if an error occured while retrieving data.
                 **/
                this._getTimeSeriesCallback = function (data, errorMsg) {
					
                   
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
                    if (channelDisplayName == undefined)
                        return channelMetaInstance.getTag($scope.channels[0]);
                    _channel = channelMetaInstance.getTag(channelDisplayName);
                    return _channel;
                };
                /**
                 * Function to return the display name for a channel given its tagname.
                 **/
                this._getChannelDisplayName = function (tagName) {
                    return channelInstance.getChannelDisplayName(tagName);
                };
				
               
                /**
                 * Function to disable the 'Refresh' button if the user is not authenticated
                 **/
                this._disableOnAuthentication = function () {
                    if(authService.isAuthenticated()){
                        return false;
                    }
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

                 this.activeTab = function(pagename){
                    if(pagename === 'timeseries'){
                        return 'active-tab';
                    }
                }
                
         /**
         * @function displayError
         * @param message
         */
        this.displayError = function(message) {
            if(message.length>0){
            $scope.errorMsg = message;
            $scope.hasError = true;
            }else{
            $scope.hasError = false;
            }
        };
}