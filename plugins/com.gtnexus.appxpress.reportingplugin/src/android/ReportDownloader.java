package com.gtnexus.appxpress.cordova;

import java.io.ByteArrayOutputStream;
import java.net.MalformedURLException;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class ReportDownloader {
    final static String version = "310";
           //final static String baseURL ="https://training.tradecard.com/rest/"+version+"/media/";
           static String baseURL;
           static String outputFile = "report.html";
	
	public static JSONObject download(String url, String auth, String dataKey,String reportId,String futureId,String filePath){
	    baseURL = url;


	    String res = PollReport(auth,reportId,futureId,dataKey);

        try{
            if( res.contains("futureId") && res.contains("Estimated wait time") && res.contains("message") ){
                JSONObject response = new JSONObject();
                response.put("readyState", -1 );
                response.put("message", "Report not ready");
                return response;
            }
            else if(res.equals("hostError")){
                JSONObject err = new JSONObject();
                err.put("error", "Unknown host - plugin cannot resolve host "  + getHost(baseURL));
                return err;
            }
            else if( res.equals("error")){
                JSONObject err = new JSONObject();
                err.put("error", "Error executing POLL Request in ReportDownloader");
                return err;
            }
            else{
                return formJSON(res);
            }
        }
        catch(Exception e){
            return new JSONObject();
        }
	}
       public static JSONObject formJSON(String res){
           try{
               JSONObject dataset = new JSONObject();
               JSONArray tableData = new JSONArray();

               Document doc = Jsoup.parse(res);
               Elements tables = doc.getElementsByTag("table");
               Element dataTable = tables.get(1);

               //headers
               Elements headers = dataTable.getElementsByTag("th");
               for( Element th : headers ){
                   dataset.accumulate( "headers" , th.text() );
               }

               Elements tableRows = dataTable.getElementsByTag("tr");
               int rowIter = 0;
               for(Element myRow : tableRows ){
                   Elements columns = myRow.getElementsByTag("td");
                   JSONObject buildDataIndex = new JSONObject();
                   int colIter = 0;
                   for(Element myCol : columns){
                       buildDataIndex.put( headers.get(colIter).text(), myCol.text());
                       colIter++;
                   }
                   if(buildDataIndex.length() > 0 ){
                       tableData.put(rowIter, buildDataIndex);
                       rowIter++;
                   }
                   //Limits Data output to 100
                   if( rowIter > 100){
                       break;
                   }
               }

               dataset.put("data", tableData);
               System.out.println(dataset.toString() );
               return dataset;
               //return dataset.toString();
           }
           catch(Exception e){
                System.out.println(e.toString());
                //return "exception";
           }
           return new JSONObject();
       }

       public static void ExecuteReport(){

       }
       public static String PollReport(String authentication, String reportId, String futureId , String dataKey){
    	   try{
               System.out.println("variables: auth" + authentication + " /repid " + reportId + " /fid " +futureId + " /dk " + dataKey);
    		   String urlStr =  baseURL + "/Report/" + reportId + "/poll?dataKey="+dataKey;
    		   urlStr = urlStr + "&futureId=" + futureId + "&format=html";
    		   URL url = new URL(urlStr);

    		   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
               conn.setRequestMethod("GET");

               conn.setRequestProperty("Connection", "Close");
               conn.setRequestProperty("Authorization", authentication);

               int responseCode = conn.getResponseCode();
               if(responseCode == 200){

                  InputStream is = conn.getInputStream();
                  //OutputStream os = new FileOutputStream(outputFile);
                  byte[] b = new byte[2048];
                  int length;
                  return getStringFromInputStream(is);
                  /*
                  while ((length = is.read(b)) != -1) {
                     os.write(b, 0, length);
                  }
                  */
                  //System.out.println(responseStr);
                  //os.close();
               }
               else{
               	InputStream is = conn.getInputStream();
               	return getStringFromInputStream(is);

               }
    	   }
    	   catch(Exception e){
    		   System.out.println(e);
               if( e.toString().contains("java.net.UnknownHostException")){
                   return "hostError";
               }
    	   }
    	   return "error";
       }

    // convert InputStream to String
    	private static String getStringFromInputStream(InputStream is) {

    		BufferedReader br = null;
    		StringBuilder sb = new StringBuilder();

    		String line;
    		try {

    			br = new BufferedReader(new InputStreamReader(is));
    			while ((line = br.readLine()) != null) {
    				sb.append(line);
    			}

                is.close();
    		} catch (IOException e) {
    			e.printStackTrace();
    		} finally {
    			if (br != null) {
    				try {
    					br.close();
    				} catch (IOException e) {
    					e.printStackTrace();
    				}
    			}
    		}
    		return sb.toString();

    	}

        private static String getHost(String full_url){
            full_url = full_url.replace("https://","");
            full_url = full_url.replace("http://", "");

            if( full_url.indexOf("/") > 0 ){
                full_url = full_url.substring(0,full_url.indexOf("/"));
            }
            return full_url;
        }
}