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
    uiH = 0,
    sprites = {},
    animals = [];

// WebFont.load({
//   google: {
//     families: ['Press Start 2P']
//   },
//   active: function() {
//     displayText();
//   }
// });

window.onload = function(){

  ///////////
  // Setup //
  ///////////

  loadSprites();
  $.ajaxSetup({ cache: false });

  // var c = document.createElement('canvas');
  // var ctx = c.getContext('2d');
  // var W, H;
  // document.body.appendChild(c);

  saveCanvas = document.getElementById('save');
  animCanvas = document.getElementById('animation');
  interactCanvas = document.getElementById('interaction');
  uiCanvas = document.getElementById('ui');

  saveCTX = saveCanvas.getContext("2d");
  animCTX = animCanvas.getContext("2d");
  interactCTX = interactCanvas.getContext("2d");
  uiCTX = uiCanvas.getContext("2d");

  updateTime();

  loadGame();

  var dragging = false;
  var startSelect = 0;

  ////////////////////////
  // Interaction Events //
  ////////////////////////

  interactCanvas.addEventListener('mousedown', function(e) {
    dragging = true;
    startSelect = getCursorTile(e, false);
  }, false);

  interactCanvas.addEventListener('mouseup', function(e) {

    dragging = false;

    watch();

    var data = currentSelection.join(",");

    $.ajax({
      type: "GET",
      url: 'api/get-action.php',
      data: {tiles:data, item:currentSlot}
    });

  }, false);

  interactCanvas.addEventListener('mousemove', function(e) {
    var mousePos = getCursorTile(e, false);
    highlightTile(mousePos);
    if(dragging){

      var startyIndex = Math.floor(startSelect / mapW),
          startxIndex = startSelect - (startyIndex * mapW),
          endyIndex = Math.floor(mousePos / mapW),
          endxIndex = mousePos - (endyIndex * mapW);

      // Drag Direction ↖
      if (startyIndex >= endyIndex && startxIndex >= endxIndex) {
        selectTiles(endyIndex, endxIndex, startyIndex, startxIndex);
      }
      // Drag Direction ↗
      else if (startyIndex >= endyIndex && startxIndex <= endxIndex) {
        selectTiles(endyIndex, startxIndex, startyIndex, endxIndex);
      }
      // Drag Direction ↙
      else if (startyIndex <= endyIndex && startxIndex >= endxIndex) {
        selectTiles(startyIndex, endxIndex, endyIndex, startxIndex);
      }
      // Drag Direction ↘
      else{
        selectTiles(startyIndex, startxIndex, endyIndex, endxIndex);
      }
    }
  }, false);

  ///////////////
  // UI Events //
  ///////////////

  uiCanvas.addEventListener('mouseup', function(e) {
    thisSlot = getCursorTile(e, true);
    changeSlot(thisSlot);
  }, false);

  /////////////////
  // Update Time //
  /////////////////

  var check = setInterval(function(){
    updateTime();
    look();
  }, 120000);

  ////////////////
  // Animations //
  ////////////////

  var setIdle = setInterval(function(){
    for(var i = 0; i < animals.length; ++i){
      var rng = Math.floor(Math.random() * 4);
      if (!rng) {
        animate(animals[i].id, 1, 150);
      }
      if (rng == 1) {
        animate(animals[i].id, 2, 700);
      }
    }
  }, 1500);

  var setMove = setInterval(function(){
    for(var i = 0; i < animals.length; ++i){
      var rng = Math.floor(Math.random() * 4);
      if (!rng) {
        var adjObj = adjacentTiles(animals[i].tile);
        var adj = Object.keys(adjObj.all);
        var dest = adj[Math.floor(Math.random() * adj.length)];
        var coordsDest = getTileCoordinates(dest);
        animateMove(animals[i].id, [3,4], coordsDest);
      }
    }
  }, 5000);
};

function animate(animal, frame, duration){
  animals[animal].frame = frame;
  updateAnim();
  var thisAnim = setTimeout(function(){
    animals[animal].frame = 0;
    updateAnim();
  }, duration);
}

