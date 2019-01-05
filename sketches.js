/*
  Module of different p5 sketches. Each on can be plugged into a sketch.js file,
  calling their setupThis and drawThis functions in their respective p5 functions.
*/

let sketches = {

  /*************************************************
   * First Sketch
  *************************************************/
  new: function () {


    function setupThis() {

    }


    function drawThis() {

    }



    function mouseClicked() {

    };




    function onMidiNote(note, velocity) {

    }

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked
    }
  }(),
  /*************************************************
  * Second Sketch
 *************************************************/
  new: function () {


    function setupThis() {

    }


    function drawThis() {

    }



    function mouseClicked() {

    };




    function onMidiNote(note, velocity) {

    }

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked
    }
  }(),
  /*************************************************
    * Third Sketch
   *************************************************/
  new: function () {


    function setupThis() {

    }


    function drawThis() {

    }



    function mouseClicked() {

    };




    function onMidiNote(note, velocity) {

    }

    return {
      setupThis: setupThis,
      drawThis: drawThis,
      mouseClicked: mouseClicked
    }
  }(),
}