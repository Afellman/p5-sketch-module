var express = require('express');
var path = require('path');
var app = express();
var port = 8081;
var osc = require("osc");
const server = require('http').createServer();
const remoteIP = "192.168.1.12";
let glClient;


app.use(express.static(__dirname + '/'))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(port, () => {
  console.log(`Listening on port:${port}`)
});


/*******************
 * OSC Over Serial *
 *******************/

// Instantiate a new OSC Serial Port.
var serialPort = new osc.SerialPort({
  devicePath: process.argv[2] || "/dev/tty.usbmodem221361"
});

serialPort.on("message", function (oscMessage) {
  console.log(oscMessage);
});

// Open the port.
serialPort.open();


/****************
 * OSC Over UDP *
 ****************/

var getIPAddresses = function () {
  var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 12345,
});



udpPort.on("ready", function () {
  var ipAddresses = getIPAddresses();
  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function (address) {
    console.log(" Host:", address + ", Port:", udpPort.options.localPort);
  });
  udpPort.send({ address: '/1/speed', args: [{ type: "f", value: 0.00 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/space', args: [{ type: "f", value: 50 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/jitter', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/lineProx', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/showProxLines', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/showConnectLines', args: [{ type: "f", value: 1 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/rowAmtLabel', args: [{ type: "f", value: 1 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/spaceLabel', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/speedLabel', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/jitterLabel', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/proxLabel', args: [{ type: "f", value: 0 }] }, remoteIP, 9000)
  udpPort.send({ address: '/1/bgAlpha', args: [{ type: "f", value: 255 }] }, remoteIP, 9000);

  // Scene2
  udpPort.send({ address: '/2/plodeAmt', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  udpPort.send({ address: '/2/fillAlpha', args: [{ type: "f", value: 13 }] }, remoteIP, 9000);
  udpPort.send({ address: '/2/breathe', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  udpPort.send({ address: '/2/startJitter', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  udpPort.send({ address: '/2/toggleExplode', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);

  // Scene 3
  udpPort.send({ address: '/3/amp', args: [{ type: "f", value: 10 }] }, remoteIP, 9000);
  udpPort.send({ address: '/3/circleSize', args: [{ type: "f", value: 1 }] }, remoteIP, 9000);
  udpPort.send({ address: '/3/circleAmt', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  udpPort.send({ address: '/3/speedLabel', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  udpPort.send({ address: '/3/circleAmt', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
});

udpPort.on("message", function (oscMessage) {
  console.log(oscMessage);
  glClient.emit(oscMessage.address, oscMessage);
});

udpPort.on("error", function (err) {
  console.log(err);
});

udpPort.open();


const io = require('socket.io')(server);
io.on('connection', client => {
  glClient = client
  console.log('Web socket connected')
  client.on('disconnect', () => { /* … */ });
  glClient.on("rowChange", (val) => {
    udpPort.send({ address: '/1/rowAmtLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000)
  });
  glClient.on("spaceChange", (val) => {
    udpPort.send({ address: '/1/spaceLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000)
  });
  glClient.on("speedChange", (val) => {
    udpPort.send({ address: '/1/speedLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000)
  });
  glClient.on("jitterChange", (val) => {
    udpPort.send({ address: '/1/jitterLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000)
  });
  glClient.on("proxChange", (val) => {
    udpPort.send({ address: '/1/proxLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000)
  });

  // Scene 2
  glClient.on("plodeAmtChange", (val) => {
    udpPort.send({ address: '/2/plodeAmtLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000);
  });

  glClient.on("explodeOff", (val) => {
    udpPort.send({ address: '/2/toggleExplode', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  });
  glClient.on("breatheOff", (val) => {
    udpPort.send({ address: '/2/breathe', args: [{ type: "f", value: 0 }] }, remoteIP, 9000);
  });

  // Scene 3 
  glClient.on("scene3Speed", (val) => {
    udpPort.send({ address: '/3/speedLabel', args: [{ type: "f", value: val }] }, remoteIP, 9000);
  });
});
server.listen(8080);
