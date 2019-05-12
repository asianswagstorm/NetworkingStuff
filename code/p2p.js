/**
 * Created by Andy And Piratheeban on 2018-04-03.
 */
'use strict';

let PORT = 33333;
let BROADCAST = '255.255.255.255'; // Broadcast is the IP

let dgram = require('dgram');
let server = dgram.createSocket('udp4');// the UDP socket

let isFirst = true;
let isPrivate;
let name = "Guest";
let connectedUsers = [];
let privateUser = "";
let sentReceiver = "";
let channelName = "general";
let channelArray = [];

server.on('listening', function () {
    let address = server.address();
    console.log("Hello %s! Enter your name:", name);
});

server.on('message', function (message, remote) {
    let splitMsg = message.toString().split("\n");

    let sentName = splitMsg[0].split(":")[1];
	let sentChannel = splitMsg[1].split(":")[1]
    let sentCommand = splitMsg[2].split(":")[1];
    let sentMsg = splitMsg[3].split(":")[1];
	
    if (splitMsg[0].split(":")[0].toString() === "privateReceiver") {
        isPrivate = false;
        sentReceiver = splitMsg[0].split(":")[1].toString();
        sentName = splitMsg[1].split(":")[1];
        sentCommand = splitMsg[2].split(":")[1];
        sentMsg = splitMsg[3].split(":")[1];
    }
	
	//console.log(sentChannel);
	

    switch (sentCommand) {
        case "TALK":
			if(channelName===sentChannel)
				console.log("%s [%s #%s]: %s", new Date(), sentName, channelName, sentMsg);
			else if(sentChannel==="general")
				console.log("%s [%s #general]: %s", new Date(), sentName, sentMsg);
            break;

        case "PRIVATE":
            if (sentReceiver === name && sentName !== name) {
                console.log("%s [%s] (Private): %s", new Date(), sentName, sentMsg);
            }
            break;
        case "JOIN":
            console.log("%s %s joined!", new Date(), sentName);
            if (name !== "Guest") {
                sendMessage("", "PING");
            }
            if (!connectedUsers.contains(sentName)) {
                connectedUsers.push(sentName);
            }
            break;
		case "CHANNEL":
			console.log("%s Switched to channel %s", new Date(), channelName);
			break;
        case "LEAVE":
            console.log("%s %s left!", new Date(), sentName);
            remove(connectedUsers, sentName);
            if (sentName === name) {
                sendMessage("", "QUIT");
            }
            break;

        case "PING":
            if (!connectedUsers.contains(sentName)) {
                connectedUsers.push(sentName);
            }
            break;

        default:
            return "";

    }
});

server.bind(PORT, "", function () {
    server.setBroadcast(true);
});

process.openStdin().addListener("data", function (d) {
    if (isFirst) {
        name = d.toString().trim();
        console.log("Welcome to the chat %s!", name);
        isFirst = false;
        sendMessage("", "JOIN");
    } else if (d.toString().trim().toLowerCase() === "/leave") {
        sendMessage("", "LEAVE");
    } else if (d.toString().trim().toLowerCase() === "/who") {
        sendMessage("", "WHO");
    } else if (d.toString().split(" ")[0].toLowerCase() === "/private") {
        isPrivate = true;
        privateUser = d.toString().split(" ")[1].trim();
        if (!connectedUsers.contains(privateUser))
            console.log("%s doesn't exist in the chat!", privateUser);
        else
            console.log("Private message to %s:", privateUser);
    } else if (d.toString().split(" ")[0].toLowerCase() === "/channel"){
		channelName = d.toString().split(" ")[1].trim();
		sendMessage(d, "CHANNEL");
		
	} else {
        if (isPrivate && connectedUsers.contains(privateUser)) {
            sendMessage(d, "PRIVATE");
        } else {
            sendMessage(d, "TALK");
        }
    }
});

function sendMessage(input, command) {
    if (command === "QUIT") {
        console.log("Have a Beautiful Day!");
        process.exit(0);
    } else if (command === "WHO") {
        console.log("%s Connected Users: %s", new Date(), connectedUsers);
    } else if (command ==="CHANNEL"){
		console.log("%s Switched to channel %s", new Date(), channelName);
	}
	else {
        let message = "";
        if (command === "PRIVATE") {
            message = "privateReceiver:" + privateUser + "\nuser:" + name + "\ncommand:" + command + "\nmessage:" + input.toString().trim() + "\n\n";
        } else {
            message = "user:" + name + "\nchannel:" + channelName + "\ncommand:" + command + "\nmessage:" + input.toString().trim() + "\n\n";
        }

        server.send(message, 0, message.length, PORT, BROADCAST);
    }
}

Array.prototype.contains = function (needle) {
    for (let i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}

function remove(arr, what) {
    let found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}
