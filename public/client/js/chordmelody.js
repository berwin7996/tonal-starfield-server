var keys = {
    'C': 16.35,
        'C#/Db': 17.32,
        'D': 18.35,
        'D#/Eb': 19.45,
        'E': 20.6,
        'F': 21.83,
        'F#/Gb': 23.12,
        'G': 24.5,
        'G#/Ab': 25.96,
        'A': 27.5,
        'A#/Bb': 29.14,
        'B': 30.87
};

var waveforms = {
    'sine': 'sine',
    'square': 'square',
    'sawtooth': 'sawtooth',
    'triangle': 'triangle'
};

//Configurations
var octave = 3;
var key = keys.A;
var base;
//used with calculating notes
var a = Math.pow(2, 1 / 12);
var range = 16;
var waveform = waveforms.sawtooth;
var chordType;
var melodyType;
var context1;
var notesPerMeasure = 4;
var qtrNote = 600;
var eighthNote = qtrNote / 2;
var minNote = eighthNote;
var time;
var melodyInt;
var chor1, chor2, chor3, melody, chordGain, melodyGain;
var isRunning = false;

//holds the order of notes being played
var melodycount = 0;



//All browsers, hooray
context1 = new AudioContext();

//volume
chordGain = context1.createGain();
melodyGain = context1.createGain();
chordGain.gain.value = 0.05;
melodyGain.gain.value = 0.1;

//End Configurations

init = function () {

    updateBase();
    updateWaveformType();
    buildScale();

    //hook everything up
    /*chor1 = context1.createOscillator();
    chor2 = context1.createOscillator();
    chor3 = context1.createOscillator();*/
    melody = context1.createOscillator();

    /*chor1.connect(chordGain);
    chor2.connect(chordGain);
    chor3.connect(chordGain);*/
    melody.connect(melodyGain);
    chordGain.connect(context1.destination);
    melodyGain.connect(context1.destination);

    //Set type of wave for chord
    /*chor1.type = chordType;
    chor2.type = chordType;
    chor3.type = chordType;*/

    //Set type of wave for melody
    melody.type = melodyType;

    melody.frequency.value = base;
    /*chor1.frequency.value = notes[chordProg[0][0]];
    chor2.frequency.value = notes[chordProg[0][1]];
    chor3.frequency.value = notes[chordProg[0][2]];*/
};

// Build scale
var buildScale = function () {
    notes = [];
    var freq = base;
    var step = 0;
    for (var i = 0; i < range; i++) {
        notes[i] = freq;
        step++;
        if (i % 7 !== 2 && i % 7 !== 6) {
            step++;
        }
        freq = base * Math.pow(a, step);
    }
};

//I   V    vi     IV
//Standard Pop Progression
chordProg = [
    [0, 2, 4],
    [4, 6, 8],
    [5, 7, 9],
    [3, 5, 7]
];

//melody function
var melodyFun = function () {
    time++;
    //chord progression    
    if (time % (notesPerMeasure * (qtrNote / minNote)) === 0 && time !== 0) {
        chord++;
        chord %= 4;
        /*chor1.frequency.value = notes[chordProg[chord][0]];
        chor2.frequency.value = notes[chordProg[chord][1]];
        chor3.frequency.value = notes[chordProg[chord][2]];*/
    }
    //

    //*********************************************************************************************8
    //change this random function
    //Random note length
    if (time % (Math.floor(Math.random() * (qtrNote / minNote))) === 0) {

        melodycount++;


        //random note 0 to range-1
        //change this random function

        //var note = Math.floor((Math.random() * (range - 1)));
        
        var note = outputNotes[melodycount%outputNotes.length];
        freq = notes[note];

        $('#notes').text(note);
        melody.frequency.value = freq;
    }
};



    function createButtons(context1) {
        var buttonDiv = document.createElement('div');
        buttonDiv.className = 'buttonDiv';
        var end = document.createElement('input');
        end.type = 'button';
        end.value = 'end';
        end.onclick = endFunc;
        end.className = 'button_end';
        buttonDiv.appendChild(end);
        context1.appendChild(buttonDiv);
    }

window.onload = function () {

    createButtons(document.body);
    modifierFunc(document.body);
};

var beginFunc = function () {
    if (!isRunning) {
        init();
        chord = 0;
        step = 0;
        time = 0;
        //run melody function based on minimum note length
        melodyInt = setInterval(melodyFun, minNote);
        melody.start(0);
        /*chor1.start(0);
        chor2.start(0);
        chor3.start(0);*/

        isRunning = true;
    } else {
        endFunc();
        beginFunc();
    }
};

// Click to end the madness
var endFunc = function () {
    if (isRunning) {
        /*chor1.stop(0);
        chor2.stop(0);
        chor3.stop(0);*/
        melody.stop(0);
        clearInterval(melodyInt);
        isRunning = false;
    }
};

var updateBase = function () {
    base = key * Math.pow(2, octave);
};
var updateWaveformType = function () {
    chordType = waveform;
    melodyType = waveform;
};

    function checkBpmInput(ob) {
        var invalidChars = /[^0-9]/gi;
        if (invalidChars.test(ob.value)) {
            ob.value = ob.value.replace(invalidChars, '');
        }
        if (ob.value < 40) {
            ob.value = 40;
        } else if (ob.value > 300) {
            ob.value = 300;
        }

    }

    function restart() {
        if (isRunning) {
            endFunc();
            beginFunc();
        }
    }
