cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/com.gtnexus.appxpress.reportingplugin/www/gtnxreport.js",
        "id": "com.gtnexus.appxpress.reportingplugin.gtnxreport",
        "clobbers": [
            "window.GTNXReport"
        ]
    },
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
    "cordova-plugin-whitelist": "1.0.0",
    "com.gtnexus.appxpress.reportingplugin": "0.2.3"
}
// BOTTOM OF METADATA
});