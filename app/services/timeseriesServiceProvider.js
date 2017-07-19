 /**
         * Class that makes the actual calls to the IoT platform's WebAPI to retrieve time series data for a device.
         *
         * The RESTful call makes a request to:  <WEB_URL>/api/v1/devices/{id}/timeseries
         * WEB_URL is an application constant that points to the base url of the WebAPI. id is the UUID that represents your device.
         * The start and end date and the channel are passed as parameters to the call.
         *
         * The typical response from the WebAPI takes the form:
         *          {
         *               time :  '2345456565',
         *               value : '2'
         *          }
 **/
var module = angular.module("IoTApp");
 /* Register this service with Angular Module*/
module.service('timeseriesService' ,['$http','APP_CONSTANT',  '$q',

function($http,APP_CONSTANT,$q){

    this.getTimeSeriesData = function(start,end,tag,token){
          var timeseries_data = [];
            var service_url = APP_CONSTANT.WEB_URL;
            var id = APP_CONSTANT.DEVICE_UUID;
            var url = service_url + "/api/v1/devices/" + id + "/timeseries";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                params: {
                    tag_trait_list: tag,
                    start: start,
                    end: end
                },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            }).then(function(response) {
                    if (response.data.results !== undefined) {
                        //Valid response
                        var result = response.data.results[0];
                        for (var i = 0; i < result.values.length; i++) {
                            var _t = result.values[i].t;
                            if (_t !== undefined && parseInt(_t) !== 0) {
                                var newDate = new Date(0);
                                newDate.setUTCSeconds(_t);
                                _t = newDate;
                            }
                            var _v = result.values[i].v
                            if (_v !== undefined && !isNaN(parseFloat(_v)))
                                _v = parseFloat(_v).toFixed(3);
                            timeseries_data.push({
                                time: _t,
                                value: _v
                            });
                        }
                    }
                    defer.resolve(timeseries_data);

                },
                function(error) {
                    //Invalid response
                    var message = "ERROR_CONNECTION  :  " + service_url;
                    if(error.status === 500){
                        message = "Error while retreiving TimeSeries Data";
                    }else if(error.status === 400){
                        message = "Bad Request input";
                    }else if(error.status === 401){
                        message = error.statusText;
                    }else {
                        message = error.statusText;
                    }
                    defer.reject(message);
                });
            return defer.promise;

    }

return{
    getTimeSeriesData : this.getTimeSeriesData
}

}]);