function animateMove(animal, frames, dest){
  // console.log("dest: ");
  // console.log(dest);
  // console.log("animal: ");
  // console.log(animals[animal]);
  if (animals[animal].x != dest.x || animals[animal].y != dest.y){

    if (animals[animal].x < dest.x) {
      animals[animal].x++;
    }
    else{
      animals[animal].x--;
    }

    if (animals[animal].y < dest.y) {
      animals[animal].y++;
    }
    else{
      animals[animal].y--;
    }
    updateAnim();
    window.requestAnimationFrame(function(){
      animateMove(animal, frames, dest);
    });
  }
  else{
    animals[animal].tile = getCoordinatesTile(dest.x, dest.y);
  }
}

function adjacentTiles(tile){

  var obj = { "far":{}, "close":{}, "all":{} };

  var adj = {
    nw: (tile - (mapW + 1)),
    ne: (tile - (mapW - 1)),
    sw: (tile + (mapW - 1)),
    se: (tile + (mapW + 1)),
    n: (tile - mapW),
    e: (tile - 1),
    w: (tile + 1),
    s: (tile + mapW)
  };

  var bounds = Object.values(adj);
  var dir = Object.keys(adj);

  for (var i = 0; i < bounds.length; i++) {
    if (bounds[i] > -1 && bounds[i] <= (mapW * mapH)) {
      if (dir[i].length > 1) {
        obj["far"][dir[i]] = bounds[i];
      }
      else{
        obj["close"][dir[i]] = bounds[i];
      }
      obj["all"][dir[i]] = bounds[i];
    }
  }

  return obj;
}

function watch(){
  var watch = setInterval(function(){
    $.getJSON('saves/save.json', function(data){
      drawGame(data.map);
      drawUI(data.character.name, data.character.money, data.character.inv);
      if(!data.globals.processing){
        clearInterval(watch);
      }
    });
  }, 1500);
}

function look(){
  if (!processing) {
    $.getJSON('saves/save.json', function(data){
      drawGame(data.map);
      drawUI(data.character.name, data.character.money, data.character.inv);
    });
  }
}

function updateTime(){
  $.ajax({
    type: "GET",
    url: 'api/time.php'
  });
}

function newGame(){
  $.ajax({
    type: "GET",
    url: 'api/init.php',
    success: function(){
      loadGame();
    },
    failure: function(){
      $('.message').text("server error: init");
    }
  });
}

function loadGame(){
  $.getJSON('saves/save.json', function(data){
    if (data.globals.init){

      tileSize = data.globals.tileSize;
      mapW = data.globals.mapW;
      mapH = data.globals.mapH;
      processing = data.globals.processing;

      slotSize = data.globals.slotSize;
      uiW = data.globals.uiW;
      uiH = data.globals.uiH;

      var map = data.map;
      var name = data.character.name;
      var money = data.character.money;
      var inv = data.character.inv;
      var pets = data.pets;

      if(data.globals.processing){
        watch();
      }

      drawGame(map);
      drawUI(name, money, inv);
      drawAnim(pets);
      updateAnim();

    }
    else{
      newGame();
    }
  });
}

