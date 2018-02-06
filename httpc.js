'use strict';

const net = require('net');
var http = require('http');
let url = require('url');
let fs = require('fs');
let urlString = process.argv[process.argv.length - 1];
let urlObject = url.parse(urlString);
let theHost = urlObject.host;

const yargs = require('yargs');
const argv = yargs.usage('node httpc.js [--host host] [--port port]' )
    .default('host', theHost)
    .default('port', 80)
    .argv;

let requestType;
let command = process.argv[2];
let verbose = (process.argv[3].toLowerCase() == "-v");
//arguments args

let qs; //Query Strings



/*
*process.argv[0] == "node"
 process.argv[1] == "httpc.js"
 We use httpc command so 0 and 1 we can disregard.
 process.argv[2] == "get, post or help"
 */
//HELP
if (command == 'help') {
    let printHelp = true;
    if (process.argv.length == 4) {
        switch (process.argv[3].toLowerCase()) {
            case "get":
                printHelp = false;
                console.log('usage: httpc get [-v] [-h key:value] URL\n'+
                    'Get executes a HTTP GET request for a given URL.\n'+
                    '-v Prints the detail of the response such as protocol,\n'+
                    'status, and headers.\n'+
                    '-h key:value Associates headers to HTTP Request with the format\n'+
                    '\'key:value\'.\n\n');
                break;
            case "post":
                printHelp = false;
                console.log('\nUsage: httpc post [-v] [-h key:value] [-d inline-data] [-f file] URL\n\n' +
                    'Get executes a HTTP GET request for a given URL.\n\n' +
                    '-v Prints the detail of the response such as protocol, status, and headers.\n' +
                    '-h key:value Associates headers to HTTP Request with the format \'key:value\'.\n' +
                    '-d string Associates an inline data to the body HTTP POST request.\n' +
                    '-f file Associates the content of a file to the body HTTP POST request.\n\n'
                );
                break;
            default:
                printHelp = false;
                console.log('Invalid Command\nget or post ONLY!!');
        }
    }
    if (printHelp) {
        console.log('httpc is a curl-like application but supports HTTP protocol only.\n'+
        'Usage:\n'+
        'httpc command [arguments]\n'+
        'The commands are:\n'+
        'get executes a HTTP GET request and prints the response.\n'+
        'post executes a HTTP POST request and prints the response.\n'+
        'help prints this screen.\n'+
        'Use "httpc help [command]" for more information about a command.\n\n');
    }
    process.exit(0);
}


//GET



if (command == 'get') {
    requestType = "GET";




    if (process.argv[3]== "-v") {
        console.log('Verbose\n');
    }

    getRequest();


    /*else{
        console.log('Invalid Command');
        InvalidParameterError();
    }*/
}

        const client = net.createConnection({host:theHost , port:80});

        client.on('error', err => {
            console.log('socket error %j', err);
            process.exit(-1);
         });

        function InvalidParameterError() {
          //                         0 1      2         3     4           5               6       7
          console.log('proper usage: httpc (get|post) [-v] (-h "k:v")* [-d inline-data] [-f file] URL');
            process.exit(0);
        }


        function getRequest(){
            let UserAgent = "User-Agent: Concordia-HTTP/1.0\n"
            let request = http.get(urlString, function(response){

                response.on('data', function(chunk){
                    console.log('Output: \n ' + UserAgent + chunk);
                });
            });
        }


/*
//POST
if (command == 'post') {
 requestType = "POST";
}*/

//Handle the inputs
/*if (process.argv.length > 3) {
    let UserAgent = "User-Agent:Concordia-HTTP/1.0\n";
    let isGet, type;
*/
//GET


    /*
     //POST//
     if (command == "post") {
     isGet = false;
     type = "POST";
     run.command('post')
     .action(function(req,optional){
     var url = url.parse(req);
     var vrb = (optional.verb==true);
     var header = (optional.header) ? optional.header : null ;
     var qs = (url.search != null) ? url.search : "";
     var content = (optional.data) ? optional.data : "" ;

     if (url.host != null && url.pathname != null) {
     postRequest(url.host, url.pathname + qs, vrb, header, content);
     }
     else {
     postRequest(url.pathname, "/", vrb, header, content);
     }
     })}


     var verbose = (process.argv[3].toLowerCase() == "-v");
     //parse the URL
     var urlToParse = process.argv[process.argv.length - 1];
     var urlObj = url.parse(urlToParse);

     //handle the remaining -h, -d, -f
     var numberParamsNoH = 4;
     if (verbose) {
     numberParamsNoH++;
     }

     //process the -h*
     while (process.argv.length - numberParamsNoH > 0) {
     if (process.argv[numberParamsNoH - 1].toLowerCase() != "-h") {
     //if its a get, or there is more than one pair left, quit
     if (isGet || (process.argv.length - numberParamsNoH) != 2) {
     InvalidParameterError();
     } else {
     break;
     }
     }
     headerParams = headerParams + process.argv[numberParamsNoH] + "\n";
     numberParamsNoH++;
     numberParamsNoH++;
     }

     if (!isGet) {
     var inlineDataParam = "";
     //process the -d
     if (process.argv[numberParamsNoH - 1].toLowerCase() == "-d") {
     inlineDataParam = process.argv[numberParamsNoH];
     }
     //process the -f
     else if (process.argv[numberParamsNoH - 1].toLowerCase() == "-f") {
     inlineDataParam = fs.readFileSync(process.argv[numberParamsNoH], 'utf8');
     } else {
     InvalidParameterError();
     }
     //add the content length and inline data
     headerParams = headerParams + "content-length: " + inlineDataParam.length + "\n\n" + inlineDataParam;
     }

     } else {
     InvalidParameterError();
     }

     */




