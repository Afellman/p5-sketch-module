/*
  Module of different p5 sketches. Each on can be plugged into a sketch.js file,
  calling their setupThis and drawThis functions in their respective p5 functions.
*/
let sketches = {
  maze: function () {
    let t = 0;
    let lines = [];
    let lineLength = 12;
    let spacing = 19;
    let linesPerRow;
    let rows;
    let amplitude;
    let waveSpeed = 0.01;
    let waveVol = 0.00;
    let waveAmt = 1;
    let waveOn = false;

    class Line {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = HALF_PI;
        this.length = lineLength;
      }

      checkProx(x, y) {
        if (dist(x, y, this.x, this.y) < lineLength + 25) {
          this.r += HALF_PI;
        }
      }

      rotate(i, j) {
        (lines[i - 1]) && (lines[i - 1][j].r += HALF_PI);
        (lines[i + 1]) && (lines[i + 1][j].r += HALF_PI);

        (lines[i - 1]) && (lines[i - 1][j].r += HALF_PI);
        (lines[i + 1]) && (lines[i + 1][j].r += HALF_PI);

        (lines[i][j - 1]) && (lines[i][j - 1].r += HALF_PI);
        (lines[i][j + 1]) && (lines[i][j + 1].r += HALF_PI);

        lines[i][j].r += HALF_PI;
      }

      display(r) {
        push()
        translate(this.x, this.y);
        // strokeWeight(10)
        // if (Math.random() * 10 > 10) {
        //   this.length = 6;
        // } else {
        //   this.length = 12
        // }
        strokeWeight(3)
        rotate(this.r);
        line(-this.length, -this.length, this.length, this.length);
        pop()
      }

      wave() {
        this.x = this.x + sin(this.y + waveSpeed) * waveAmt;
        waveSpeed += waveVol;
        // this.y += this.x + sin(this.y / 100 + waveSpeed) * 10;
      }

    }

    function setupOsc() {


    }
    let controls = {
      setWaveAmt: (val) => waveAmt = val,
      setWaveVol: (val) => waveVol = val,
      toggleWave: () => waveOn = !waveOn
    }

    function setupThis() {
      setupOsc();
      linesPerRow = width / (lineLength / 2 + spacing);
      rows = height / (lineLength / 2 + spacing);
      source = new p5.AudioIn();
      amplitude = new p5.Amplitude(0.9);
      amplitude.setInput(source);
      source.start();

      fft = new p5.FFT(0.8, 512);
      fft.setInput(source);

      for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < linesPerRow; j++) {
          let x = map(j, 0, linesPerRow, 0, width);
          let y = map(i, 0, rows, 0, height);
          row.push(new Line(x, y));
        }
        lines.push(row);

      }
    }

    function drawThis() {
      let vol = map(amplitude.getLevel(), 0, 1, 50, 255)
      background(0, 20, 45, 255);
      stroke(vol)
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < linesPerRow; j++) {
          if (Math.random() * 100 > 99.99) {
            lines[i][j].rotate(i, j);
          }
          lines[i][j].display();
          if (waveOn) {
            lines[i][j].wave()
          }
        }
      }

    }


    function mouseClicked() {
      getAudioContext().resume()
    };

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked,
      controls: controls
    }
  }(),
  fftColors: function () {
    let scene3Speed = 0;
    let angle = 0.01
    let amp = 10;
    let circleSize = 1;
    let circleAmt = 0;
    let threshold = 0;

    let controls = {
      speedUp: () => scene3Speed++,
      speedDown: () => scene3Speed--,
      setCircleSize: (val) => circleSize = val,
      setAmp: (val) => amp = val,
      setCircleAmt: (val) => circleAmt = val,
      setThreshHold: (val) => threshold = val,
    }

    function setupOsc() {

    }

    function drawCircles() {
      // let circleAmt = Math.ceil(width / amp) + 1;

      angle += 0.01;
      stroke(255);
      strokeWeight(1)
      noFill()
      let sinPlus = sin(PI * angle) * amp;
      let sinMinus = sin(-PI * angle) * amp;
      let cosPlus = cos(PI * angle) * amp;
      let cosMinus = cos(-PI * angle) * amp;

      for (let i = 1; i < circleAmt; i++) {
        let center = map(i, 0, circleAmt, 0, width);
        ellipse(center + sinPlus, height / 2 + cosPlus, circleSize)
        ellipse(center + sinMinus, height / 2 + cosMinus, circleSize)
      }
    }

    function setupThis() {
      source = new p5.AudioIn();
      source.start();

      fft = new p5.FFT(0.8, 512);
      fft.setInput(source);

      background(0, 0, 0, 255);
      setupOsc();
    }

    function drawThis() {
      copy(cnv, 0, 0, width, height, 0, scene3Speed, width, height);
      let spectrum = fft.analyze();
      // fft.linAverages();
      let bass = fft.getEnergy("bass") > threshold ? fft.getEnergy("bass") : 0;
      let mid = fft.getEnergy("mid") > threshold ? fft.getEnergy("mid") : 0;
      let treble = fft.getEnergy("highMid") > threshold ? fft.getEnergy("highMid") : 0;
      strokeWeight(5)
      stroke(treble, mid, bass);
      noFill();
      for (let i = 0; i < spectrum.length; i++) {
        let y = map(spectrum[i], 0, 255, 0, height);
        line(0, y, width, y);
      }
      drawCircles();
    }

    function mouseClicked() {
      getAudioContext().resume()
    };

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked,
      controls: controls
    }
  }(),

  circles: function () {
    let points = [];
    let pointsAmt = 500;
    let glSpeed = 0.01;
    let screenCenter;
    let plodeAmt = 0;
    let explode = false;
    let fillAlpha = 13;
    let breatheInterval;
    let showFlow = false;


    class Point {

      constructor(x, y) {
        this.pos = createVector(x, y);
        this.originalPos = this.pos;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.movement = 0;
      }

      applyForce(force) {
        force = force.normalize()
        this.acc = force;
      }

      flow() {
        let movement = createVector(this.originalPos.x + sin(this.pos.y / 100 + this.movement) * 10, 0)
        this.applyForce(movement);
        this.movement += glSpeed;
      }

      update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
      }

      explode() {
        let acc = p5.Vector.sub(this.pos, screenCenter);
        acc.normalize()
        acc.mult(plodeAmt)
        // this.vel.add(acc);
        this.pos.add(acc);
      }

      display() {
        stroke(0, 50, 100, 255);
        fill(255, fillAlpha);
        ellipse(Math.round(this.pos.x), Math.round(this.pos.y), 25);
      }
    }

    const controls = {
      toggleExplode: () => explode = !explode,
      setPlodeAmt: (val) => plodeAmt = val,
      breatheOn: () => {
        breathe();
      },
      breatheOff: () => {
        clearInterval(breatheInterval);
        explode = false;
      },
      startJitter: () => {
        for (let i = 0; i < pointsAmt; i++) {
          let jitter = createVector(Math.round(((Math.random()) * 2 - 1) * 50), Math.round(((Math.random()) * 2 - 1) * 50))
          points[i].pos.add(jitter);
        }
      },
      setSpeed: (val) => glSpeed = val,
      toggleFlow: () => showFlow = !showFlow,
      setFillAlpha: (val) => fillAlpha = val
    }

    function breathe() {
      explode = true;
      plodeAmt = 0.6;
      breatheInterval = setInterval(() => {
        plodeAmt = -plodeAmt;
      }, 3000);
    }

    function setupOsc() {



    }
    function setupThis() {
      screenCenter = createVector(width / 2, height / 2);
      for (let i = 0; i < pointsAmt; i++) {
        let randX = Math.random() * width;
        let randY = Math.random() * height;
        points.push(new Point(randX, randY));
      }
      setupOsc();
    }

    function drawThis() {
      background(0);
      for (let i = 0; i < pointsAmt; i++) {
        points[i].flow();
        // points[i].update();
        points[i].display();
        if (explode) {
          points[i].explode();
        }
        // point(width / 2 + sin(i / 100) * 100, i)
      }
    }

    function mouseClicked() {

    };


    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked,
      controls: controls
    }
  }(),

  spiral: function () {
    let circlesLength;
    let circles;
    let glSize;
    let glSpacing;
    let glSpeed;
    let glJitter;
    let lineProximity;
    let lastShownIndex;
    let showConnectLine;
    let showProxLine;
    let bgAlpha;


    const controls = {
      setSize: size => glSize = size,
      setSpacing: space => glSpacing = space,
      setSpeed: speed => glSpeed = speed,
      setJitter: amount => glJitter = amount,
      setLineProx: prox => lineProximity = prox,
      setLastIndex: index => lastShownIndex = index,
      toggleProxLines: () => showProxLine = !showProxLine,
      toggleConnectLines: () => showConnectLine = !showConnectLine,
      bounce: () => bounce(),
      addRow: () => lastShownIndex++,
      removeRow: () => lastShownIndex--,
      setBgAlpha: (val) => bgAlpha = val,
    }

    class Circle {
      constructor(position, positionInCircleArray) {
        this.x = width / 2;
        this.y = height / 2;
        this.speed = circlesLength / 2;
        this.positionInCircleArray = positionInCircleArray;
        this.size = glSize;
        this.movement = 0;
        this.position = position;
      }

      update() {
        this.movement += glSpeed * this.speed / 2;
        this.x = Math.round(width / 2 + (glSpacing * this.positionInCircleArray + 1 + Math.random() * glJitter) * sin(this.movement + this.position));
        this.y = Math.round(height / 2 + (glSpacing * this.positionInCircleArray + 1 + Math.random() * glJitter) * cos(this.movement + this.position));
      }

      display() {
        noFill();
        stroke(150);
        color("black");
        ellipse(this.x, this.y, glSize);
      }

      drawConnectingLine(nextCircle) {
        if (nextCircle && showConnectLine) {
          stroke(255, 100);
          // stroke(0);
          line(this.x, this.y, nextCircle.x, nextCircle.y);
        }
      }

      drawProxLine() {
        if (showProxLine) {
          for (let i = 0; i < circles.length; i++) {
            for (let j = 0; j < circles[i].length; j++) {
              if (dist(this.x, this.y, circles[i][j].x, circles[i][j].y) < glSize * (lineProximity)) {
                stroke(255, 10);
                line(this.x, this.y, circles[i][j].x, circles[i][j].y);
              }
            }
          }
        }
      }
    }

    function bounce() {
      let currentSpacing = glSpacing;
      glSpacing *= 1.2;
      let inter = setInterval(() => {
        glSpacing -= 0.01;
        if (glSpacing <= currentSpacing) {
          clearInterval(inter);
        }
      }, 10)
    }

    function setupOsc() {



    }

    function pushCircleGroup(i) {
      let circleGroup = [];
      let radius = 2 * PI * glSpacing;
      let circlesPerGroup = Math.floor(radius / glSize);
      for (let j = 0; j < circlesPerGroup; j++) {
        let position = map(j, 0, circlesPerGroup, 0, radius);
        circleGroup.push(new Circle(position, circlesLength));
      }
      circles.push(circleGroup);
      circlesLength += 1;
    }

    function setupThis() {
      circles = [];
      glSize = 50;
      glSpacing = glSize;
      glSpeed = 0;
      glJitter = 0;
      lineProximity = 0;
      circleRows = 100;
      circlesLength = 0;
      lastShownIndex = 1;
      showConnectLine = true;
      showProxLine = false;
      bgAlpha = 200;
      setupOsc();

      for (let i = 1; i < circleRows; i++) {
        pushCircleGroup();
      }
    }

    function drawThis() {
      background(10, 0, 50, bgAlpha);
      // background(255, bgAlpha);
      for (let i = 0; i < circlesLength; i++) {
        for (let j = 0; j < circles[i].length; j++) {
          let prevCircle = circles[i - 1] ? circles[i - 1][j] : null
          let thisCircle = circles[i][j];
          thisCircle.update();
          if (i <= lastShownIndex) {
            thisCircle.drawProxLine(circles[i]);
            thisCircle.drawConnectingLine(prevCircle);
            // thisCircle.display();
          }
        }
      }
    }

    function mouseClicked() {

    };

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked,
      controls: controls
    }
  }(),
}