function drawGame(map){
  saveCTX.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
  for(var y = 0; y < mapH; ++y){
    for(var x = 0; x < mapW; ++x){
      var currentPos = ((y*mapW)+x);
      saveCTX.fillStyle = map[currentPos].render.base;
      saveCTX.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);

      var thisSprite = map[currentPos].render.sprite;
      if(thisSprite){
        saveCTX.drawImage(sprites[thisSprite], x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawUI(name, money, inv){
  uiCTX.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

  var items = Object.keys(inv);
  var quantities = Object.values(inv);

  var i = 0;
  for(var y = 0; y < uiH; ++y){
    for(var x = 0; x < uiW; ++x){
      var slot = sprites["slot.png"];
      if(i == currentSlot){
        slot = sprites["slot-sel.png"];
      }
      uiCTX.drawImage(slot, x*slotSize, y*slotSize, slotSize, slotSize);
      if(i < items.length){
        uiCTX.drawImage(sprites[items[i] + "-inv.png"], x*slotSize, y*slotSize, slotSize, slotSize);
      }
      i++;
    }
  }

  uiCTX.font = "12px Courier";
  uiCTX.fillStyle = "white";
  uiCTX.fillText(name + "  $" + money, 0, (slotSize*uiH) + 15);
}

function drawAnim(pets){

  var startTiles = [
    getTileCoordinates(52),
    getTileCoordinates(53),
    getTileCoordinates(51),
    getTileCoordinates(54),
    getTileCoordinates(26),
    getTileCoordinates(29)
  ];

  var types = Object.keys(pets);
  var quantities = Object.values(pets);
  var k = 0;

  for (var i = 0; i < types.length; i++) {
    for (var j = 0; j < quantities[i]; j++) {

      var that = {};

      that.x = startTiles[j]['x'];
      that.y = startTiles[j]['y'];
      that.tile = getCoordinatesTile(that.x, that.y);
      that.id = k;
      that.frame = 0;
      that.sprite = sprites[types[i] + ".png"];

      animals.push(that);
      k++;
    }
  }
}

function updateAnim(){
  animCTX.clearRect(0, 0, animCanvas.width, animCanvas.height);
  for(var i = 0; i < animals.length; ++i){
    animCTX.drawImage(
      animals[i].sprite,
      animals[i].frame,  // sprite x
      0,                 // sprite y
      tileSize,          // sprite width
      tileSize,          // sprite height
      animals[i].x,      // canvas x
      animals[i].y,      // canvas y
      tileSize,          // canvas draw width
      tileSize           // canvas draw height
    );
  }
}

function loadSprites(){
  $.ajax({
    type: "GET",
    url: 'api/load_sprites.php',
    complete: function(response) {
      var data = JSON.parse(response.responseText);
      for (var i = 0; i < data.length; i++) {
        var thisSprite = new Image();
        thisSprite.src = data[i];
        var spriteName = data[i].replace("sprites/", "");
        sprites[spriteName] = thisSprite;        
      }
    }
  });
}

function getCursorTile(e, ui) {

  if(ui){
    var size = slotSize,
        width = uiW,
        rect = uiCanvas.getBoundingClientRect();
  }
  else{
    var size = tileSize,
        width = mapW,
        rect = saveCanvas.getBoundingClientRect();
  }

  var x = e.clientX - rect.left,
      y = e.clientY - rect.top;

  var tile = ((Math.ceil(y / (size * 2)) - 1) * width) + (Math.ceil(x / (size * 2)) - 1);
  return tile;
}

function highlightTile(tile) {
  interactCTX.clearRect(0, 0, interactCanvas.width, interactCanvas.height);

  var coords = getTileCoordinates(tile);
  interactCTX.fillStyle = "rgba(180, 255, 180, 0.6)";
  interactCTX.fillRect(coords.x, coords.y, tileSize, tileSize);
}

function highlightTiles(tiles) {
  interactCTX.clearRect(0, 0, interactCanvas.width, interactCanvas.height);

  for (var i = 0; i < tiles.length; i++) {
    var coords = getTileCoordinates(tiles[i]);
    interactCTX.fillStyle = "rgba(180, 255, 180, 0.6)";
    interactCTX.fillRect(coords.x, coords.y, tileSize, tileSize);
  }
}

function getTileCoordinates(tile){

  var yIndex = Math.floor(tile / mapW);
  var xIndex = tile - (yIndex * mapW);

  var y = yIndex * tileSize;
  var x = xIndex * tileSize;
  return {x:x, y:y};
}

function getCoordinatesTile(x, y){
  var tile = ((Math.ceil(y / tileSize)) * mapW) + (Math.ceil(x / tileSize));
  return tile;
}

function selectTiles(startyIndex, startxIndex, endyIndex, endxIndex) {

  var selectedTiles = [];

  for(var y = startyIndex; y <= endyIndex; ++y){
    for(var x = startxIndex; x <= endxIndex; ++x){
      var currentPos = ((y*mapW)+x);
      selectedTiles.push(currentPos);
    }
  }

  currentSelection = selectedTiles;

  highlightTiles(selectedTiles);
}

function changeSlot(slot){
  currentSlot = slot;
  // uiCTX.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

  var i = 0;
  for(var y = 0; y < uiH; ++y){
    for(var x = 0; x < uiW; ++x){
      var slotSprite = sprites["slot.png"];
      if(i == slot){
        slotSprite = sprites["slot-sel.png"];
      }
      uiCTX.drawImage(slotSprite, x*slotSize, y*slotSize, slotSize, slotSize);
      i++;
    }
  }
}

// 0  1  2  3  4  5  6  7
// 8  9  10 11 12 13 14 15
// 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31
