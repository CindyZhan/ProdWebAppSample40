var module = angular.module("IoTApp");
module.controller('RealtimeController',['loginService','$scope','deviceService','channelService','realtimeService','$interval','APP_CONSTANT','channelMetaInstance',realtimeController]);

function realtimeController(authService,$scope,deviceService,channelService,realtimeService,$interval,APP_CONSTANT,channelMetaInstance){
        var realtimeController = this;
       
        /*
            This function will be called on start up.
        */
        this.init = function() {
            //On load screen logic   
            this.activeTab();
           var isAuthenticated =  authService.isAuthenticated();
           $scope.sliderOptions = {
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
            if(isAuthenticated) { 
                this.getDeviceMeta();
                this.getChannels();
                $scope.username = authService.getUserName();
                this.refreshRealtimeData();
        }

        };

         /*
            To logout from current session
        */

        this.logout = function(){
	        authService.logout();	
	    };

         /*
            Display Device Meta information
        */

       this.getDeviceMeta = function(){
            var token = authService.getToken();
            deviceService.getDeviceMeta(token).then(function(device){
                $scope.deviceMeta = device;
                $scope.$applyAsync();
            },function(error){
                realtimeController.displayError(error);
            }
            );
        };

         /*
            Display RealTime data
        */


        this.getRealTimeData = function(){
          var token = authService.getToken();
          var channels = channelMetaInstance.getChannels();
          if(channels != undefined && channels.length>0){
          var tags = channelMetaInstance.getTags();
          if(tags != undefined && tags.length > 0){
          realtimeService.getRealTimeData(tags,token).then(function(realtime){
               $scope.realtimeData = realtimeController._replaceTagValues(realtime);
                 $scope.$applyAsync();
            }
            ,function(error){
                realtimeController.displayRealtimeError(error); 
                $scope.$applyAsync();
            });
          }
          }
        };

        /*
            Refersh RealTime data every 5 seconds
        */
        this.refreshRealtimeData = function(){
            $scope.timer = $interval(this.getRealTimeData,APP_CONSTANT.REAL_TIME_REFRESH)
             // To stop timer , once user move to another page.
                    $scope.$on("$destroy", function() {
                        if (angular.isDefined($scope.timer) ) {
                         $interval.cancel($scope.timer);
                    }
                    });
        }

        /*
           Get devices' channels 
        */

        this.getChannels = function(){
                      var channels = channelMetaInstance.getChannels();
                    /* if ( channels == undefined || channels.length==0)
                        channelMetaInstance.setChannels(APP_CONSTANT.CHANNEL_META);
                    /**
                     * Uncomment this code to get all of the channels from your device. This calls the IoT Platform's WebAPI
                     * to retrieve the list of channels supported by your device.
                     **/
                    
                    try {
                         
                          // The Service code can be found in channelServiceProvider.js
                          var token = authService.getToken();
                          channelService.invokeChannelService(token).then(function(channels){
                             channelMetaInstance.setChannels(channels);
                             realtimeController.getRealTimeData();
                          },function(error){
                             realtimeController.displayError(error);
                          });
                      } catch (e) {
                          console.log(e.message);
                       }
        }

                /**
                 * Function to dynamically replace the channel number with the corresponding channel name.
                 * This is a convenience function to make the channels more readable for the user.
                 **/
                this._replaceTagValues = function (data) {
                    
                    var sliderDataIndex = 0;
                    for (var i = 0; i < data.length; i++) {
                        var channelDisplayName = channelMetaInstance.getChannelDisplayName(data[i].tag);
                        if (data[i].tag == APP_CONSTANT.SLIDER_CHANNEL_TAG) {
                            $scope.sliderData = data[i];
                            sliderDataIndex = i;
                            $scope.sliderOptions.value = data[i].value;
                        }
                        data[i].tag = channelDisplayName;
                    }
                    // remove slider data so that this is not displaye in channel list
                    data.splice(sliderDataIndex, 1);
                    return data;
                };

                this.activeTab = function(pagename){
                    if(pagename === 'realtime'){
                        return "active-tab";
                    }
                };
          /**
         * @function displayRealtimeError
         * @param message
         */
        this.displayRealtimeError = function(message) {
            if(message.length>0){
            $scope.realtimeMessage = message;
            $scope.hasrealtimeError = true;
            }else{
            $scope.hasrealtimeError = false;
            }
        };

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