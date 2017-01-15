/**
 * Function to dynamically format UTC date/times to use AM/PM
 **/
(function () {
    angular.module("IoTApp").filter('ampmtime', function () {
        return function (value) {
            if (!value) {
                return '';
            }
            var date = new Date(0);
            date.setUTCSeconds(value);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            var seconds = date.getSeconds();
            hours = hours % 12;
            hours = hours ? hours : 12;
            var minuteString = minutes < 10 ? '0' + minutes : minutes.toString();
            var secondString = seconds < 10 ? '0' + seconds : seconds.toString();
            var dayString = day < 10 ? '0' + day : day.toString();
            var monthString = month < 10 ? '0' + month : month.toString();
            var hourString = hours < 10 ? '0' + hours : hours.toString();
            var strTime = year + "-" + monthString + "-" + dayString + " " + hourString + ":" + minuteString + ":" + secondString + " " + ampm;
            return strTime;
        };
    });
});
