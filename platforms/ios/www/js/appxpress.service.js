angular.module('app.services')

.factory('ApiRequests', ['$resource','globals', '$http','$q', '$base64' , '$localstorage' , function($resource, globals, $http, $q, $base64, $localstorage){
    //for testing
    var authToken = $localstorage.get('token') || "Basic YW5kcmV3QGJ1eTp0cmFkZWNhcmQ=";

    //var authToken = $localstorage.get('token');
    var reportId = "138325076";

    //report futureId
    //var futureId = "521s3sg81eq0uN28m6797g47s11";

    //var futureId = $localstorage.get('futureId') || "521s3sg81eq0uN28m6797g47s11";



    return{
        login : logInUser ,
        executeReport : runReport,
        pollReport : pollReport
    };

    function pollReport(futureId){
        return $q(function(resolve,reject){
            window.GTNXReport.poll(function(response){
                console.log(response);
                console.log(JSON.stringify(response,null,4));
                console.log(response.readyState);
                //Report polled successfully
                if( response.data ){
                    resolve(response);
                }
                else{
                    reject(response);
                }
            },function(error){
                reject(error);
            },globals.applicationHostName,authToken,globals.dataKey,reportId,futureId,""); //last param is filePath
        })
    }

    function runReport(succFn,failFn){
        var url = "/Report/" + reportId + "/execute";
        var promise = httpPost(url, null);
        return ( promise.then( succFn, failFn ) );
    }


    function logInUser(username, pw, succFn, failFn ){
        console.log(username);
        console.log(pw);
        authToken = authenticate(username,pw);
        var promise = httpGet('');
        return ( promise.then( succFn, failFn ) );
    }


    function httpGet(url, urlParams) {
        url = globals.applicationHostName + url + '?dataKey=' + globals.dataKey;
        if(urlParams){
            for(var key in urlParams){
                if(urlParams.hasOwnProperty(key)){
                    url += "&" + key + "=" + urlParams[key];
                }
            }
        }
        console.log(url);
        return $http.get(url ,{
            headers : {
                'Authorization' : authToken,
                'Access-Control-Allow-Origin' : '*',
                'Content-Type' : 'application/json'
            }
        });
    }

    function httpPost(url,data) {
        url = globals.applicationHostName + url + '?dataKey=' + globals.dataKey;
        console.log(url);
        console.log(authToken);
        return $http.post(url , data , {
            headers : {
                'Authorization' : authToken,
                'Access-Control-Allow-Origin' : '*',
                'Content-Type' : 'application/json',
                "cache-control": "no-cache"
            }
        });
    }
    function authenticate(user,pw){
        var separator = String.fromCharCode(0x1F);
        var str = user + separator + pw;
        var b64 = $base64.encode(str);
        return 'Basic ' + b64;
    }


    }]);