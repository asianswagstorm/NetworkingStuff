# NetworkingStuff

To create httpc command follow these steps. https://javascriptplayground.com/node-command-line-tool/ 

A1: httpc A2: https

httpc get -v 'http://httpbin.org/get?course=networking&assignment=1'
httpc get -h Dog:Woof 'http://httpbin.org/get?course=networking&assignment=1'
httpc get -v -h Dog:Woof 'http://httpbin.org/get?course=networking&assignment=1'

httpc get / 'http://localhost:8000/'
httpc get /foo.txt 'http://localhost:8000/'

httpc post -d Hello 'http://httpbin.org/post'
httpc post -h Dog:Woof -d Hello 'http://httpbin.org/post'
httpc post -v -h Dog:Woof -d Hello 'http://httpbin.org/post'
httpc post -f package.json 'http://httpbin.org/post'
httpc post -h Dog:Woof -f package.json 'http://httpbin.org/post'
httpc post -v -h Dog:Woof -f package.json 'http://httpbin.org/post'

httpc post /bar.txt 'http://localhost:8000/'

httpfs -v -p 8000 -d 'C:\comp445' 

A3: p2p.js
Install Docker Quickstart Terminal 
Run on 2 or more docker container not git bash (timezone issues)

Calling docker images:

docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app -w /usr/src/app node:8 node p2p.js

docker run --rm -it -v $PWD:/run -w /run -u $UID mc2labs/nodejs /bin/bash 
node p2p.js



