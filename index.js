const express = require('express');
const app = express()
const http = require('http');
const server = http.createServer(app)
const bodyParser = require('body-parser');
const { healthRouter } = require('./apiRouter');

app.use(bodyParser.json({limit: '1mb'})); 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', healthRouter);

const port = 8080||process.env.Port;
server.listen(port, "0.0.0.0", ()=>{console.log(`listening to port ${port}`)});