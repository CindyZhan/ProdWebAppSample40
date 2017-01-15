var IoTApp;
(function (IoTApp) {
    /**
     *   Class to store a list of channels.
     *
     *   This class is used by both realtime and time series pages to determine
     *   which channels are available for the given device.
     *
     *   The channel list is populated during the first call to get real time data and
     *   will return an empty list unless this page has been opened.
     *
     *   TO DO : replace channelMeta with Dictionary
     **/
    var ChannelMetaInstance = (function () {
        function ChannelMetaInstance() {
            var _this = this;
            this.getChannelMeta = function () {
                return _this.channelMeta;
            };
            /**
             * Function to store the channelMeta array
             **/
            this.setChannelMeta = function (channelMeta) {
                _this.channelMeta = {};
                for (var channel in channelMeta) {
                    _this.channelMeta[channel] = channelMeta[channel];
                }
            };
            /**
             * Function to return the number of channels
             **/
            this.length = function () {
                var count = 0;
                for (var _channel in _this.channelMeta) {
                    count++;
                }
                return count;
            };
            /**
             * Function to return a list of all tag values present.
             **/
            this.getTags = function () {
                var tags = [];
                for (var tag in _this.channelMeta) {
                    tags.push(tag);
                }
                return tags;
            };
            /**
             * Function to return the Channel's display name based on its tag name.
             **/
            this.getChannelDisplayName = function (tag) {
                return _this.channelMeta[tag];
            };
            /**
             * Function to return a list of channel Display names.
             **/
            this.getDisplayNameList = function () {
                var displayNames = [];
                for (var _channel in _this.channelMeta) {
                    displayNames.push(_this.channelMeta[_channel]);
                }
                return displayNames;
            };
            /**
             * Function to get a channel's tag name based on its display name.
             **/
            this.getTagName = function (channelDisplayName) {
                var tag;
                for (var _d in _this.channelMeta) {
                    if (_this.channelMeta[_d] == channelDisplayName)
                        tag = _d;
                }
                return tag;
            };
            this.channelMeta = {};
        }
        // Singleton instance of ChannelMetaInstance
        ChannelMetaInstance.getInstance = function () {
            if (ChannelMetaInstance._channelMetaInstance == undefined)
                ChannelMetaInstance._channelMetaInstance = new ChannelMetaInstance();
            return ChannelMetaInstance._channelMetaInstance;
        };
        return ChannelMetaInstance;
    }());
    IoTApp.ChannelMetaInstance = ChannelMetaInstance;
})(IoTApp || (IoTApp = {}));