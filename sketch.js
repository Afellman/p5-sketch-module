// Used for the smooth transitions.
let alphaNum = 0; 
// List of all the sketches object keys to load them.
let sketchArray = Object.keys(sketches); 
// Loading the first sketch (this can be changed to a string of the sketch property name).
let currentSketch = sketchArray[0]; 


/*************************************************
 * P5 Functions
 *************************************************/
// For any preloading of sounds or images.
function preload() {

}

// Starting with a canvas the full window size.
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Runs the currentSketch's setupThis function.
  sketches[currentSketch].setupThis();
}

function draw() {
  fadeOutRect();
  // Runs the currentSketch's drawThis function.
  sketches[currentSketch].drawThis();
}

/*************************************************
 * Other Functions
 *************************************************/

 // Sending the mouseClicked event to the currentSketch.
function mouseClicked(){
  sketches[currentSketch].mouseClicked();
};

// These two functions give a smooth transition between sketches.
function sketchTransition() {
  let trans = setInterval(function () {
    alphaNum++
    if (alphaNum == 255) {
      switchSketch();
      sketchTransition2(trans);
    }
  }, 10);
}

function sketchTransition2(trans) {
  clearInterval(trans);
  let trans2 = setInterval(function () {
    alphaNum--
    if (alphaNum == 0) {
      clearInterval(trans2);
    }
  }, 10)
}

// Function that is called during the draw cycle which draws
// a rect the full screen size with no alpha.
function fadeOutRect() {
  noStroke();
  fill(0, alphaNum);
  rect(0, 0, width, height);
}

function switchSketch() {
  let nextPos = sketchArray.indexOf(currentSketch) + 1;
  if (nextPos < sketchArray.length){
    currentSketch = sketchArray[nextPos];
  } else {
    currentSketch = sketchArray[0];
  }
  sketches[currentSketch].setupThis();
}

/*************************************************
 * Dom Listeners
 *************************************************/

document.addEventListener('keydown', function (event) {
  // Switch sketch on "Spacebar" key down
  if(event.keyCode == 32){
    switchSketch();
    // Start transition on "Enter" key down
  } else if (event.keyCode == 13) {
    sketchTransition();
  }
})