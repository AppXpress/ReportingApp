cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.gtnexus.appxpress.reportingplugin/www/gtnxreport.js",
        "id": "com.gtnexus.appxpress.reportingplugin.gtnxreport",
        "clobbers": [
            "window.GTNXReport"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.gtnexus.appxpress.reportingplugin": "0.2.3",
    "cordova-plugin-whitelist": "1.0.0"
}
// BOTTOM OF METADATA
});