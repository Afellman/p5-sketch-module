// Used for the smooth transitions.
let alphaNum = 0;
// List of all the sketches object keys to load them.
let sketchArray = Object.keys(sketches);
// Loading the first sketch (this can be changed to a string of the sketch property name).
let currentSketch = "maze";
let source;
let fft;
let cnv;
let fadeIn = false;
let fadeOut = false;
var socket = io('http://localhost:8080');


socket.on('connect', function () { });

socket.on('/scene1', function (data) {
  if (data.args[0] == 1) {
    switchSketch(0)
  }
});
socket.on('/scene2', function (data) {
  if (data.args[0] == 1) {
    switchSketch(1)
  }
});
socket.on('/scene3', function (data) {
  if (data.args[0] == 1) {
    switchSketch(2)
  }
});
socket.on('/scene4', function (data) {
  if (data.args[0] == 1) {
    switchSketch(3)
  }
});
socket.on('/glFade', function (data) {
  alphaNum = data.args[0];
});
socket.on('/1/showConnectLines', function (data) {
  sketches[currentSketch].controls.toggleConnectLines(data.args[0]);
});
socket.on('/1/showProxLines', function (data) {
  sketches[currentSketch].controls.toggleProxLines(data.args[0]);
});

socket.on('/1/lineProx', function (data) {
  sketches[currentSketch].controls.setLineProx(data.args[0]);
  socket.emit("proxChange", data.args[0]);
});

socket.on('/1/jitter', function (data) {
  sketches[currentSketch].controls.setJitter(data.args[0]);
  socket.emit("jitterChange", data.args[0]);
});

socket.on('/1/lastIndex', function (data) {
  sketches[currentSketch].controls.setLastIndex(data.args[0]);
});

socket.on('/1/speed', function (data) {
  sketches[currentSketch].controls.setSpeed(data.args[0]);
  socket.emit("speedChange", data.args[0]);
});

socket.on('/1/space', function (data) {
  sketches[currentSketch].controls.setSpacing(data.args[0]);
  socket.emit("spaceChange", glSpacing);
});

socket.on('/1/bounce', function (data) {
  if (data.args[0]) {
    sketches[currentSketch].controls.bounce();
  }
});

socket.on('/1/addRow', function (data) {
  if (data.args[0]) {
    sketches[currentSketch].controls.addRow();
    socket.emit("rowChange", lastShownIndex);
  }
});

socket.on('/1/removeRow', function (data) {
  if (data.args[0]) {
    sketches[currentSketch].controls.removeRow();
    socket.emit("rowChange", lastShownIndex);
  }
});

socket.on('/1/bgAlpha', function (data) {
  sketches[currentSketch].controls.setBgAlpha(data.args[0]);
});
socket.on('/2/toggleExplode', function (data) {
  sketches[currentSketch].controls.breatheOff();
  sketches[currentSketch].controls.toggleExplode();
  socket.emit("breatheOff", true);
});

socket.on('/2/plodeAmt', function (data) {
  sketches[currentSketch].controls.setPlodeAmt(data.args[0]);
  socket.emit("plodeAmtChange", data.args[0]);
});

socket.on('/2/breathe', function (data) {
  if (data.args[0] == 1) {
    sketches[currentSketch].controls.breatheOn();
    socket.emit("explodeOff", true);
  } else {
    sketches[currentSketch].controls.breatheOff();
  }
});

socket.on('/2/startJitter', function (data) {
  if (data.args[0] == 1) {
    sketches[currentSketch].controls.startJitter();
  }
});
socket.on('/2/speed', function (data) {
  sketches[currentSketch].controls.setSpeed(data.args[0]);
});

socket.on('/2/flow', function (data) {
  sketches[currentSketch].controls.toggleFlow();
});

socket.on('/2/fillAlpha', function (data) {
  sketches[currentSketch].controls.setFillAlpha(data.args[0]);
});
socket.on('/3/speedUp', function (data) {
  if (data.args[0] == 1) {
    sketches[currentSketch].controls.speedUp();
    socket.emit("scene3Speed", scene3Speed);
  }
});

socket.on('/3/speedDown', function (data) {
  if (data.args[0] == 1) {
    sketches[currentSketch].controls.speedDown();
    socket.emit("scene3Speed", scene3Speed);
  }
});

socket.on('/3/circleSize', function (data) {
  sketches[currentSketch].controls.setCircleSize(data.args[0]);
});

socket.on('/3/amp', function (data) {
  sketches[currentSketch].controls.setAmp(data.args[0]);
});

socket.on('/3/circleAmt', function (data) {
  sketches[currentSketch].controls.setCircleAmt(data.args[0]);
});

socket.on('/3/threshDivider', function (data) {
  sketches[currentSketch].controls.setThreshHold(data.args[0]);
});
socket.on('/4/waveAmt', function (data) {
  sketches[currentSketch].controls.setWaveAmt(data.args[0]);
});

socket.on('/4/waveVol', function (data) {
  sketches[currentSketch].controls.setWaveVol(data.args[0]);
});

socket.on('/4/toggleWave', function (data) {
  sketches[currentSketch].controls.toggleWave(data.args[0]);
});
/*************************************************
 * P5 Functions
 *************************************************/
// For any preloading of sounds or images.
function preload() {
  if (sketches[currentSketch].preload) {
    sketches[currentSketch].preload();
  }
}


// Starting with a canvas the full window size.
function setup() {
  // setupOsc();
  cnv = createCanvas(windowWidth, windowHeight);
  // Runs the currentSketch's setupThis function.
  sketches[currentSketch].setupThis();
}

function draw() {
  // Runs the currentSketch's drawThis function.
  sketches[currentSketch].drawThis();
  if (alphaNum > 0) {
    fadeOutRect();
  }
}

/*************************************************
 * Other Functions
 *************************************************/

function setupOsc() {


}
// Sending the mouseClicked event to the sketches[currentSketch].
function mouseClicked() {
  sketches[currentSketch].mouseClicked();
};


// Function that is called during the draw cycle which draws
// a rect the full screen size with no alpha.
function fadeOutRect() {
  push()
  noStroke();
  fill(0, alphaNum);
  rect(0, 0, width, height);
  pop()
}

function switchSketch(index) {
  if (index !== undefined) {
    currentSketch = sketchArray[index];
  } else {
    let nextPos = sketchArray.indexOf(currentSketch) + 1;
    if (nextPos < sketchArray.length) {
      currentSketch = sketchArray[nextPos];
    } else {
      currentSketch = sketchArray[0];
    }
  }
  sketches[currentSketch].setupThis();
}

/*************************************************
 * Dom Listeners
 *************************************************/

document.addEventListener('keydown', function (event) {
  if (event.key == "f") {
    fullscreen("foo")
    resizeCanvas(windowWidth, windowHeight);
  }

  // Switch sketch on "Spacebar" key down
  if (event.keyCode == 32) {
    switchSketch();
    // Start transition on "Enter" key down
  } else if (event.keyCode == 13) {
    fadeOut = true;
  }
})