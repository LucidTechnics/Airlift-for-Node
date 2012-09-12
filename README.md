Airlift-for-Node
================

AirLift-for-Node is a code generation framework for node.js.  It draws inspiration from the original Airlift for Google's App Engine.

Airlift relies heavily on Connect and Dictation to create a web development environment using underscore, mustache, jquery, bootstrap, backbone.js. But you can use your own Javascript libraries as well.

## Installation

npm install airlift

## Disclaimer
Airlift for node.js is not ready for prime time yet ... As it matures we will continue to fill out the examples. Once it is ready to go this blurb will be removed.

## Example
```
//Start airlift as an http server listening at port 8080
var airlift = require('airlift');

airlift.start();
```