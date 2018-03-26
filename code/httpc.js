'use strict';
const net = require('net');
const http = require('http');
const url = require('url');
const fs = require('fs'); // file sync
const request = require('request');
let buffToString , stringToJSON, buf, UserAgent = "Concordia-HTTP/1.0" ,options, requestType, keyVal, key , value ,storage;
let urlString = process.argv[process.argv.length - 1];
let urlObject = url.parse(urlString);
let thePort = urlObject.port;
let theHost = urlObject.host;
let thePath = urlObject.path
let StringBody = "";
const yargs = require('yargs');
const argv = yargs.usage('httpc is a curl-like application but supports HTTP protocol only.\n'+
    'Usage:\n'+
    '   httpc command [arguments]\n'+
    'The commands are:\n'+
    '   get executes a HTTP GET request and prints the response.\n'+
    '   post executes a HTTP POST request and prints the response.\n'+
    'help prints this screen.\n'+
    'Use "httpc help [command]" for more information about a command.\n\n' )
    .argv;

let command  = process.argv[2];
// for GET
let verbose = (process.argv[3].toLowerCase() == "-v");
let header = (process.argv[process.argv.length - 3].toLowerCase() == "-h" || process.argv[process.argv.length - 5] == "-h" );
    thePath = process.argv[3]; // NOT ALWAYS!!!! FIX THIS
//(POST ONLY)
let dataLine = process.argv[process.argv.length - 3].toLowerCase() == "-d" ;
let file = (process.argv[3].toLowerCase() == "-f" || process.argv[process.argv.length - 3].toLowerCase() == "-f" );

if (command == 'help') {
    if (process.argv.length == 4) {
        switch (process.argv[3].toLowerCase()) {
            case "get":
                console.log('usage: httpc get [-v] [-h key:value] URL\n'+
                    'Get executes a HTTP GET request for a given URL.\n'+
                    '-v Prints the detail of the response such as protocol,\n'+
                    'status, and headers.\n'+
                    '-h key:value Associates headers to HTTP Request with the format\n'+
                    '\'key:value\'.\n\n');
                break;
            case "post":

                console.log('\nUsage: httpc post [-v] [-h key:value] [-d inline-data] [-f file] URL\n\n' +
                    'Get executes a HTTP GET request for a given URL.\n\n' +
                    '-v Prints the detail of the response such as protocol, status, and headers.\n' +
                    '-h key:value Associates headers to HTTP Request with the format \'key:value\'.\n' +
                    '-d string Associates an inline data to the body HTTP POST request.\n' +
                    '-f file Associates the content of a file to the body HTTP POST request.\n\n'
                );
                break;
            default:
                console.log('Invalid Command\n help get or post ONLY!!');
        }
    }
    process.exit(0);
}

if (process.argv.length > 3) {

    let isGet, type;
    //handle get and post
    if (command.toLowerCase() == "get") {
        isGet = true;
        type = "GET";

        if ( process.argv.length >5 || verbose){
            getRequest();
            if (process.argv.length > 7){
                console.log('Invalid Command GET can only be non-verbose with header, OR  verbose with header ');
                InvalidParameterError();
            }
        }

    } else if (command.toLowerCase() == "post") {
        isGet = false;
        type = "POST";

        if ( process.argv.length >5) {
            postRequest();
            if (process.argv.length > 9) {
                console.log('Invalid Command POST can only be non-verbose or verbose. With head and either data-line or file not both.');
                InvalidParameterError();
            }
        }
    }
    //parse the URL

    if(thePort==null){
        thePort=80;
    } else {
        theHost =  theHost.split(":")[0];
    }

    //construct the request string
    var WrittenToFile = type + " " + thePath + " HTTP/1.1 \nHost: " + theHost + "\n HI MAN " ;
}

//create the connection
const client = net.createConnection({
    host: theHost,
    port: thePort
});

//on receiving the data, print it
client.on('data', function (data) {
    if (verbose) {
        console.log(data.toString());
    } else {
        //get rid of the head of the response if not verbose mode
        let responseSplit = data.toString().split("\r\n");
        let inBody = false;
        for (let i in responseSplit) {
            if (responseSplit[i] == "") {
                inBody = true;
            }
            if (inBody) {
                console.log(responseSplit[i]);
            }
        }
    }
});

//send the request
client.on('connect', () => {
    client.write(WrittenToFile);
});

