cordova.define("com.gtnexus.appxpress.reportingplugin.gtnxreport", function(require, exports, module) { var exec = require('cordova/exec');

var pluginName = "gtnxReportHandler";


var GTNXReport = function() {
};

GTNXReport.poll = function(successCallback, errorCallback, url, authToken, dataKey, reportId, futureId, filePath ){
	exec(
		function(result) {
			successCallback(result);
        },
        function(error) {
			console.log("Error polling..");
            errorCallback();
        },
        pluginName,
        "pollReport",
        [url, authToken, dataKey, reportId, futureId, filePath]);	
};

module.exports = GTNXReport;
});
