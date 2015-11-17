package com.gtnexus.appxpress.cordova;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;
import org.apache.cordova.PluginResult;

import android.content.Context;
import android.util.Log;

public class GTNexusReportPluginAndroid extends CordovaPlugin {
	
	public static String POLL = "pollReport";
    
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals(POLL)) { //poll report
            final String urlStr = args.getString(0);
            final String authStr = args.getString(1);
            final String dataKey = args.getString(2);
            final String reportId = args.getString(3);
			final String futureId = args.getString(4);
			final String filePath = args.getString(5);
            Log.d("LOG", "Plugin polling called!");
            final Context context = this.cordova.getActivity().getApplicationContext();
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try{
                        JSONObject response_json = ReportDownloader.download(urlStr,authStr,dataKey,reportId,futureId,filePath);

                        PluginResult result = new PluginResult(PluginResult.Status.OK, response_json);
                        result.setKeepCallback(true);

                        callbackContext.sendPluginResult(result);
                    }
                    catch(Exception e){
                        callbackContext.error("Error thrown in execute func of GTNexusReportPluginAndroid.java");
                    }
                }
            });
            
            
            return true;
        }
        return false;
    }
    
}