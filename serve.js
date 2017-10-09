'use strict';

var express = require('express');
var app = express();
var port;
app.use(express.static(__dirname));
app.listen((port = process.env.PORT || 3000), function (err) {
  if (err) return console.log(err.stack);
  console.log('IDEX verification tool launched on port ' + port);
});
