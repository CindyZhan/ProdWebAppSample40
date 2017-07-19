var module = angular.module("IoTApp");
 /* Register this service with Angular Module*/
module.service('channelMetaInstance' ,['APP_CONSTANT',  '$q',

function(APP_CONSTANT,$q){

    var channelInstance = this;
    var channels = [];
   
    
    this.setChannels = function(channel){
         channelInstance.channels = [];
                for (var i = 0; i < channel.length; i++) {
                    channelInstance.channels.push({
                        tag: channel[i].tag,
                        name: channel[i].lname,
                        enums: channel[i].enums
                    });
                }
    };

    this.getChannels = function(){
	return channelInstance.channels;
	
   };

    this.getTags = function(index){
        if (index === undefined || index === "" || index > channelInstance.length())
                    index = channelInstance.length();
                var tags = [];
                for (var i = 0; i < index; i++) {
                    tags.push(channelInstance.channels[i].tag);
                }
                return tags;
    };
     /*
            No of channels 
            */
            this.length = function() {
                return channelInstance.channels.length;
            };

      /*
            Retreive tag based on channel name
            */
            this.getTag = function(channelDisplayName) {
                var tag;
                for (var i = 0; i < channelInstance.length(); i++) {
                    var _d = channelInstance.channels[i];
                    if (_d.name == channelDisplayName)
                        tag = _d.tag;
                }
                return tag;
            },
            /*
            Get channel name based on channel tag
            */
            this.getChannelDisplayName = function(tag) {
                var name;
                for (var i = 0; i < channelInstance.channels.length; i++) {
                    var _d = channelInstance.channels[i];
                    if (_d.tag == tag)
                        name = _d.name;
                }
                return name;
            },

            /*
            Retreive list of channel names
            */
            this.getDisplayNameList = function(index) {
                if (index === undefined || index === "" || index > channelInstance.channels.length)
                    index = channelInstance.length();
                var displayNames = [];
                for (var i = 0; i < index; i++) {
                    displayNames.push(channelInstance.channels[i].name);
                }
                return displayNames;

            };

 /*
        List of methods available across app
        */
        return {
          
            setChannels: this.setChannels,
            getTags: this.getTags,
            getTag: this.getTag,
            getChannelDisplayName: this.getChannelDisplayName,
            getDisplayNameList: this.getDisplayNameList,
	    getChannels:this.getChannels

        };

}]);