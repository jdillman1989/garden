var saveCTX = null;
var animCTX = null;
var interactCTX = null;

var saveCanvas = null;
var animCanvas = null;
var interactCanvas = null;

var sprites = {};
var currentSelection = [];
var processing = false;

var tileSize = 0,
    mapW = 0,
    mapH = 0;

window.onload = function(){
  loadSprites();
  $.ajaxSetup({ cache: false });

  saveCanvas = document.getElementById('save');
  animCanvas = document.getElementById('animation');
  interactCanvas = document.getElementById('interaction');
  uiCanvas = document.getElementById('ui');

  saveCTX = saveCanvas.getContext("2d");
  animCTX = animCanvas.getContext("2d");
  interactCTX = interactCanvas.getContext("2d");
  uiCTX = uiCanvas.getContext("2d");

  loadGame();

  var dragging = false;
  var startSelect = 0;

  interactCanvas.addEventListener('mousedown', function(e) {
    dragging = true;
    startSelect = getCursorTile(e);
  }, false);

  interactCanvas.addEventListener('mouseup', function(e) {

    dragging = false;

    watch();

    var data = currentSelection.join(",");

    $.ajax({
      type: "GET",
      url: 'api/get-action.php',
      data: {data:data}
    });

  }, false);

  interactCanvas.addEventListener('mousemove', function(e) {
    var mousePos = getCursorTile(e);
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
};

function watch(){
  var watch = setInterval(function(){
    $.getJSON('saves/save.json', function(data){
      drawGame(data.map);
      if(!data.globals.processing){
        clearInterval(watch);
      }
    });
  }, 2000);
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

      tileSize = data.globals.tileSize,
      mapW = data.globals.mapW,
      mapH = data.globals.mapH;
      processing = data.globals.processing;

      var map = data.map;
      var name = data.character.name;
      var money = data.character.money;
      var inv = data.character.inv;

      if(data.globals.processing){
        watch();
      }

      drawGame(map);
      drawUI(name, money, inv);
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
  uiMapW = Math.floor(mapW / 2);
  uiTileSize = tileSize * 2;

  var items = Object.keys(inv);
  var quantities = Object.values(inv);

  console.log(items);
  console.log(items[0] + "-inv.png");
  var i = 0;
  for(var y = 0; y < 2; ++y){
    for(var x = 0; x < uiMapW; ++x){
      uiCTX.drawImage(sprites["slot.png"], x*uiTileSize, y*uiTileSize, uiTileSize, uiTileSize);
      if(i < items.length){
        uiCTX.drawImage(sprites[items[i] + "-inv.png"], x*uiTileSize, y*uiTileSize, uiTileSize, uiTileSize);
      }
      i++;
    }
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

function getCursorTile(e) {

  var rect = saveCanvas.getBoundingClientRect();
  var x = e.clientX - rect.left,
      y = e.clientY - rect.top;

  var tile = ((Math.ceil(y / (tileSize * 2)) - 1) * mapW) + (Math.ceil(x / (tileSize * 2)) - 1);
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



// 0  1  2  3  4  5  6  7
// 8  9  10 11 12 13 14 15
// 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31



