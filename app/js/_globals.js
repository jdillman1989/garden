// Canvas Element
var saveCanvas = null,
    animCanvas = null,
    interactCanvas = null;

// Canvas Draw
var saveCTX = null,
    animCTX = null,
    interactCTX = null;

// State Globals
var currentSelection = [],
    currentSlot = 0,
    processing = false;

// Static Globals
var tileSize = 0,
    mapW = 0,
    mapH = 0,
    slotSize = 0,
    uiW = 0,
    uiH = 0;

// Animation States
var animals = [],
    plants = [];

// WebFont.load({
//   google: {
//     families: ['Press Start 2P']
//   },
//   active: function() {
//     displayText();
//   }
// });
