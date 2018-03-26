/**
 * Created by Andy on 2018-03-14.
 */
'use strict';

const net = require('net');
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const argv = yargs.usage('httpfs [-v] [-p PORT] [-d PATH-TO-DIR]')
    .describe('v', 'Prints debugging messages.')
    .default('p', 8080)
    .describe('p', 'Specifies the port number that the server will listen and serve at.')
    .default('d', "C:")
    .describe('d', 'Specifies the directory that the server will use to read/write requested files. Default is the current directory when launching the application.')
    .help('help')
    .argv;

//set verbose
let verbose = false;
if (argv.v) {
    verbose = true;
}

const server = net.createServer(handleClient);
server.listen(argv.p, function() {
    console.log("Server is now Listening %j" ,server.address());
});

function handleClient(socket) {
    console.log('New client from %j', socket.address());
    socket.on('data', function (data) {
            if (verbose) console.log(data.toString());

            let splitHeader = data.toString().split("\n");
            let splitFirstLine = splitHeader[0].split(" ");

            //get the type; get or post
            let type = splitFirstLine[0];
            console.log("type is: " + type);
            //get the requested page path
            let requestedPage = splitFirstLine[1]+" "+splitFirstLine[2];

            console.log("requestedPage is: " + requestedPage + "\n");

            /*//before doing anything, for security, reject a request if the file name is not for the current directory
            if ("/"+path.basename(requestedPage)!=requestedPage){
               // if (verbose) console.log("Forbidden: You can't work outside of the current directory.");
                socket.write("HTTP/1.0 403 Forbidden\r\n\r\nForbidden: You can't work outside of the current directory.");
                socket.destroy();
                return;
            }*/
            //for security only accept the file name when reading or writing
            let file = argv.d + "/" + path.basename(requestedPage);

            //the body of the request
            let requestBody = data.toString();
            if (verbose) console.log(requestBody);

            let body = "";

            if (type.toLowerCase() == "get") {

                if (requestedPage == "C:/Program Files/Git/") {
                    body = "Current list of files in the data directory:";
                    let files = fs.readdirSync(argv.d);

                    for (let i in files) {
                        body = body + "\n" + files[i];
                    }
                    if (verbose) console.log(body);
                } else {
                    //if requested a particular file
                    if (verbose) console.log(file);
                    try {
                        let fileContent = fs.readFileSync(file);

                        body = fileContent.toString();
                    } catch (err) {
                        body = "Error: File not found";
                        if (verbose) console.log("File not found");
                    }
                }
            } else if (type.toLowerCase() == "post") {

                console.log("requestedPage is: " + requestedPage + "\n");
                if (requestedPage.toLowerCase() == "C:/Program Files/Git/") {

                    body = "Forbidden: You can't post a file to the root.";
                    if (verbose) console.log("Forbidden: You can't post a file to the root.");
                } else {
                    try {
                        fs.writeFileSync(file, requestBody);
                        body = "Success! file " + path.basename(requestedPage) + " has been created.";
                    } catch (err) {
                        body = "Forbidden: You do not have permission to perform that request.";

                      //  if (verbose) console.log("Forbidden: You do not have permission to perform that request.");
                    }
                }
            } else {
                body = "Error: Bad request";
                if (verbose) console.log("Error: Bad request");
            }

            //write to the socket and destroy it
            socket.write("HTTP/1.1 " + socket.statusCode + ' ' + socket.statusMessage + "\r\n\r\n" + body);
            socket.destroy();
        });


    socket.on("error", function(err) {
        console.log('socket error %j', err);
        socket.destroy();
    } );

}







