/**
 * Created by Andy on 2018-04-03.
 */
'use strict';

let PORT = 33333;
let BROADCAST = '255.255.255.255';

let dgram = require('dgram');
let server = dgram.createSocket('udp4');
let stdin = process.openStdin();

let isFirst = true;
let name = "Guest";
let connectedUsers = [];

server.on('listening', function () {
    var address = server.address();
    console.log("Hello %s! Enter your name:", name);
});

server.on('message', function (message, remote) {
    let splitMsg = message.toString().split("\n");
    let sentName = splitMsg[0].split(":")[1];
    let sentCommand = splitMsg[1].split(":")[1];
    let sentMsg = splitMsg[2].split(":")[1];
    if (sentCommand === "TALK") {
        console.log("%s [%s]: %s", new Date(), sentName, sentMsg);
    } else if (sentCommand === "JOIN") {
        console.log("%s %s joined!", new Date(), sentName);
        if (name !== "Guest") {
            sendMessage("", "PING");
        }
        if (!connectedUsers.contains(sentName)) {
            connectedUsers.push(sentName);
        }
    } else if (sentCommand == "LEAVE") {
        console.log("%s %s left!", new Date(), sentName);
        remove(connectedUsers, sentName);
        if (sentName === name) {
            sendMessage("", "QUIT");
        }
    } else if (sentCommand == "PING") {
        if (!connectedUsers.contains(sentName)) {
            connectedUsers.push(sentName);
        }
    }
});

server.bind(PORT, "", function () {
    server.setBroadcast(true);
});

stdin.addListener("data", function (d) {
    if (isFirst) {
        name = d.toString().trim();
        console.log("Welcome to the chat %s!", name);
        isFirst = false;
        sendMessage("", "JOIN");
    } else if (d.toString().trim().toLowerCase() === "/leave") {
        sendMessage("", "LEAVE");
    } else if (d.toString().trim().toLowerCase() === "/who") {
        sendMessage("", "WHO");
    } else {
        sendMessage(d, "TALK");
    }
});

function sendMessage(input, command) {
    if (command === "QUIT") {
        console.log("Have a Beautiful Day!");
        process.exit(0);
    } else if (command === "WHO") {
        console.log("%s Connected Users: %s", new Date(), connectedUsers);
    } else {
        let message = "user:" + name + "\ncommand:" + command + "\nmessage:" + input.toString().trim() + "\n\n";
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