client.on('error', err => {
    console.log('socket error %j', err);
    process.exit(0);
});

        function InvalidParameterError() {
            console.log('Proper Usage: httpc (get|post) [-v] (-h "k:v")* [-d inline-data] | [-f file] URL \n');
            if(requestType =="GET")
            {
                console.log('GET:\n 1) httpc get URL \n ' +
                '2) httpc get -v URL \n '+
                '3) httpc get -h key:value URL \n '+
                '4) httpc get -v -h key:value URL \n ');
            }

            if(requestType =="POST")
            {
                console.log('POST:\n ' +
                    '1) httpc post -d inline-data URL \n ' +
                    '2) httpc post -h key:value -d inline-data URL \n ' +
                    '3) httpc post -v -h key:value -d inline-data URL \n ' +
                    '4) httpc post -f filename URL \n '+
                    '5) httpc post -h key:value -f filename URL \n ' +
                    '6) httpc post -v -h key:value -f filename URL \n ');
            }


            process.exit(0);
        }

        //GET
            function getRequest(){
                requestType = "GET";
                 console.log('\n Output: \n ');
                 let request = http.get(urlString, function(response){

                    response.on('data', function(stuff){
                            buffToString = stuff.toString(),
                            stringToJSON = JSON.parse(buffToString);
                            stringToJSON.headers.UserAgent = UserAgent;

                        if(verbose) {
                            console.log(" HTTP/1.1 " + response.statusCode + ' ' + response.statusMessage)
                            isVerbose();
                        }
                            if(header){
                            isHeaderPassed();
                            stringToJSON.headers.key = value;}

                            buf = Buffer.from(JSON.stringify(stringToJSON));
                        StringBody += buf;
                    });
                    response.on("end", function(){
                        StringBody =  StringBody.replace(/,/g, (',\n  '));
                        StringBody =  StringBody.replace(/:{/g, (':{\n  '));
                        StringBody =  StringBody.replace(/}/g, '\n}');
                        StringBody =  StringBody.replace(/},/g, ('  }, '));
                        StringBody = StringBody.replace(/key/g, (key));
                        StringBody =  StringBody.replace(/UserAgent/g, ('User-Agent'));

                        console.log(StringBody);

                    });
            });
        }
       //POST

        function postRequest() {
            requestType = "POST";
            if (dataLine) {
                request(
                    {
                        method: 'post',
                        url: urlString,
                        json: process.argv[process.argv.length - 2],
                    },
                    function (response, body) {
                        //Print the Response
                        console.log(UserAgent);
                        body.body.headers.UserAgent = UserAgent;
                        if (header) {
                            isHeaderPassed();
                            body.body.headers.key = value;
                        }

                        buf = Buffer.from(JSON.stringify(body.body));
                        StringBody += buf;

                        StringBody = StringBody.replace(/,/g, (',\n  '));
                        StringBody = StringBody.replace(/},/g, ('}, '));
                        StringBody = StringBody.replace(/"Accept/g, ('\n  "Accept'));
                        StringBody = StringBody.replace(/UserAgent/g, ('User-Agent'));
                        StringBody = StringBody.replace(/key/g, (key));

                        console.log(StringBody);
                        if (verbose){  console.log("\n HTTP/1.1 " + body.statusCode + ' ' + body.statusMessage);
                            isVerbose();}
                    });
            }

            if(file){
                let fileValue = fs.readFileSync(process.argv[process.argv.length - 2], 'utf8');
                request(
                    {
                        method: 'post',
                        url: urlString,
                        json: process.argv[process.argv.length - 2],
                    },
                    function (response, body) {

                       body.body.headers.UserAgent = UserAgent;

                        if (header) {
                             isHeaderPassed();
                             body.body.headers.key = value;
                        }

                        body.body.files = fileValue;

                        buf = Buffer.from(JSON.stringify(body.body));

                        StringBody += buf;

                        StringBody = StringBody.replace(/,/g, (',\n  '));
                        StringBody = StringBody.replace(/},/g, ('}, '));
                        StringBody = StringBody.replace(/"Accept/g, ('\n  "Accept'));
                        StringBody = StringBody.replace(/UserAgent/g, ('User-Agent'));
                        StringBody = StringBody.replace(/key/g, (key));
                        console.log(StringBody);

                        if (verbose){console.log("\n HTTP/1.1 " + body.statusCode + ' ' + body.statusMessage);
                            isVerbose();}
                    });
            }

            }

        //IF Header passed in
function isHeaderPassed(){
    if(requestType=="GET")
        keyVal = process.argv[process.argv.length - 2];
    if(requestType=="POST")
        keyVal = process.argv[process.argv.length - 4];

    storage = keyVal.split(':');
    key = storage[0], value= storage[1];
}
        // IF verbose
function isVerbose() {
    if (verbose) {
       let VerboseBody ="";
        if (requestType == 'GET') {
            options = {method: 'GET', host: theHost, port: 80, path: '/'};
        } else if (requestType == "POST") {
            options = {method: 'POST', host: theHost, port: 80, path: '/'};
        }
        let req = http.request(options, function (res) {

                let verBuffer = Buffer.from(JSON.stringify(res.headers));
            VerboseBody += verBuffer

            VerboseBody = VerboseBody.replace(/, /g, (' '));
            VerboseBody = VerboseBody.replace(/,/g, ('\n'));
            VerboseBody = VerboseBody.replace(/{/g, (''));
            VerboseBody = VerboseBody.replace(/}/g, '\n');
            VerboseBody = VerboseBody.replace(/"/g, ' ');

                console.log(VerboseBody);
            }
        );
        req.end();
    }
}









